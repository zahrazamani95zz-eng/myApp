import type { TtsGateway, TtsResult } from "../../application";
import type { AiSession } from "../../domain";
import { normalizeChatError } from "@super-app/features-chat-core/infrastructure";

export class HttpTtsGateway implements TtsGateway {
  constructor(private readonly baseUrl: string) {}

  async generateSpeech(input: {
    text: string;
    session: AiSession;
  }): Promise<TtsResult> {
    try {
      const response = await fetch(`${this.baseUrl}/read-aloud`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant_id: input.session.tenantId,
          user_id: input.session.userId,
          chat_id: input.session.chatId,
          text: input.text,
        }),
      });

      const data: unknown = await response.json();

      if (!response.ok) {
        const detail =
          data && typeof data === "object"
            ? ((data as Record<string, unknown>).message ??
              (data as Record<string, unknown>).detail)
            : undefined;

        throw Object.assign(new Error("TTS failed"), {
          response: {
            status: response.status,
            data: typeof detail === "string" ? { message: detail } : data,
          },
        });
      }

      if (
        !data ||
        typeof data !== "object" ||
        typeof (data as { audio_id?: unknown }).audio_id !== "string"
      ) {
        throw new Error("audio_id missing");
      }

      const value = data as Record<string, unknown>;
      const audioId = value.audio_id as string;

      return {
        audioId,
        audioUrl: `${this.baseUrl}/audio/${encodeURIComponent(audioId)}`,
        audioFormat:
          typeof value.audio_format === "string"
            ? value.audio_format
            : undefined,
        durationMs:
          typeof value.duration_ms === "number" ? value.duration_ms : undefined,
      };
    } catch (error) {
      throw normalizeChatError(
        error,
        "تولید صدای پاسخ با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
      );
    }
  }

  async getAudioBlob(audioId: string): Promise<Blob> {
    try {
      const response = await fetch(
        `${this.baseUrl}/audio/${encodeURIComponent(audioId)}`,
      );

      if (!response.ok) {
        throw Object.assign(new Error("TTS audio download failed"), {
          response: { status: response.status },
        });
      }

      return response.blob();
    } catch (error) {
      throw normalizeChatError(
        error,
        "دریافت فایل صوتی با مشکل مواجه شد. لطفاً دوباره تلاش کنید.",
      );
    }
  }
}
