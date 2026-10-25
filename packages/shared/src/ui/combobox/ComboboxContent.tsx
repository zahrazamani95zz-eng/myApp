"use client";

import * as React from "react";

import * as Popover from "@radix-ui/react-popover";

import { cn } from "../../lib";

import { comboboxContentVariants } from "./comboboxVariants";

export const ComboboxContent = React.forwardRef<
  React.ElementRef<typeof Popover.Content>,
  React.ComponentPropsWithoutRef<typeof Popover.Content>
>(({ className, children, ...props }, ref) => {
  return (
    <Popover.Portal>
      <Popover.Content
        ref={ref}
        sideOffset={4}
        className={cn(comboboxContentVariants(), className)}
        {...props}
      >
        {children}
      </Popover.Content>
    </Popover.Portal>
  );
});

ComboboxContent.displayName = "ComboboxContent";
