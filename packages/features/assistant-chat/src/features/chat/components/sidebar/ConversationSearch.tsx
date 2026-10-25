"use client";

import { Search, X } from "lucide-react";

import { Button, Input } from "@super-app/shared/ui";

import { ConversationSearchProps } from "./ConversationSearch.types";

import type { ChangeEvent } from "react";

export function ConversationSearch({
  value,
  onChange,
}: ConversationSearchProps) {
  return (
    <div className="relative">
      <Search
        size={17}
        className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-text-muted"
        aria-hidden="true"
      />

      <Input
        className="h-10 rounded-xl border-border bg-card pl-9 pr-9 text-sm shadow-none placeholder:text-text-muted focus-visible:ring-1"
        placeholder="جستجو در مکالمات..."
        value={value}
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          onChange(e.target.value)
        }
      />

      {value && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          aria-label="پاک کردن جستجو"
          className="absolute right-1 top-1/2 z-10 h-8 w-8 -translate-y-1/2 p-0 text-text-muted hover:text-foreground"
          onClick={() => onChange("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
