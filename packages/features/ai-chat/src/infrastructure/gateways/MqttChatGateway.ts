import type { AiChatEventGateway } from "../../application";

import type { AiChatEvent, Message } from "../../domain";
import { MessageReceivedEvent } from "../../domain";

import mqtt, { type MqttClient } from "mqtt";

import { MqttMessageMapper } from "../mappers";
import { normalizeChatError } from "@super-app/features-chat-core/infrastructure";
import { buildChatReplyTopic } from "./mqtt-topic";

export interface MqttChatGatewayConfig {
  url: string;
  username?: string;
  password?: string;
  topicPrefix?: string;
  replyTopic?: (chatId: string) => string;
}

export class MqttChatGateway implements AiChatEventGateway {
  private readonly config: MqttChatGatewayConfig;
  private readonly listeners = new Set<(event: AiChatEvent) => void>();

  private replySessionId?: string;
  private readonly errorListeners = new Set<(error: Error) => void>();

  private client?: MqttClient;

  constructor(config: MqttChatGatewayConfig) {
    this.config = config;
  }

  private subscribedTopics = new Set<string>();

  private currentChatId?: string;
  private readonly topicVersions = new Map<string, number>();

  async connect(): Promise<void> {
    if (this.client) return;

    const username = this.config.username?.trim();
    const password = this.config.password;
    if (!username || !password) {
      throw new Error(
        "MQTT credentials are not configured. Refusing to connect with a default or anonymous identity.",
      );
    }
    if (username.toLowerCase() === "admin") {
      throw new Error(
        "The shared MQTT admin identity is not allowed. Configure a least-privilege client identity.",
      );
    }

    const clientId = this.replySessionId ?? `super-app-${crypto.randomUUID()}`;
    this.replySessionId = clientId;

    this.client = mqtt.connect(this.config.url, {
      clientId,

      username,

      password,

      clean: true,

      reconnectPeriod: 3000,

      connectTimeout: 10000,
    });

    this.client.on("connect", () => {
      console.log("🟢 MQTT CONNECTED");

      for (const topic of this.subscribedTopics) {
        this.client?.subscribe(topic, (err) => {
          if (err) {
            console.error("MQTT resubscribe failed:", err);
          }
        });
      }
    });

    this.client.on("message", (topic, payload) => {
      try {
        const event = MqttMessageMapper.toDomain(topic, payload.toString());

        this.notify(event);
      } catch (error) {
        // A message can be published on the subscribed topic that is not a
        // chat-domain event we currently handle. It must not fail the active
        // chat request after a valid response has already been received.
        console.warn("Ignored unsupported MQTT payload:", error);
      }
    });

    this.client.on("reconnect", () => {
      console.log("🟡 MQTT RECONNECT");
    });

    this.client.on("offline", () => {
      console.log("⚪ MQTT OFFLINE");
    });

    this.client.on("close", () => {
      console.log("🔴 MQTT CLOSED");
    });

    this.client.on("error", (error) => {
      const normalized = normalizeChatError(
        error,
        "ارتباط با سرویس برقرار نشد. لطفاً دوباره تلاش کنید.",
      );
      console.error("MQTT ERROR:", normalized);
      this.emitError(normalized);
    });
  }

  async subscribeToChat(chatId: string): Promise<void> {
    const requestVersion = (this.topicVersions.get(chatId) ?? 0) + 1;
    this.topicVersions.set(chatId, requestVersion);

    if (!this.client) {
      await this.connect();
    }

    await this.waitForConnection();

    if (this.topicVersions.get(chatId) !== requestVersion) {
      return;
    }

    const client = this.client;
    if (!client) {
      throw new Error("MQTT client is not initialized.");
    }

    if (this.topicVersions.get(chatId) !== requestVersion) {
      return;
    }

    const topic = buildChatReplyTopic(chatId, this.config.replyTopic);

    if (this.subscribedTopics.has(topic)) {
      this.currentChatId = chatId;
      return;
    }

    client.subscribe(topic, (err) => {
      if (err) {
        const normalized = normalizeChatError(
          err,
          "اشتراک دریافت پاسخ با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
        );
        console.error("Subscribe failed", normalized);
        this.emitError(normalized);
      } else {
        console.log("MQTT chat subscription established.");
      }
    });

    this.subscribedTopics.add(topic);

    this.currentChatId = chatId;
  }

  private async waitForConnection(): Promise<void> {
    if (!this.client) {
      throw new Error("MQTT client is not initialized.");
    }

    if (this.client.connected) {
      return;
    }

    const client = this.client;

    if (!client) {
      throw new Error("MQTT client is not initialized.");
    }

    await new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup();
        reject(new Error("MQTT connection timed out."));
      }, 50000);

      const onConnect = () => {
        cleanup();
        resolve();
      };

      const onError = (error: Error) => {
        cleanup();
        reject(error);
      };

      const cleanup = () => {
        clearTimeout(timeout);
        client.off("connect", onConnect);
        client.off("error", onError);
      };

      client.once("connect", onConnect);
      client.once("error", onError);
    });
  }

  async unsubscribeFromChat(chatId: string): Promise<void> {
    // Invalidate only this conversation's in-flight subscribe operation.
    this.topicVersions.set(chatId, (this.topicVersions.get(chatId) ?? 0) + 1);
    this.unsubscribeChatTopic(chatId);
  }

  private unsubscribeChatTopic(chatId: string): void {
    if (!this.client) return;

    const topic = buildChatReplyTopic(chatId, this.config.replyTopic);

    this.client.unsubscribe(topic);
    this.subscribedTopics.delete(topic);

    if (this.currentChatId === chatId) {
      this.currentChatId = undefined;
    }
  }

  async disconnect(): Promise<void> {
    if (!this.client) return;

    this.client.end(true);

    this.client = undefined;

    this.subscribedTopics.clear();
    this.topicVersions.clear();

    this.currentChatId = undefined;
  }

  onEvent(callback: (event: AiChatEvent) => void): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  getReplySessionId(): string | undefined {
    return this.replySessionId;
  }

  onError(callback: (error: Error) => void): () => void {
    this.errorListeners.add(callback);
    return () => this.errorListeners.delete(callback);
  }

  private emitError(error: Error): void {
    this.errorListeners.forEach((listener) => listener(error));
  }

  simulateIncoming(message: Message) {
    this.notify(new MessageReceivedEvent(message));
  }

  protected notify(event: AiChatEvent): void {
    this.listeners.forEach((listener) => listener(event));
  }
}
