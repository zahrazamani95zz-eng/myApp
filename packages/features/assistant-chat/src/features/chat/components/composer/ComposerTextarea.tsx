"use client";

import { useEffect, useRef } from "react";
import type { ChangeEvent, KeyboardEvent } from "react";
import { Textarea } from "@super-app/shared/ui";

interface Props {
  value: string;
  disabled?: boolean;
  onChange(value: string): void;
  onSubmit(): void;
}

export function ComposerTextarea({
  value,
  disabled,
  onChange,
  onSubmit,
}: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) {
      return;
    }

    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [value]);

  return (
    <div className="px-4 pt-3.5 sm:px-5 sm:pt-4">
      <Textarea
        ref={textareaRef}
        value={value}
        disabled={disabled}
        placeholder="پیام خود را بنویسید..."
        rows={1}
        className="
          min-h-[60px]
          max-h-[180px]
          w-full
          resize-none
          overflow-y-auto
          border-0
          bg-transparent
          p-4
          text-[15px]
          leading-7
          text-text
          placeholder:text-text-muted
          shadow-none
          outline-none
          focus-visible:ring-0
          disabled:cursor-not-allowed
          disabled:opacity-60
        "
        onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
          onChange(event.target.value);
        }}
        onKeyDown={(event: KeyboardEvent<HTMLTextAreaElement>) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSubmit();
          }
        }}
      />
    </div>
  );
}
