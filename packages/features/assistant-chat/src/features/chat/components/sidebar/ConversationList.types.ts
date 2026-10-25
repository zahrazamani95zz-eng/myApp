import type { ConversationState } from "@super-app/features-ai-chat/store";

export interface ConversationListProps {
  conversations: ConversationState[];

  activeConversationId?: string;

  onSelect(id: string): void;

  onPin(id: string): void;

  onDelete(id: string): void;
}
