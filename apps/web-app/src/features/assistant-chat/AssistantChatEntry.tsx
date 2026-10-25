"use client";

import { AssistantChat } from "@super-app/features-assistant-chat";
import { webChatContainer } from "./chatContainer";
import { webChatBindings } from "./chatStore";

export function WebAssistantChat({ chatId }: { chatId?: string }) {
  return (
    <AssistantChat
      container={webChatContainer}
      bindings={webChatBindings}
      chatId={chatId}
      history
      header
    />
  );
}
