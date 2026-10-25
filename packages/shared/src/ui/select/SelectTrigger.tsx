"use client";

import * as React from "react";

import * as SelectPrimitive from "@radix-ui/react-select";

import { cn } from "../../lib";

import { selectTriggerVariants } from "./selectVariants";

import type { SelectTriggerProps } from "./Select.types";

import { ChevronDown } from "lucide-react";

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectTriggerProps
>(({ className, variant, children, ...props }, ref) => {
  return (
    <SelectPrimitive.Trigger
      dir="rtl"
      ref={ref}
      className={cn(selectTriggerVariants({ variant }), className)}
      {...props}
    >
      {children}

      <ChevronDown className="h-4 w-4 opacity-70" />
    </SelectPrimitive.Trigger>
  );
});

SelectTrigger.displayName = SelectPrimitive.Trigger.displayName;
