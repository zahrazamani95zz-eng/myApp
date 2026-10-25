import type { ChatRepository } from "../ports/ChatRepository";

export class LoadMessagesUseCase {
  constructor(private readonly repository: ChatRepository) {}

  execute(conversationId: string) {
    return this.repository.loadMessages(conversationId);
  }
}
