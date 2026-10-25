export interface TypingGateway {
  typing(conversationId: string, userId: string): Promise<void>;

  stopTyping(conversationId: string, userId: string): Promise<void>;
}
