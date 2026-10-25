"use client";

import { Command } from "cmdk";

import { cn } from "../../lib";

export function CommandInput({
  //  className,
  ...props
}: React.ComponentProps<typeof Command.Input>) {
  return (
    <Command.Input
      className={cn(
        "w-full",

        "border-b",

        "border-border",

        "bg-transparent",

        "px-3",
        "py-2",

        "text-sm",

        "outline-none",
      )}
      {...props}
    />
  );
}
