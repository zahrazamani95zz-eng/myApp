"use client";

interface Props {
  title: string;
  subtitle?: string;
}

export function ChatHeaderTitle({ title, subtitle }: Props) {
  return (
    <div className="min-w-0 flex-1">
      <h1 className="truncate text-[15px] font-semibold tracking-[-0.01em] text-text">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-0.5 truncate text-xs text-text-muted">{subtitle}</p>
      )}
    </div>
  );
}
