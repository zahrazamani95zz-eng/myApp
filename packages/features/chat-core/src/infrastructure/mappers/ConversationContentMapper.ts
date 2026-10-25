import {
  Message,
  MessageContent,
  MessageStatus,
  MessageType,
} from "../../domain";

import type { ConversationContentMessageDto } from "../models/ConversationContentResponse";

export class ConversationContentMapper {
  static toDomain(
    item: ConversationContentMessageDto,
    chatId: string,
  ): Message {
    return Message.reconstitute({
      id: `${chatId}:${item.role}:${item.timestamp}`,

      conversationId: chatId,

      senderId: item.role === "user" ? "user" : "assistant",

      type: MessageType.TEXT,

      status: MessageStatus.SENT,

      content: MessageContent.create(item.content),

      attachments: [],

      createdAt: new Date(item.timestamp),

      updatedAt: new Date(item.timestamp),
    });
  }
}
