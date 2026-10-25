"use client";

import { Skeleton } from "@super-app/shared/ui";

export function ChatHeaderSkeleton() {
  return (
    <header className="flex items-center justify-between border-b px-4 py-3">
      <div className="space-y-2">
        <Skeleton className="h-4 w-40" />

        <Skeleton className="h-3 w-24" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-8 w-8 rounded-full" />

        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </header>
  );
}
