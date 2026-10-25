import type { ChatRepository } from "../ports/ChatRepository";

export class LoadConversationUseCase {
  constructor(private readonly repository: ChatRepository) {}

  execute(conversationId: string) {
    return this.repository.loadConversation(conversationId);
  }
}
