import type { ChatEvent } from "../../domain";

export interface ChatEventGateway {
  connect(): Promise<void>;

  disconnect(): Promise<void>;

  onEvent(callback: (event: ChatEvent) => void): () => void;

  onError?(callback: (error: Error) => void): () => void;

  subscribeToChat(chatId: string): Promise<void>;
  unsubscribeFromChat(chatId: string): Promise<void>;
}
