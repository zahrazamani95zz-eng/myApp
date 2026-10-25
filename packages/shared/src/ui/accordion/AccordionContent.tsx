"use client";

import * as AccordionPrimitive from "@radix-ui/react-accordion";

import { cn } from "../../lib";

import { accordionContentVariants } from "./accordionVariants";

export function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>) {
  return (
    <AccordionPrimitive.Content
      className={cn(accordionContentVariants(), className)}
      {...props}
    >
      <div className="pb-4">{children}</div>
    </AccordionPrimitive.Content>
  );
}
