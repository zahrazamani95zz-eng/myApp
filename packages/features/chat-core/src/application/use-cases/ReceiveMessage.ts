import type { ChatRepository } from "../ports/ChatRepository";

import type { Message } from "../../domain";

export class ReceiveMessageUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(message: Message) {
    const existing = (
      await this.repository.loadMessages(message.conversationId)
    ).find(
      (item) =>
        item.senderId === message.senderId &&
        item.correlationId === message.correlationId,
    );

    if (!existing) {
      await this.repository.saveMessage(message);
      return message;
    }

    if (existing.content.text !== message.content.text) {
      existing.edit(message.content.text);
    }

    existing.markSent();
    existing.setError(message.error);

    if (message.feedback) {
      existing.setFeedback(message.feedback);
    }

    if (message.audioId) {
      existing.setAudioMetadata({
        audioId: message.audioId,
        audioUrl: message.audioUrl,
        audioFormat: message.audioFormat,
        durationMs: message.durationMs,
      });
    }

    await this.repository.updateMessage(existing);
    return existing;
  }
}
