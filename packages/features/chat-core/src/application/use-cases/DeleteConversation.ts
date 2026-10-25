import type { ChatRepository } from "../ports/ChatRepository";
import type { ChatHistoryGateway } from "../ports/ChatHistoryGateway";

export class DeleteConversationUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly api: ChatHistoryGateway,
  ) {}

  async execute(chatId: string) {
    await this.api.deleteConversation(chatId);
    await this.repository.deleteConversation(chatId);
  }
}
