"use client";

import { ResponsiveChatLayout } from "./layout";

interface ChatWindowProps {
  history?: boolean;
  header?: boolean;
}

export function ChatLayout({ history, header }: ChatWindowProps) {
  return (
    <div className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden">
      <ResponsiveChatLayout history={history} header={header} />
    </div>
  );
}
