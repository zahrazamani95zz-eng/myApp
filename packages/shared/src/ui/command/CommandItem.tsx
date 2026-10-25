"use client";

import { Command } from "cmdk";

import { cn } from "../../lib";

export function CommandItem({
  className,
  ...props
}: React.ComponentProps<typeof Command.Item>) {
  return (
    <Command.Item
      className={cn(
        "flex",

        "cursor-pointer",

        "items-center",

        "gap-2",

        "rounded-md",

        "px-3",
        "py-2",

        "text-sm",

        "hover:bg-surface",

        "aria-selected:bg-primary",
        "aria-selected:text-white",

        className,
      )}
      {...props}
    />
  );
}
