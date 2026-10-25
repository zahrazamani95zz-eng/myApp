import type { ChatMessageState } from "@super-app/features-ai-chat/store";

export interface AssistantMessage {
  id: string;

  role: "user" | "assistant";

  content: {
    type: "text";
    text: string;
  }[];

  createdAt: Date;
}

export class ReduxChatAdapter {
  static toAssistantMessage(message: ChatMessageState): AssistantMessage {
    return {
      id: message.id,

      role: message.senderId === "assistant" ? "assistant" : "user",

      content: [
        {
          type: "text",
          text: message.text,
        },
      ],

      createdAt: new Date(message.createdAt),
    };
  }

  static toAssistantMessages(messages: ChatMessageState[]): AssistantMessage[] {
    return messages.map(ReduxChatAdapter.toAssistantMessage);
  }
}
