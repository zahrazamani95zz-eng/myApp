"use client";

import { Mic, X } from "lucide-react";

import { Button } from "@super-app/shared/ui";

type Props = {
  duration: number;
  onCancel(): void;
};

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;

  return `${min}:${sec.toString().padStart(2, "0")}`;
}

export function VoiceRecorder({ duration, onCancel }: Props) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        border-b
        border-border
        bg-background
        px-4
        py-2.5
        sm:px-5
        sm:py-3
      "
    >
      <span
        className="
          relative
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-danger/10
          text-danger
        "
        aria-hidden="true"
      >
        <span
          className="
            absolute
            inset-0
            rounded-full
            border
            border-danger/20
            animate-ping
          "
        />
        <Mic size={26} strokeWidth={2} className="relative z-10" />
      </span>

      <div className="flex min-w-0 flex-1 items-center gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-text">
            در حال ضبط صدا
          </div>

          <div className="text-xs tabular-nums text-text-muted">
            {formatTime(duration)}
          </div>
        </div>

        <div className="hidden items-center gap-1 sm:flex" aria-hidden="true">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" />
          <span
            className="h-2.5 w-2.5 animate-pulse rounded-full bg-danger"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger"
            style={{ animationDelay: "240ms" }}
          />
        </div>
      </div>

      <Button
        type="button"
        variant="ghost"
        aria-label="لغو ضبط صدا"
        title="لغو ضبط صدا"
        className="
          h-9
          w-9
          shrink-0
          rounded-full
          text-text-muted
          hover:bg-danger/10
          hover:text-danger
          sm:h-10
          sm:w-10
        "
        onClick={onCancel}
      >
        <X size={26} />
      </Button>
    </div>
  );
}
