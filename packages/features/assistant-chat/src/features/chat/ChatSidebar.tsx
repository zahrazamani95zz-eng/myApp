"use client";

import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { useRef, useState } from "react";

import { Button } from "@super-app/shared/ui";
import {
  useAssistantChatActions,
  useAssistantChatThunks,
} from "../../AssistantChatContext";

import { useAppDispatch } from "../../store";
import { ConversationSearch } from "./components/sidebar/ConversationSearch";
import { ConversationHistory } from "./components/sidebar/ConversationHistory";
import { useConversationHistory } from "./hooks/useConversationHistory";
import { useInfiniteScroll } from "./hooks/useInfiniteScroll";

export function ChatSidebar() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { resetChat } = useAssistantChatActions();
  const { deleteConversation } = useAssistantChatThunks();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const { sections, loadNextPage, hasMore, loading } =
    useConversationHistory(search);

  const loadMoreRef = useInfiniteScroll({
    enabled: hasMore,
    loading,
    onLoadMore: loadNextPage,
    rootRef: scrollContainerRef,
  });

  const handleNewChat = () => {
    dispatch(resetChat());
    router.push("/chat");
  };

  const handleDelete = async (chatId: string) => {
    const result = await dispatch(deleteConversation(chatId));

    if (deleteConversation.fulfilled.match(result)) {
      if (pathname === `/chat/${chatId}`) {
        dispatch(resetChat());
        router.push("/chat");
      }
    }
  };

  return (
    <aside className="chat-sidebar flex h-full w-full flex-col rounded-[15px]">
      {/* Sidebar header */}
      <div className="flex items-center justify-between gap-2 px-3 pb-4 pt-4 sm:px-4">
        <div className="min-w-0 px-1">
          <h2 className="truncate text-base font-semibold text-text">تاک</h2>
        </div>

        {/* <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 w-9 shrink-0 p-0"
          aria-label="مکالمه جدید"
          title="مکالمه جدید"
          onClick={handleNewChat}
        >
          <Plus className="h-5 w-5" />
        </Button> */}
      </div>

      {/* New chat */}
      <div className="px-3 pb-2 sm:px-4">
        <Button
          type="button"
          variant="outline"
          className="h-10 w-full justify-start gap-2 rounded-xl border border-border/80 bg-background/65 px-3 text-sm font-medium shadow-sm backdrop-blur-md hover:border-primary/25 hover:bg-primary/5"
          onClick={handleNewChat}
        >
          <Plus className="h-4 w-4" />
          <span>مکالمه جدید</span>
        </Button>
      </div>

      {/* Search */}
      <div className="px-3 pb-3 sm:px-4 sm:pb-4">
        {/* <div className="mb-2 flex items-center gap-2 px-1 text-[11px] font-medium text-text-muted">
          <Search className="h-3.5 w-3.5" />
          <span>جستجوی مکالمات</span>
        </div> */}

        <ConversationSearch value={search} onChange={setSearch} />
      </div>

      <div
        ref={scrollContainerRef}
        className="min-h-0 flex-1 overflow-y-auto px-2 pb-3 sm:px-3 [scrollbar-width:thin] chat-scroll-area"
      >
        <ConversationHistory
          sections={sections}
          activeConversationId={pathname.split("/").pop()}
          onSelect={(id) => router.push(`/chat/${id}`)}
          loadMoreRef={loadMoreRef}
          loading={loading}
          hasMore={hasMore}
          onDelete={handleDelete}
          onPin={() => {}}
        />
      </div>
    </aside>
  );
}
