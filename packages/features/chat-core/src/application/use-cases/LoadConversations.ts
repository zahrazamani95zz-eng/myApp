import type { ChatRepository } from "../ports/ChatRepository";
import type { ChatHistoryGateway } from "../ports/ChatHistoryGateway";

export class LoadConversationsUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly api: ChatHistoryGateway,
  ) {}

  async execute(page: number = 1, perPage: number = 20) {
    try {
      // The API is the source of truth whenever it is reachable.
      // IndexedDB is used as a fallback only when the API request fails.
      const result = await this.api.loadConversations(page, perPage);

      await Promise.all(
        result.items.map((conversation) =>
          this.repository.ensureConversation(conversation),
        ),
      );

      return result;
    } catch (error) {
      console.warn(
        "Failed to load conversations from API. Falling back to IndexedDB.",
        error,
      );

      return this.repository.loadConversations(page, perPage);
    }
  }
}
