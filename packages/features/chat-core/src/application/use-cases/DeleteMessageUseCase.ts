import type { ChatRepository } from "../ports";

import type { Message } from "../../domain";

interface DeleteMessageRequest {
  messageId: string;
}

export class DeleteMessageUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(request: DeleteMessageRequest): Promise<Message> {
    const message = await this.repository.loadMessage(request.messageId);

    if (!message) {
      throw new Error("Message not found.");
    }

    message.markDeleted();

    await this.repository.saveMessage(message);

    return message;
  }
}
