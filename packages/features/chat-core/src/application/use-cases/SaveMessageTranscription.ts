import type { ChatRepository } from "../ports";

export class SaveMessageTranscriptionUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(input: {
    messageId: string;
    transcription: string;
  }): Promise<void> {
    await this.repository.updateMessageTranscription(
      input.messageId,
      input.transcription,
    );
  }
}
