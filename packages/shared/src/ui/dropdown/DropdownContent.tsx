"use client";

import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";

import { cn } from "../../lib";

import { dropdownContentVariants } from "./dropdownVariants";

import type { DropdownContentProps } from "./Dropdown.types";

export function DropdownContent({
  className,
  children,
  sideOffset = 6,
}: DropdownContentProps) {
  return (
    <DropdownPrimitive.Portal>
      <DropdownPrimitive.Content
        sideOffset={sideOffset}
        className={cn(dropdownContentVariants(), className)}
      >
        {children}
      </DropdownPrimitive.Content>
    </DropdownPrimitive.Portal>
  );
}
