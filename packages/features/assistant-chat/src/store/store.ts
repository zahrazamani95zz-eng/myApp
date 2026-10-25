import {
  createChatStore,
  type ChatStoreBindings,
} from "@super-app/features-ai-chat/store";
import type { ChatContainer } from "@super-app/features-ai-chat/composition";

export function createAssistantChatStore(
  container: ChatContainer,
): ChatStoreBindings {
  return createChatStore(container);
}

export type AssistantChatStoreBindings = ChatStoreBindings;
export type AssistantChatStore = ChatStoreBindings["store"];
export type RootState = ReturnType<AssistantChatStore["getState"]>;
export type AppDispatch = AssistantChatStore["dispatch"];
