"use client";

export function TypingIndicator() {
  return (
    <div className="flex gap-1 px-2 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:300ms]" />
    </div>
  );
}
