import type { DraftRepository } from "../ports";

export class SaveDraftUseCase {
  constructor(private readonly repository: DraftRepository) {}

  async execute(conversationId: string, text: string): Promise<void> {
    await this.repository.saveDraft(conversationId, text);
  }
}
