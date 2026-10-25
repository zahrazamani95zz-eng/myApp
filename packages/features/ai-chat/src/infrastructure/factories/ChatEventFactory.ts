import {
  Message,
  MessageContent,
  MessageReceivedEvent,
  StreamChunkReceivedEvent,
  TranscriptionReceivedEvent,
  MessageStatus,
  MessageType,
  type AiChatEvent,
} from "../../domain";

import type { MqttChatPayload } from "../models/MqttChatPayload";

export class ChatEventFactory {
  static create(payload: MqttChatPayload): AiChatEvent {
    const eventType = (payload.event_type ?? payload.type ?? "").toLowerCase();
    const isChunk =
      eventType === "message_chunk" ||
      eventType === "stream_chunk" ||
      eventType === "chat_response_chunk" ||
      payload.type?.toLowerCase() === "chat_response_chunk";

    if (
      eventType === "transcription_completed" ||
      eventType === "transcription"
    ) {
      return new TranscriptionReceivedEvent(
        payload.chat_id,
        payload.correlation_id,
        payload.corrected_text ?? payload.text ?? payload.raw_text ?? "",
      );
    }

    if (isChunk) {
      return new StreamChunkReceivedEvent(
        payload.chat_id,
        payload.correlation_id,
        payload.response ?? payload.content ?? "",
        payload.done ?? false,
      );
    }

    const isFinalResponse =
      eventType === "message" ||
      eventType === "message_completed" ||
      payload.type?.toLowerCase() === "chat_response";

    if (isFinalResponse) {
      const message = Message.create({
        conversationId: payload.chat_id,
        id: crypto.randomUUID(),
        correlationId: payload.correlation_id,
        senderId: "assistant",
        type: MessageType.TEXT,
        status: MessageStatus.SENT,
        content: MessageContent.create(
          payload.response ?? payload.content ?? "",
        ),
        attachments: [],
      });

      return new MessageReceivedEvent(message);
    }

    throw new Error(
      `Unknown MQTT event: ${payload.event_type ?? payload.type}`,
    );
  }
}
