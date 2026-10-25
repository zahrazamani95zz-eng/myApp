import type { AiSession, Message } from "@super-app/features-chat-core/domain";

export interface AiChatGateway {
  send(
    message: Message,
    session?: AiSession,
  ): Promise<{
    chatId: string;
    correlationId?: string;
    tenantId?: string;
    userId?: string;
  }>;
}
