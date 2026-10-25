"use client";

import { cn } from "../../lib/cn";
import { Tooltip, TooltipContent, TooltipTrigger } from "../tooltip";
import type { OverflowTooltipProps } from "./OverflowTooltip.types";

export function OverflowTooltip({
  children,
  content,
  className,
  contentClassName,
  side = "top",
  align = "center",
  sideOffset = 8,
  dir = "auto",
}: OverflowTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          className={cn(
            "inline-block min-w-0 max-w-full truncate align-middle",
            className,
          )}
        >
          {children}
        </span>
      </TooltipTrigger>
      <TooltipContent
        side={side}
        align={align}
        sideOffset={sideOffset}
        className={cn(
          "max-w-[min(42rem,calc(100vw-2rem))] whitespace-normal break-words text-start leading-6",
          contentClassName,
        )}
      >
        <span dir={dir}>{content}</span>
      </TooltipContent>
    </Tooltip>
  );
}
