import type { Conversation } from "./Conversation";

export interface ConversationPage {
  items: Conversation[];

  page: number;

  hasMore: boolean;
}
