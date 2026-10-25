"use client";

import { Command } from "cmdk";

import { cn } from "../../lib";

export function CommandList({
  className,
  ...props
}: React.ComponentProps<typeof Command.List>) {
  return (
    <Command.List
      className={cn(
        "max-h-64",

        "overflow-y-auto",

        "p-2",

        className,
      )}
      {...props}
    />
  );
}
