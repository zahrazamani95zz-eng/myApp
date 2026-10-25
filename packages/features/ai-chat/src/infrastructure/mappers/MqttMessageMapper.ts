import type { AiChatEvent } from "../../domain";

import { ChatEventFactory } from "../factories/ChatEventFactory";

import type { MqttChatPayload } from "../models/MqttChatPayload";

export class MqttMessageMapper {
  static toDomain(topic: string, payload: string): AiChatEvent {
    const data = this.parse(payload);

    console.log("FACTORY PAYLOAD:", data);

    return ChatEventFactory.create(data);
  }

  private static parse(payload: string): MqttChatPayload {
    try {
      return JSON.parse(payload) as MqttChatPayload;
    } catch {
      throw new Error("Invalid MQTT payload");
    }
  }
}
