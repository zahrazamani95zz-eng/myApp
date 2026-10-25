"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "../../lib";

import { popoverContentVariants } from "./popoverVariants";

import type { PopoverContentProps } from "./Popover.types";

export function PopoverContent({
  className,

  children,

  size,

  sideOffset = 8,

  side = "bottom",

  align = "center",
}: PopoverContentProps) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(popoverContentVariants({ size }), className)}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  );
}
