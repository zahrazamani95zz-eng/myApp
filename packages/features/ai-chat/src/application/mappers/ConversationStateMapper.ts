import type { Conversation } from "@super-app/features-chat-core/domain";
import type { ConversationState } from "../../store/conversation.types";

export class ConversationStateMapper {
  static toState(conversation: Conversation): ConversationState {
    return {
      id: conversation.id,
      title: conversation.title ?? "New Chat",
      updatedAt: conversation.updatedAt.toISOString(),
      unreadCount: 0,
      lastMessage: undefined,
      isPinned: conversation.isPinned,
    };
  }
}
