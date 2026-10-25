"use client";

import { MessageCircleOff } from "lucide-react";

export function ConversationNotFound() {
  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-12">
      <div className="flex max-w-md flex-col items-center text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-background-soft text-text-secondary">
          <MessageCircleOff size={28} />
        </div>

        <h2 className="text-base font-semibold text-text">مکالمه پیدا نشد</h2>

        <p className="mt-2 text-sm leading-7 text-text-secondary">
          این مکالمه پیدا نشد یا دیگر در دسترس نیست.
        </p>
      </div>
    </div>
  );
}
