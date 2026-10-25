import type { VoiceMessageGateway } from "../../application";
import type { AiSession } from "../../domain";
import { normalizeChatError } from "@super-app/features-chat-core/infrastructure";

export class HttpVoiceMessageGateway implements VoiceMessageGateway {
  constructor(
    private readonly baseUrl: string,
    private readonly getReplySessionId: () => string | undefined = () =>
      undefined,
  ) {}
  async transcribe(input: {
    file: File;
    session?: AiSession;
    prompt?: string;
  }): Promise<{
    chatId?: string;
    correlationId?: string;
    jobId?: string;
    tenantId?: string;
    userId?: string;
  }> {
    try {
      const correlationId = crypto.randomUUID();
      const jobId = crypto.randomUUID();
      const form = new FormData();

      form.append("file", input.file, input.file.name);
      if (input.session?.userId) form.append("user_id", input.session.userId);
      if (input.session?.chatId) form.append("chat_id", input.session.chatId);
      form.append("job_id", jobId);
      form.append("correlation_id", correlationId);
      if (input.session?.tenantId)
        form.append("tenant_id", input.session.tenantId);
      form.append("prompt", input.prompt ?? "پیام صوتی کاربر");

      const response = await fetch(`${this.baseUrl}/transcriptions`, {
        method: "POST",
        headers: {
          ...(input.session ? { "X-Chat-Id": input.session.chatId } : {}),
          ...(input.session ? { "X-Tenant-Id": input.session.tenantId } : {}),
          ...(input.session ? { "X-User-Id": input.session.userId } : {}),
          ...(this.getReplySessionId()
            ? { "X-Reply-Session-Id": this.getReplySessionId() }
            : {}),
        },
        body: form,
      });

      if (!response.ok) {
        let detail: unknown;
        try {
          detail = await response.json();
        } catch {
          detail = undefined;
        }

        throw Object.assign(new Error("Audio upload failed"), {
          response: { status: response.status, data: detail },
        });
      }

      const data = (await response.json()) as Record<string, unknown>;

      return {
        chatId:
          typeof data.chat_id === "string"
            ? data.chat_id
            : input.session?.chatId,
        correlationId:
          typeof data.correlation_id === "string"
            ? data.correlation_id
            : correlationId,
        jobId: typeof data.job_id === "string" ? data.job_id : jobId,
        tenantId:
          typeof data.tenant_id === "string"
            ? data.tenant_id
            : input.session?.tenantId,
        userId:
          typeof data.user_id === "string"
            ? data.user_id
            : input.session?.userId,
      };
    } catch (error) {
      throw normalizeChatError(
        error,
        "ارسال پیام صوتی انجام نشد. لطفاً دوباره تلاش کنید.",
      );
    }
  }
}
