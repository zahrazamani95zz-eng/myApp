"use client";

import { Bot, User } from "lucide-react";

interface Props {
  fromUser: boolean;
}

export function MessageAvatar({ fromUser }: Props) {
  return (
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background p-0.5 shadow-sm">
      {fromUser ? (
        <User className="h-[17px] w-[17px]" strokeWidth={2} />
      ) : (
        <Bot className="h-[17px] w-[17px]" strokeWidth={2} />
      )}
    </div>
  );
}
