"use client";

interface Props {
  text: string;
  streaming?: boolean;
}

export function StreamingMessage({ text, streaming = true }: Props) {
  if (streaming && !text) {
    return (
      <span
        className="inline-flex gap-1 py-1"
        role="status"
        aria-label="در حال پاسخ‌گویی"
      >
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:300ms]" />
      </span>
    );
  }

  return (
    <span className="whitespace-pre-wrap">
      {text}
      {streaming && <span className="animate-pulse">▍</span>}
    </span>
  );
}
