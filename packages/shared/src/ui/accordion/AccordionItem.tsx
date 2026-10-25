"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "../../lib";

export function AccordionItem({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={cn("border-b border-border", className)}
      {...props}
    />
  );
}
