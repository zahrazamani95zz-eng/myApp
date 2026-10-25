import type { ConversationState } from "@super-app/features-ai-chat/store";

export function sortConversations(conversations: ConversationState[]) {
  return [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
}
