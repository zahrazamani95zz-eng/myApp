import { AiSession, Conversation, ConversationType } from "../../domain";

import type { ConversationRecord } from "../database/ChatDatabase";

export class ConversationMapper {
  static toDomain(record: ConversationRecord): Conversation {
    return Conversation.reconstitute({
      id: record.id,

      title: record.title,

      type: record.type as ConversationType,

      participantIds: record.participantIds,

      lastMessageId: record.lastMessageId,

      createdAt: record.createdAt,

      updatedAt: record.updatedAt,

      isPinned: record.isPinned,

      last_message: record.last_message,

      aiSession: record.aiSession
        ? AiSession.create(record.aiSession)
        : undefined,
    });
  }

  static toPersistence(conversation: Conversation): ConversationRecord {
    return {
      id: conversation.id,

      title: conversation.title,

      type: conversation.type,

      participantIds: conversation.participantIds,

      lastMessageId: conversation.lastMessageId,

      createdAt: conversation.createdAt,

      updatedAt: conversation.updatedAt,

      isPinned: conversation.isPinned,

      last_message: conversation.last_message,

      aiSession: conversation.aiSession?.toJSON(),
    };
  }
}
