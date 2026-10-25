import type { AiChatEvent } from "../../domain";

export interface AiChatEventGateway {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  onEvent(callback: (event: AiChatEvent) => void): () => void;
  onError?(callback: (error: Error) => void): () => void;
  subscribeToChat(chatId: string): Promise<void>;
  unsubscribeFromChat(chatId: string): Promise<void>;
}
