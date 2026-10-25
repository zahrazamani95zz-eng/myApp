export interface ConversationContentMessageDto {
  role: "user" | "assistant";

  content: string;

  context: Record<string, unknown>;

  timestamp: string;
}

export interface ConversationContentResponseDto {
  chat_id: string;

  total: number;

  page: number;

  per_page: number;

  total_pages: number;

  pagination: {
    next: number | null;

    prev: number | null;

    first: number;

    last: number;
  };

  messages: ConversationContentMessageDto[];

  summary: string;

  keywords: Array<{
    word: string;

    count: number;
  }>;

  context: Record<string, unknown>;
}
