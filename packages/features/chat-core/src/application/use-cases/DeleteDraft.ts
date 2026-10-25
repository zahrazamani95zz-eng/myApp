import type { DraftRepository } from "../ports";

export class DeleteDraftUseCase {
  constructor(private readonly repository: DraftRepository) {}

  async execute(conversationId: string): Promise<void> {
    await this.repository.removeDraft(conversationId);
  }
}
