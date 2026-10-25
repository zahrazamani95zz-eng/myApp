"use client";

import { AssistantChatProvider } from "./AssistantChatContext";
import { ChatInitializer } from "./features/chat/ChatInitializer";
import { ChatWindow } from "./features/chat/components/ChatWindow";
import type { ChatContainer } from "@super-app/features-ai-chat/composition";
import type { AssistantChatStoreBindings } from "./store/store";

export interface AssistantChatProps {
  bindings: AssistantChatStoreBindings;
  container: ChatContainer;
  chatId?: string;
  history?: boolean;
  header?: boolean;
}

export function AssistantChat({
  bindings,
  container,
  chatId,
  history,
  header,
}: AssistantChatProps) {
  return (
    <AssistantChatProvider bindings={bindings} container={container}>
      <ChatInitializer />
      <ChatWindow chatId={chatId} history={history} header={header} />
    </AssistantChatProvider>
  );
}
