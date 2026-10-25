import type { ChatRepository } from "../ports";

export class SaveMessageErrorUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(input: { messageId: string; error?: string }): Promise<void> {
    await this.repository.updateMessageError(input.messageId, input.error);
  }
}
