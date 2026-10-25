import type { ChatMessageState } from "@super-app/features-ai-chat/store";

import type { MessageState } from "@assistant-ui/react";
import { MessageStatus } from "@super-app/features-chat-core/domain";

export function toChatMessageState(message: MessageState): ChatMessageState {
  return {
    id: message.id,

    conversationId: "",

    senderId: message.role === "assistant" ? "assistant" : "user",

    text: message.content
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(""),

    type: "text",

    status: MessageStatus.SENT,

    createdAt: message.createdAt?.toISOString() ?? new Date().toISOString(),

    updatedAt: new Date().toISOString(),

    error: undefined,
  };
}
