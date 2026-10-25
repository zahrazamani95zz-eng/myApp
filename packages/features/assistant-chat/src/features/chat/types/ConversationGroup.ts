import type { ConversationState } from "@super-app/features-ai-chat/store";

export interface ConversationGroup {
  title: string;

  conversations: ConversationState[];
}
