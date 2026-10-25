"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { ChevronDown } from "lucide-react";

import { cn } from "../../lib";

import { accordionTriggerVariants } from "./accordionVariants";

export function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        className={cn(accordionTriggerVariants(), "group", className)}
        {...props}
      >
        <span className="flex-1">{children}</span>

        <ChevronDown
          className={cn(
            "h-4",
            "w-4",

            "shrink-0",

            "transition-transform",
            "duration-200",

            "group-data-[state=open]:rotate-180",
          )}
        />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  );
}
