"use client";

import { ArrowUp } from "lucide-react";

import { Button } from "@super-app/shared/ui";

interface Props {
  disabled?: boolean;
  onClick(): void;
}

export function ComposerSendButton({ disabled, onClick }: Props) {
  return (
    <Button
      type="button"
      aria-label="ارسال پیام"
      title="ارسال پیام"
      size="sm"
      disabled={disabled}
      className="
        h-10
        w-10
        rounded-full
        bg-primary
        text-white
        shadow-sm
        shadow-primary/20
        transition-all
        duration-150
        hover:bg-primary/90
        hover:shadow-md
        hover:shadow-primary/25
        active:scale-95
        disabled:bg-border-strong
        disabled: text-white
        disabled:shadow-none
        sm:h-11
        sm:w-11
      "
      onClick={onClick}
    >
      <ArrowUp className="h-[26px] w-[26px]" strokeWidth={2.4} />
    </Button>
  );
}
