export interface ConversationState {
  id: string;

  title: string;

  updatedAt: string;

  lastMessage?: string;

  unreadCount: number;

  isPinned: boolean;
}
