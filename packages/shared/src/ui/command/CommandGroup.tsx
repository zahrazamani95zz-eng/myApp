"use client";

import { Command } from "cmdk";

export function CommandGroup(
  props: React.ComponentProps<typeof Command.Group>,
) {
  return <Command.Group className="overflow-hidden p-1" {...props} />;
}
