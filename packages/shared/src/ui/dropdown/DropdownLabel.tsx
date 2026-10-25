"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";

export function DropdownLabel({
  className,
  ...props
}: DropdownPrimitive.DropdownMenuLabelProps) {
  return <DropdownPrimitive.Label className={className} {...props} />;
}
