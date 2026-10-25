import type { AiSession } from "@super-app/features-chat-core/domain";

export interface TtsResult {
  audioId: string;
  audioUrl?: string;
  audioFormat?: string;
  durationMs?: number;
}

export interface TtsGateway {
  generateSpeech(input: {
    text: string;
    session: AiSession;
  }): Promise<TtsResult>;

  getAudioBlob(audioId: string): Promise<Blob>;
}
