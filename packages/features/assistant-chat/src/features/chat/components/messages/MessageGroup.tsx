"use client";

import { memo } from "react";

import type { ChatMessageState } from "@super-app/features-ai-chat/store";

import { MessageAvatar } from "./MessageAvatar";
import { MessageBubble } from "./MessageBubble";

interface Props {
  message: ChatMessageState;
}

function MessageGroupComponent({ message }: Props) {
  const fromUser = message.senderId === "user";

  return (
    <div
      className={`mb-3 flex w-full items-end gap-2 ${
        fromUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`flex max-w-[92%] items-end gap-2 ${
          fromUser ? "flex-row-reverse" : ""
        }`}
      >
        <MessageAvatar fromUser={fromUser} />

        <MessageBubble message={message} />
      </div>
    </div>
  );
}

export const MessageGroup = memo(MessageGroupComponent, (prev, next) => {
  return (
    prev.message.id === next.message.id &&
    prev.message.text === next.message.text &&
    prev.message.transcription === next.message.transcription &&
    prev.message.streaming === next.message.streaming &&
    prev.message.status === next.message.status &&
    prev.message.type === next.message.type &&
    prev.message.audioId === next.message.audioId &&
    prev.message.audioUrl === next.message.audioUrl &&
    prev.message.audioLoading === next.message.audioLoading &&
    prev.message.audioError === next.message.audioError &&
    prev.message.durationMs === next.message.durationMs &&
    prev.message.feedback === next.message.feedback &&
    prev.message.error === next.message.error
  );
});
