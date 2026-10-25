"use client";

import { Bot, Circle } from "lucide-react";
import { ChatHeaderTitle } from "./ChatHeaderTitle";
import { ChatHeaderProps } from "./ChatHeader.types";

export function ChatHeader({ title, subtitle }: ChatHeaderProps) {
  return (
    <header className="chat-header flex min-h-[72px] items-center justify-between px-4 py-3 sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        <div className="chat-avatar grid h-11 w-11 shrink-0 place-items-center rounded-[15px] text-white">
          <Bot className="h-5 w-5" strokeWidth={1.9} />
        </div>
        <ChatHeaderTitle title={title} subtitle={subtitle} />
      </div>
      <div className="hidden items-center gap-2 rounded-full bg-success/8 px-3 py-1.5 text-xs font-medium text-success sm:flex">
        <Circle className="h-2 w-2 fill-current" />
        آنلاین
      </div>
    </header>
  );
}
