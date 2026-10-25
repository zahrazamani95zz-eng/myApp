import { Conversation, ConversationType } from "../../domain";

import { ConversationHistoryItemDto } from "../models/ConversationHistoryResponse";

import { ConversationMapper } from "./ConversationMapper";

export class ConversationHistoryMapper {
  static toDomain(item: ConversationHistoryItemDto): Conversation {
    return ConversationMapper.toDomain({
      id: item.chat_id,

      title: item.title,

      type: ConversationType.PRIVATE,

      participantIds: [],

      isPinned: item.is_pinned,

      createdAt: new Date(item.created_at),

      updatedAt: new Date(item.updated_at),

      last_message: "",
    });
  }
}
