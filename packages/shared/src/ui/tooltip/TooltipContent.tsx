"use client";

import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import { cn } from "../../lib/cn";
import { tooltipContentVariants } from "./tooltipVariants";
import type { TooltipContentProps } from "./Tooltip.types";

export const TooltipContent = ({
  children,
  className,
  side = "top",
  align = "center",
  sideOffset = 6,
  ...props
}: TooltipContentProps) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      side={side}
      align={align}
      sideOffset={sideOffset}
      className={cn(tooltipContentVariants(), className)}
      {...props}
    >
      {children}
      <TooltipPrimitive.Arrow className="fill-card" />
    </TooltipPrimitive.Content>
  </TooltipPrimitive.Portal>
);
