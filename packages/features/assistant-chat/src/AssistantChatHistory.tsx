"use client";

import { useRef, useState } from "react";
import { MoreVertical, Plus, X } from "lucide-react";
import { Button } from "@super-app/shared/ui";
import { useAppDispatch, useAppSelector } from "./store";
import {
  useAssistantChatActions,
  useAssistantChatThunks,
} from "./AssistantChatContext";
import { ConversationSearch } from "./features/chat/components/sidebar/ConversationSearch";
import { ConversationHistory } from "./features/chat/components/sidebar/ConversationHistory";
import { useConversationHistory } from "./features/chat/hooks/useConversationHistory";
import { useInfiniteScroll } from "./features/chat/hooks/useInfiniteScroll";

export function AssistantChatHistory() {
  const dispatch = useAppDispatch();

  const { resetChat } = useAssistantChatActions();

  const { deleteConversation, loadConversationContent } =
    useAssistantChatThunks();

  const activeConversationId = useAppSelector(
    (state) => state.chat.conversationId ?? undefined,
  );

  const [open, setOpen] = useState(false);
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

  const selectConversation = async (id: string) => {
    await dispatch(
      loadConversationContent({
        chatId: id,
        page: 1,
        perPage: 20,
      }),
    );

    setOpen(false);
  };

  const removeConversation = async (id: string) => {
    await dispatch(deleteConversation(id));

    if (activeConversationId === id) {
      dispatch(resetChat());
    }
  };

  return (
    <>
      <div className="z-30 flex h-14 shrink-0 items-center justify-end border-b border-border bg-background px-3 sm:px-5">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="تاریخچه گفتگوها"
          title="تاریخچه گفتگوها"
          className="grid h-10 w-10 place-items-center rounded-xl text-text-secondary transition hover:bg-card hover:text-primary"
        >
          <MoreVertical size={20} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <aside className="absolute left-0 top-0 z-10 flex h-full w-[320px] max-w-[calc(100vw-24px)] flex-col border-r border-border-strong bg-background shadow-2xl sm:w-[340px]">
            <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
              <h2 className="text-base font-semibold text-text">
                تاریخچه گفتگوها
              </h2>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-lg text-text-secondary hover:bg-card"
              >
                <X size={19} />
              </button>
            </div>

            <div className="px-4 pb-2 pt-3">
              <Button
                type="button"
                variant="outline"
                className="h-10 w-full justify-start gap-2 rounded-xl"
                onClick={() => {
                  dispatch(resetChat());
                  setOpen(false);
                }}
              >
                <Plus className="h-4 w-4" />
                <span>مکالمه جدید</span>
              </Button>
            </div>

            <div className="px-4 pb-3">
              <ConversationSearch value={search} onChange={setSearch} />
            </div>

            <div
              ref={scrollContainerRef}
              className="min-h-0 flex-1 overflow-y-auto px-3 pb-4"
            >
              <ConversationHistory
                sections={sections}
                activeConversationId={activeConversationId}
                onSelect={selectConversation}
                loadMoreRef={loadMoreRef}
                loading={loading}
                hasMore={hasMore}
                onDelete={removeConversation}
                onPin={() => {}}
              />
            </div>
          </aside>

          <button
            type="button"
            aria-label="بستن تاریخچه"
            className="absolute inset-0 bg-black/20"
            onClick={() => setOpen(false)}
          />
        </div>
      )}
    </>
  );
}
