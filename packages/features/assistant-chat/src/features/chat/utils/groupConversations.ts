import { isToday, isYesterday, subDays } from "date-fns";

import { ConversationGroup } from "../types/ConversationGroup";
import type { ConversationState } from "@super-app/features-ai-chat/store";

export function groupConversations(
  conversations: ConversationState[],
  search: string,
): ConversationGroup[] {
  const today: ConversationState[] = [];
  const yesterday: ConversationState[] = [];
  const lastWeek: ConversationState[] = [];
  const older: ConversationState[] = [];

  const normalizedSearch = search.trim().toLowerCase();

  conversations
    .filter((conversation) => {
      if (!normalizedSearch) return true;

      return [conversation.title, conversation.lastMessage]
        .filter(Boolean)
        .some((value) => value?.toLowerCase().includes(normalizedSearch));
    })
    .forEach((conversation) => {
      const date = new Date(conversation.updatedAt);

      if (isToday(date)) {
        today.push(conversation);
        return;
      }

      if (isYesterday(date)) {
        yesterday.push(conversation);
        return;
      }

      if (date > subDays(new Date(), 7)) {
        lastWeek.push(conversation);
        return;
      }

      older.push(conversation);
    });

  return [
    { title: "امروز", conversations: today },
    { title: "دیروز", conversations: yesterday },
    { title: "۷ روز گذشته", conversations: lastWeek },
    { title: "قدیمی‌تر", conversations: older },
  ].filter((section) => section.conversations.length > 0);
}
