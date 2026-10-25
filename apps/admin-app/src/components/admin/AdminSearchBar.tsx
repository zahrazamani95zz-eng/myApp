"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { Button, Input } from "@super-app/shared/ui";

export function AdminSearchBar({
  value,
  onApply,
  placeholder = "جستجو...",
}: {
  value: string;
  onApply: (value: string) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState(value);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  function apply() {
    onApply(draft.trim());
  }

  function clear() {
    setDraft("");
    onApply("");
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <label className="space-y-2">
          <span className="text-sm font-medium">جستجو</span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={17}
            />
            <Input
              className="pr-9"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") apply();
              }}
              placeholder={placeholder}
            />
          </div>
        </label>
        <div className="flex gap-2">
          <Button type="button" onClick={apply}>
            <Search size={17} /> جستجو
          </Button>
          {value ? (
            <Button
              type="button"
              variant="outline"
              aria-label="پاک کردن جستجو"
              onClick={clear}
            >
              <X size={17} />
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
