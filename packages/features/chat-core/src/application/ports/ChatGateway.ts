import type { ChatEvent, Message } from "../../domain";

export interface ChatGateway {
  connect(): Promise<void>;

  disconnect(): Promise<void>;

  joinConversation(conversationId: string): Promise<void>;

  leaveConversation(conversationId: string): Promise<void>;

  send(message: Message): Promise<void>;

  onEvent(callback: (event: ChatEvent) => void): void;
}
