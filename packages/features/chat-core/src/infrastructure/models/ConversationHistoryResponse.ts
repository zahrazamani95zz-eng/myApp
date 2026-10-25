export interface ConversationHistoryItemDto {
  chat_id: string;
  title: string;
  total_messages: number;
  last_activity: string;
  updated_at: string;
  created_at: string;
  last_activity_relative: string;
  last_message: string;
  is_active: boolean;
  is_pinned: boolean;
}

export interface ConversationHistoryResponseDto {
  total: number;
  page: number;
  per_page: number;
  total_pages: number;

  chats: ConversationHistoryItemDto[];

  pagination: {
    next: number | null;
    prev: number | null;
    first: number;
    last: number;
  };
}
