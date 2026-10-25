import type { ConversationPage, MessagePage } from "../../domain";

export interface ChatHistoryGateway {
  loadConversations(page: number, perPage: number): Promise<ConversationPage>;

  loadConversationContent(
    chatId: string,
    page: number,
    perPage: number,
  ): Promise<MessagePage>;

  pinConversation(chatId: string, pinned: boolean): Promise<void>;

  deleteConversation(chatId: string): Promise<void>;

  sendMessageFeedback(messageId: string, isLike: boolean): Promise<void>;
}
