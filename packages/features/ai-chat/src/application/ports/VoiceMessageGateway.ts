import type { AiSession } from "@super-app/features-chat-core/domain";

export interface VoiceMessageGateway {
  transcribe(input: {
    file: File;
    session?: AiSession;
    prompt?: string;
  }): Promise<{
    chatId?: string;
    correlationId?: string;
    jobId?: string;
    tenantId?: string;
    userId?: string;
  }>;
}
