import type { ConversationState } from "@super-app/features-ai-chat/store";

export interface ConversationItemProps {
  conversation: ConversationState;

  active?: boolean;

  onClick(): void;

  onPin(id: string): void;

  onDelete(id: string): void;
}
