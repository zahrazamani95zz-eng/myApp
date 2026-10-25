"use client";
import { useState } from "react";
import { ChatHeader } from "../ChatHeader";
import { ChatSidebar } from "../ChatSidebar";
import { AssistantThread } from "../assistant-ui/AssistantThread";
import { ChatComposer } from "../components/composer/ChatComposer";
import { History } from "lucide-react";
import { Drawer, DrawerContent, Button } from "@super-app/shared/ui";
interface ChatWindowProps {
  history?: boolean;
  header?: boolean;
}

export function DesktopChatLayout({
  history = false,
  header = false,
}: ChatWindowProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="chat-page flex h-full min-h-0 gap-4 overflow-hidden p-3 sm:p-4 lg:p-5">
      {history && (
        <div className="hidden min-h-0 w-[300px] rounded-[15px]  shrink-0 overflow-hidden  bg-card/80 shadow-[0_10px_35px_rgba(15,23,42,0.06)] backdrop-blur-xl lg:block dark:bg-card/70 dark:shadow-[0_12px_40px_rgba(0,0,0,0.22)]">
          <ChatSidebar />
        </div>
      )}

      <main className="flex min-h-0 min-w-0 flex-1 justify-center overflow-hidden">
        <div className="flex h-full min-h-0 w-full max-w-[1600px] flex-col gap-4">
          {header && (
            <div className="shrink-0 overflow-hidden chat-panel rounded-[22px] border border-border/80 bg-card/94 shadow-[0_8px_28px_rgba(18,43,35,0.07)] backdrop-blur-xl dark:bg-card/92 dark:shadow-[0_12px_34px_rgba(0,0,0,0.22)]">
              <ChatHeader />
            </div>
          )}
          {!header && (
            <Button
              variant="ghost"
              className="absolute left-[2%] top-[4%] z-10 h-10 w-10 rounded-xl border border-border/60 bg-card/90 p-0 text-text-secondary shadow-md backdrop-blur-xl hover:border-primary/25 hover:bg-primary/8 hover:text-primary"
              onClick={() => setOpen(true)}
            >
              <History className="h-[18px] w-[18px] " strokeWidth={2} />
            </Button>
          )}
          <div className="chat-canvas flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden chat-main rounded-[24px]">
            <div className="flex min-h-0 min-w-0 flex-1 overflow-hidden">
              <AssistantThread />
            </div>

            <div className="shrink-0 px-1 pb-1 pt-4 sm:px-3 sm:pb-3">
              <div className="mx-auto w-full max-w-[1120px]">
                <ChatComposer />
              </div>
            </div>
          </div>
        </div>
        {/* Sidebar */}
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent
            side="right"
            radius="sm"
            className="!top-0 border-l-0 !right-0 !h-dvh !w-[min(86vw,360px)]   rounded-l-[28px] !rounded-r-none !border-0 !bg-card/98 !shadow-[-18px_0_48px_rgba(0,0,0,0.18)] dark:!bg-card/98 !p-2 rounded-[15px]"
          >
            <ChatSidebar />
          </DrawerContent>
        </Drawer>
      </main>
    </div>
  );
}
