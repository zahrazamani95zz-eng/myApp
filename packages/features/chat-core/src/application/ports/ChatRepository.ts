import type {
  Conversation,
  ConversationPage,
  Message,
  MessageStatus,
} from "../../domain";
export interface ChatRepository {
  // Conversations
  ensureConversation(conversation: Conversation): Promise<void>;

  loadConversations(page: number, perPage: number): Promise<ConversationPage>;

  loadConversation(id: string): Promise<Conversation | null>;

  replaceConversationId(
    temporaryId: string,
    conversationId: string,
  ): Promise<void>;

  deleteConversation(conversationId: string): Promise<void>;

  // Messages
  loadMessages(conversationId: string): Promise<Message[]>;

  loadMessage(messageId: string): Promise<Message | null>;

  saveMessage(message: Message): Promise<void>;

  saveMessages(messages: Message[]): Promise<void>;

  updateMessage(message: Message): Promise<void>;

  updateMessageStatus(messageId: string, status: MessageStatus): Promise<void>;

  updateMessageFeedback(
    messageId: string,
    feedback: "like" | "dislike",
  ): Promise<void>;

  updateMessageTranscription(
    messageId: string,
    transcription: string,
  ): Promise<void>;

  updateMessageError(messageId: string, error?: string): Promise<void>;

  deleteMessage(messageId: string): Promise<void>;
}
