import type { ChatRepository } from "../ports";

import type { Message } from "../../domain";

interface EditMessageRequest {
  messageId: string;

  content: string;
}

export class EditMessageUseCase {
  constructor(private readonly repository: ChatRepository) {}

  async execute(request: EditMessageRequest): Promise<Message> {
    const message = await this.repository.loadMessage(request.messageId);

    if (!message) {
      throw new Error("Message not found.");
    }

    message.edit(request.content);

    await this.repository.saveMessage(message);

    return message;
  }
}
