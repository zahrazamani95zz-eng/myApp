import type { MessageStatus } from "@super-app/features-chat-core/domain";
export interface ChatMessageState {
  id: string;

  conversationId: string;

  senderId: string;

  text: string;

  transcription?: string;

  type: string;

  status: MessageStatus;

  createdAt: string;

  updatedAt: string;

  streaming?: boolean;

  correlationId?: string;

  audioId?: string;
  audioUrl?: string;
  audioFormat?: string;
  durationMs?: number;
  audioLoading?: boolean;
  audioError?: boolean;

  /** Transient UI feedback (like/dislike) for assistant messages */
  feedback?: "like" | "dislike";
  error: string | undefined;
}
