"use client";

import { useRef, useState, type TouchEvent } from "react";

import { Drawer, DrawerContent, Button } from "@super-app/shared/ui";
import { ChevronLeft } from "lucide-react";

import { ChatSidebar } from "../ChatSidebar";
import { AssistantThread } from "../assistant-ui/AssistantThread";
import { ChatHeader } from "../ChatHeader";
import { ChatComposer } from "../components/composer";

interface ChatWindowProps {
  history?: boolean;
  header?: boolean;
}

export function MobileChatLayout({
  // history = false,
  header = false,
}: ChatWindowProps) {
  const [open, setOpen] = useState(false);
  const edgeTouchStartX = useRef<number | null>(null);

  const handleEdgeTouchStart = (event: TouchEvent<HTMLDivElement>) => {
    const x = event.touches[0]?.clientX ?? 0;
    if (window.innerWidth - x <= 42) edgeTouchStartX.current = x;
  };

  const handleEdgeTouchEnd = (event: TouchEvent<HTMLDivElement>) => {
    if (edgeTouchStartX.current === null) return;
    const endX = event.changedTouches[0]?.clientX ?? edgeTouchStartX.current;
    if (edgeTouchStartX.current - endX > 48) setOpen(true);
    edgeTouchStartX.current = null;
  };

  return (
    <div
      className="chat-page relative flex h-full min-h-0 flex-col overflow-hidden bg-background p-2.5 sm:p-3"
      onTouchStart={handleEdgeTouchStart}
      onTouchEnd={handleEdgeTouchEnd}
    >
      {/* Header */}
      {header && (
        <div className="relative shrink-0 overflow-hidden rounded-[20px] border border-border/65 bg-card/95 shadow-[0_8px_28px_rgba(15,35,28,0.07)] backdrop-blur-xl dark:border-border/75 dark:bg-card/92 dark:shadow-[0_12px_34px_rgba(0,0,0,0.25)]">
          <ChatHeader />
        </div>
      )}

      {/* Samsung-style edge history handle */}
      {!open && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="باز کردن تاریخچه مکالمات"
          title="تاریخچه مکالمات"
          onClick={() => setOpen(true)}
          className="absolute right-0 top-1/2 z-30 w-4 h-20  -translate-y-1/2 rounded-l-[14px] rounded-r-none border-0 bg-card/95 p-0 text-text-secondary shadow-[-8px_0_28px_rgba(15,35,28,0.12)] backdrop-blur-xl hover:bg-card hover:text-primary active:scale-[0.98]"
        >
          <span className="flex h-10 w-1.5 items-center justify-center rounded-full bg-primary/25">
            <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.3} />
          </span>
        </Button>
      )}

      {open && (
        <div className="pointer-events-none absolute right-0 top-1/2 z-20 h-16 w-1 -translate-y-1/2 rounded-l-full bg-primary/30" />
      )}

      {/* Thread */}
      <div className="chat-canvas my-3 flex h-full min-h-0 min-w-0 flex-1 overflow-hidden rounded-[22px] bg-transparent">
        <AssistantThread />
      </div>

      {/* Composer */}
      <div className="shrink-0 px-0.5 pb-0.5 pt-1.5 sm:px-2 sm:pb-2">
        <ChatComposer />
      </div>

      {/* Sidebar */}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent
          side="right"
          padding="sm"
          radius="sm"
          className="!top-0 border-l-0 !right-0 !h-dvh !w-[min(86vw,360px)]   rounded-l-[28px] !rounded-r-none !border-0 !bg-card/98 !shadow-[-18px_0_48px_rgba(0,0,0,0.18)] dark:!bg-card/98 !p-2 rounded-[15px]"
        >
          <ChatSidebar />
        </DrawerContent>
      </Drawer>
    </div>
  );
}
