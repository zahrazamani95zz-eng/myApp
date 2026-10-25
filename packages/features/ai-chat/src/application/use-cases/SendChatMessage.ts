import type { ChatRepository } from "@super-app/features-chat-core/application";
import type { AiChatGateway } from "../ports/AiChatGateway";

import {
  Attachment,
  Message,
  MessageContent,
  MessageStatus,
  MessageType,
  Conversation,
  ConversationType,
  AiSession,
} from "@super-app/features-chat-core/domain";

interface Input {
  conversationId: string;

  isNewConversation?: boolean;

  senderId: string;

  text: string;
}

export class SendChatMessageUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly api: AiChatGateway,
  ) {}

  async execute(input: Input) {
    if (input.isNewConversation) {
      const existing = await this.repository.loadConversation(
        input.conversationId,
      );

      if (!existing) {
        await this.repository.ensureConversation(
          Conversation.reconstitute({
            id: input.conversationId,
            title: input.text,
            type: ConversationType.AI,
            participantIds: [],
            lastMessageId: undefined,
            isPinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            last_message: input.text,
          }),
        );
      }
    }

    const conversation = await this.repository.loadConversation(
      input.conversationId,
    );
    const session = conversation?.aiSession;

    const message = Message.create({
      id: crypto.randomUUID(),

      conversationId: input.conversationId,

      senderId: input.senderId,

      type: MessageType.TEXT,

      status: MessageStatus.SENDING,

      content: MessageContent.create(input.text),

      attachments: [] as Attachment[],
    });

    await this.repository.saveMessage(message);

    try {
      const response = await this.api.send(
        message,
        input.isNewConversation ? undefined : session,
      );

      /*
       * فقط اگر New Chat بوده،
       * temporary ID را با ID واقعی جایگزین کن.
       */
      if (input.isNewConversation && response.chatId !== input.conversationId) {
        await this.repository.replaceConversationId(
          input.conversationId,
          response.chatId,
        );
        message.moveToConversation(response.chatId);
      }

      if (response.correlationId) {
        message.setCorrelationId(response.correlationId);
        await this.repository.updateMessage(message);
      }

      const updatedSession =
        response.tenantId && response.userId
          ? AiSession.create({
              chatId: response.chatId,
              tenantId: response.tenantId,
              userId: response.userId,
            })
          : session;

      let updatedConversation =
        conversation ??
        Conversation.reconstitute({
          id: response.chatId,
          title: input.text,
          type: ConversationType.AI,
          participantIds: [],
          createdAt: new Date(),
          updatedAt: new Date(),
          last_message: input.text,
        });

      if (updatedConversation.id !== response.chatId) {
        updatedConversation = Conversation.reconstitute({
          id: response.chatId,
          title: updatedConversation.title ?? input.text,
          type: ConversationType.AI,
          participantIds: updatedConversation.participantIds,
          lastMessageId: updatedConversation.lastMessageId,
          isPinned: updatedConversation.isPinned,
          createdAt: updatedConversation.createdAt,
          updatedAt: updatedConversation.updatedAt,
          last_message: input.text,
          aiSession: updatedSession,
        });
      } else {
        updatedConversation.setAiSession(updatedSession);
      }

      message.markSent();
      await this.repository.ensureConversation(updatedConversation);

      await this.repository.updateMessageStatus(message.id, MessageStatus.SENT);

      return {
        message,

        chatId: response.chatId,

        conversation: updatedConversation,

        temporaryConversationId: input.isNewConversation
          ? input.conversationId
          : undefined,

        isNewConversation: !!input.isNewConversation,
      };
    } catch (error) {
      await this.repository.updateMessageStatus(
        message.id,
        MessageStatus.FAILED,
      );

      throw error;
    }
  }
}
