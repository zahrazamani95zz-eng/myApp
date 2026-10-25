"use client";

import { DesktopChatLayout } from "./DesktopChatLayout";

import { MobileChatLayout } from "./MobileChatLayout";

interface ChatWindowProps {
  history?: boolean;
  header?: boolean;
}

export function ResponsiveChatLayout({ history, header }: ChatWindowProps) {
  return (
    <>
      <>
        <div className="hidden h-dvh lg:block">
          <DesktopChatLayout history={history} header={header} />
        </div>

        <div className="block h-dvh lg:hidden">
          <MobileChatLayout history={history} header={header} />
        </div>
      </>
    </>
  );
}
