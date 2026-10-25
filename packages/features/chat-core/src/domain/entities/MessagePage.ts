import type { Message } from "./Message";

export interface MessagePage {
  items: Message[];

  page: number;

  hasMore: boolean;

  warning?: string;
}
