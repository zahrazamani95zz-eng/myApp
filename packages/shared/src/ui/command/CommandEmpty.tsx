"use client";

import { Command } from "cmdk";

export function CommandEmpty(
  props: React.ComponentProps<typeof Command.Empty>,
) {
  return (
    <Command.Empty
      className="py-6 text-center text-sm text-text-muted"
      {...props}
    />
  );
}
