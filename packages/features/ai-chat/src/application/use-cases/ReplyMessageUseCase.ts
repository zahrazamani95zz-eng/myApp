import type { ChatRepository } from "@super-app/features-chat-core/application";
import type { AiChatGateway } from "../ports/AiChatGateway";

import {
  Message,
  MessageContent,
  MessageStatus,
  MessageType,
} from "@super-app/features-chat-core/domain";

interface ReplyMessageRequest {
  conversationId: string;

  senderId: string;

  text: string;

  replyToMessageId: string;
}

export class ReplyMessageUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly gateway: AiChatGateway,
  ) {}

  async execute(request: ReplyMessageRequest): Promise<Message> {
    const repliedMessage = await this.repository.loadMessage(
      request.replyToMessageId,
    );

    if (!repliedMessage) {
      throw new Error("Reply target message not found.");
    }

    const message = Message.create({
      id: crypto.randomUUID(),

      conversationId: request.conversationId,

      senderId: request.senderId,

      type: MessageType.TEXT,

      status: MessageStatus.SENDING,

      content: MessageContent.create(request.text),

      attachments: [],

      replyToMessageId: request.replyToMessageId,
    });

    await this.repository.saveMessage(message);

    await this.gateway.send(message);

    await this.repository.updateMessageStatus(message.id, MessageStatus.SENT);

    return message;
  }
}
