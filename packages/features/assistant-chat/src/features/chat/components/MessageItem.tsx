"use client";

import type { ChatMessageState } from "@super-app/features-ai-chat/store";

interface Props {
  message: ChatMessageState;
}

export function MessageItem({ message }: Props) {
  return (
    <div className="rounded-lg border bg-white p-3 shadow-sm">
      <p>{message.text}</p>

      <span className="mt-2 block text-xs text-gray-400">
        {message.senderId}
      </span>
    </div>
  );
}
