"use client";

import * as React from "react";

import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "../../lib";

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Item
      ref={ref}
      className={cn(
        "relative",

        "flex",

        "cursor-pointer",

        "select-none",

        "items-center",

        "rounded-sm",

        "px-3",
        "py-2",

        "text-sm",

        "text-text",

        "outline-none",

        "focus:bg-surface",

        className,
      )}
      {...props}
    >
      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
});

SelectItem.displayName = SelectPrimitive.Item.displayName;
