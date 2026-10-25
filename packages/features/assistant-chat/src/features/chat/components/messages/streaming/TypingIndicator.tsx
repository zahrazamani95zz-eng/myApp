"use client";

export function TypingIndicator() {
  return (
    <div className="mx-auto grid w-full max-w-3xl gap-4 md:grid-cols-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
        style={{ animationDelay: "150ms" }}
      />
      <span
        className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}
