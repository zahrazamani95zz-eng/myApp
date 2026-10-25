import type { ChatRepository, UploadRepository } from "../ports";

import type { Attachment, Message } from "../../domain";

interface UploadAttachmentRequest {
  messageId: string;

  file: File;
}

export class UploadAttachmentUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly uploadRepository: UploadRepository,
  ) {}

  async execute(request: UploadAttachmentRequest): Promise<Message> {
    const message = await this.repository.loadMessage(request.messageId);

    if (!message) {
      throw new Error("Message not found.");
    }

    const attachment: Attachment = await this.uploadRepository.upload(
      request.file,
    );

    message.addAttachment(attachment);

    await this.repository.saveMessage(message);

    return message;
  }
}
