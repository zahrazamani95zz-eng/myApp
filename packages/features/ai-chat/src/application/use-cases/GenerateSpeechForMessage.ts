import type { ChatRepository } from "@super-app/features-chat-core/application";
import type { TtsGateway } from "../ports";

export class GenerateSpeechForMessageUseCase {
  constructor(
    private readonly repository: ChatRepository,
    private readonly tts: TtsGateway,
  ) {}

  async execute(messageId: string) {
    const message = await this.repository.loadMessage(messageId);
    if (!message) throw new Error("Message not found.");
    if (!message.content.text.trim()) return null;

    const conversation = await this.repository.loadConversation(
      message.conversationId,
    );

    if (!conversation) {
      throw new Error("Conversation not found.");
    }

    if (!conversation.aiSession) {
      throw new Error("AI session not found.");
    }

    const speech = await this.tts.generateSpeech({
      text: message.content.text,
      session: conversation.aiSession,
    });

    message.setAudioMetadata(speech);
    await this.repository.updateMessage(message);

    return speech;
  }
}
