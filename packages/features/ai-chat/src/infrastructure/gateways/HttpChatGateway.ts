import type { AiChatGateway } from "../../application";
import type { AiSession, Message } from "@super-app/features-chat-core/domain";
import { createApiClient } from "@super-app/shared/lib";
import { OutgoingMessageMapper } from "../mappers";
import { normalizeChatError } from "@super-app/features-chat-core/infrastructure";

export class HttpChatGateway implements AiChatGateway {
  private readonly api: ReturnType<typeof createApiClient>;

  constructor(
    baseUrl: string,
    private readonly getReplySessionId: () => string | undefined = () =>
      undefined,
  ) {
    this.api = createApiClient(baseUrl);
  }

  async send(
    message: Message,
    session?: AiSession,
  ): Promise<{
    chatId: string;
    correlationId?: string;
    tenantId?: string;
    userId?: string;
  }> {
    try {
      const payload = OutgoingMessageMapper.toPayload(message);
      const { data } = await this.api.post("/chat/completions", payload, {
        headers: {
          ...(session ? { "X-Chat-Id": session.chatId } : {}),
          ...(session ? { "X-Tenant-Id": session.tenantId } : {}),
          ...(session ? { "X-User-Id": session.userId } : {}),
          ...(this.getReplySessionId()
            ? { "X-Reply-Session-Id": this.getReplySessionId() }
            : {}),
        },
      });

      if (!data?.chat_id || typeof data.chat_id !== "string") {
        throw new Error("Chat API did not return a chat id.");
      }

      return {
        chatId: data.chat_id,
        correlationId:
          typeof data.correlation_id === "string"
            ? data.correlation_id
            : undefined,
        tenantId:
          typeof data.tenant_id === "string" ? data.tenant_id : undefined,
        userId: typeof data.user_id === "string" ? data.user_id : undefined,
      };
    } catch (error) {
      throw normalizeChatError(
        error,
        "ارسال پیام انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  }
}
