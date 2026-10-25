"use client";

import { AssistantChat } from "@super-app/features-assistant-chat";
import { mlChatContainer } from "./chatContainer";
import { mlChatBindings } from "./chatStore";

export function MlAssistantChat({ chatId }: { chatId?: string }) {
  return (
    <AssistantChat
      container={mlChatContainer}
      bindings={mlChatBindings}
      chatId={chatId}
    />
  );
}
