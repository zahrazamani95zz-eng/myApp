import type { DraftRepository } from "../ports";

export class LoadDraftUseCase {
  constructor(private readonly repository: DraftRepository) {}

  async execute(conversationId: string): Promise<string | null> {
    return this.repository.getDraft(conversationId);
  }
}
