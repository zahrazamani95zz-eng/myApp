import {
  Attachment,
  AttachmentType,
  Message,
  MessageContent,
  MessageStatus,
  MessageType,
} from "../../domain";

import type { MessageRecord } from "../database/ChatDatabase";

export class MessageMapper {
  static toState(message: Message) {
    return {
      id: message.id,

      correlationId: message.correlationId ?? message.id,

      conversationId: message.conversationId,

      senderId: message.senderId,

      text: message.content.text,

      type: message.type,

      status: message.status,

      createdAt: message.createdAt.toISOString(),

      updatedAt: message.updatedAt.toISOString(),

      streaming: false,

      audioId: message.audioId,
      audioUrl: message.audioUrl,
      audioFormat: message.audioFormat,
      durationMs: message.durationMs,
      feedback: message.feedback,
      transcription: message.transcription,
      error: message.error,
    };
  }

  static toDomain(record: MessageRecord): Message {
    const attachments = record.attachmentsJson
      ? (JSON.parse(record.attachmentsJson) as Array<{
          id: string;
          url: string;
          fileName: string;
          mimeType: string;
          type: AttachmentType;
          size: number;
        }>)
      : [];

    return Message.reconstitute({
      id: record.id,

      conversationId: record.conversationId,

      senderId: record.senderId,

      type: record.type as MessageType,

      status: record.status as MessageStatus,

      content: MessageContent.create(record.content),

      attachments: attachments.map((attachment) =>
        Attachment.reconstitute(attachment),
      ),

      replyToMessageId: record.replyToMessageId,

      correlationId: record.correlationId,

      audioId: record.audioId,
      audioUrl: record.audioUrl,
      audioFormat: record.audioFormat,
      durationMs: record.durationMs,

      feedback: record.feedback,
      transcription: record.transcription,
      error: record.error,

      createdAt: record.createdAt,

      updatedAt: record.updatedAt,
    });
  }

  static toPersistence(message: Message): MessageRecord {
    return {
      id: message.id,

      conversationId: message.conversationId,

      senderId: message.senderId,

      type: message.type,

      status: message.status,

      content: message.content.text,

      attachmentsJson: JSON.stringify(
        message.attachments.map((attachment) => ({
          id: attachment.id,
          url: attachment.url,
          fileName: attachment.fileName,
          mimeType: attachment.mimeType,
          type: attachment.type,
          size: attachment.size,
        })),
      ),

      replyToMessageId: message.replyToMessageId,

      correlationId: message.correlationId,

      audioId: message.audioId,
      audioUrl: message.audioUrl?.startsWith("blob:")
        ? undefined
        : message.audioUrl,
      audioFormat: message.audioFormat,
      durationMs: message.durationMs,
      feedback: message.feedback,
      transcription: message.transcription,
      error: message.error,

      createdAt: message.createdAt,

      updatedAt: message.updatedAt,
    };
  }
}
