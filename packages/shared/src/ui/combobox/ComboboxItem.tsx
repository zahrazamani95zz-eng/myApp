"use client";

import { cn } from "../../lib";

export function ComboboxItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "cursor-pointer",

        "px-3",
        "py-2",

        "text-sm",

        "rounded-md",

        "hover:bg-surface",

        "transition-colors",

        className,
      )}
      {...props}
    />
  );
}
