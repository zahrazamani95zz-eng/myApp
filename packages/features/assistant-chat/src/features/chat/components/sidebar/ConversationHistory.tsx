"use client";

import { ConversationSection } from "./ConversationSection";
import type { ConversationGroup } from "../../types/ConversationGroup";
import { Loader2 } from "lucide-react";

interface Props {
  sections: ConversationGroup[];
  activeConversationId?: string;
  onSelect(id: string): void;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  loading: boolean;
  hasMore: boolean;
  onPin(id: string): void;
  onDelete(id: string): void;
}

export function ConversationHistory({
  sections,
  activeConversationId,
  onSelect,
  loadMoreRef,
  loading,
  hasMore,
  onPin,
  onDelete,
}: Props) {
  if (!sections.length && !loading) {
    return (
      <div className="flex min-h-[180px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-card text-text-muted">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M20 11.5C20 15.64 16.42 19 12 19C10.74 19 9.55 18.73 8.5 18.25L4 20L5.25 16.35C4.46 15.03 4 13.55 4 12C4 7.86 7.58 4.5 12 4.5C16.42 4.5 20 7.36 20 11.5Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8 11.5H16"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
            <path
              d="M8 14H13"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="text-sm font-medium text-foreground">
          هنوز مکالمه‌ای ندارید
        </div>
        <div className="mt-1 text-xs text-text-muted">
          یک مکالمه جدید شروع کنید.
        </div>
      </div>
    );
  }

  if (!sections.length && loading) {
    return (
      <div className="flex min-h-[200px] flex-col items-center justify-center gap-3">
        <Loader2 className="h-5 w-5 animate-spin text-text-muted" />
        <span className="text-sm text-text-muted">
          در حال دریافت مکالمات...
        </span>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-5">
        {sections.map((section) => (
          <ConversationSection
            key={section.title}
            section={section}
            activeConversationId={activeConversationId}
            onSelect={onSelect}
            onPin={onPin}
            onDelete={onDelete}
          />
        ))}
      </div>

      {hasMore && (
        <div
          ref={loadMoreRef}
          className="flex h-14 w-full items-center justify-center"
        >
          {loading && (
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>در حال بارگذاری...</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
