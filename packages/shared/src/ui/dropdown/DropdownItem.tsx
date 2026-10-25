"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "../../lib";

export function DropdownItem({
  className,
  ...props
}: DropdownPrimitive.DropdownMenuItemProps) {
  return (
    <DropdownPrimitive.Item
      className={cn(
        "relative",
        "flex",
        "cursor-pointer",
        "select-none",
        "items-center",

        "rounded-md",

        "px-3",
        "py-2",

        "text-sm",

        "outline-none",

        "transition-colors",

        "focus:bg-surface",

        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-50",

        className,
      )}
      {...props}
    />
  );
}
