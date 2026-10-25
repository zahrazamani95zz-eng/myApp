import type { ChatRepository } from "@super-app/features-chat-core/application";
import type { VoiceMessageGateway } from "../ports";
import {
  Conversation,
  ConversationType,
  Message,
  MessageContent,
  MessageStatus,
  MessageType,
  AiSession,
} from "@super-app/features-chat-core/domain";

export class SendVoiceMessageUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly voiceGateway: VoiceMessageGateway,
  ) {}

  async execute(input: {
    conversationId: string;
    senderId: string;
    file: File;
    isNewConversation?: boolean;
    messageId?: string;
  }) {
    if (input.isNewConversation) {
      const existing = await this.repository.loadConversation(
        input.conversationId,
      );
      if (!existing) {
        await this.repository.ensureConversation(
          Conversation.reconstitute({
            id: input.conversationId,
            title: "پیام صوتی",
            type: ConversationType.AI,
            participantIds: [],
            isPinned: false,
            createdAt: new Date(),
            updatedAt: new Date(),
            last_message: "",
          }),
        );
      }
    }

    const conversation = await this.repository.loadConversation(
      input.conversationId,
    );
    const session = conversation?.aiSession;

    const message = Message.create({
      id: input.messageId ?? crypto.randomUUID(),
      conversationId: input.conversationId,
      senderId: input.senderId,
      type: MessageType.AUDIO,
      status: MessageStatus.SENDING,
      content: MessageContent.create("پیام صوتی کاربر"),
      attachments: [],
    });

    // Local object URL for in-bubble replay of the user's own recording.
    // Does not change transcription / MQTT / correlation flow.
    const localAudioUrl = URL.createObjectURL(input.file);
    message.setAudioMetadata({
      audioId: message.id,
      audioUrl: localAudioUrl,
      audioFormat: input.file.type || "audio/webm",
    });

    await this.repository.saveMessage(message);

    try {
      const response = await this.voiceGateway.transcribe({
        file: input.file,
        session: input.isNewConversation ? undefined : session,
      });
      if (
        input.isNewConversation &&
        response.chatId &&
        response.chatId !== input.conversationId
      ) {
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
              chatId: response.chatId ?? input.conversationId,
              tenantId: response.tenantId,
              userId: response.userId,
            })
          : session;

      const conversationId = response.chatId ?? input.conversationId;
      let updatedConversation =
        conversation ??
        Conversation.reconstitute({
          id: conversationId,
          title: "پیام صوتی",
          type: ConversationType.AI,
          participantIds: [],
          isPinned: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          last_message: "",
        });

      if (updatedConversation.id !== conversationId) {
        updatedConversation = Conversation.reconstitute({
          id: conversationId,
          title: updatedConversation.title ?? "پیام صوتی",
          type: ConversationType.AI,
          participantIds: updatedConversation.participantIds,
          lastMessageId: updatedConversation.lastMessageId,
          isPinned: updatedConversation.isPinned,
          createdAt: updatedConversation.createdAt,
          updatedAt: updatedConversation.updatedAt,
          last_message: updatedConversation.last_message,
          aiSession: updatedSession,
        });
      } else {
        updatedConversation.setAiSession(updatedSession);
      }

      await this.repository.ensureConversation(updatedConversation);

      await this.repository.updateMessageStatus(message.id, MessageStatus.SENT);
      message.markSent();
      return {
        message,
        ...response,
        conversation: updatedConversation,
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
