import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { tooltipContentVariants } from "./tooltipVariants";

export interface TooltipContentProps extends VariantProps<
  typeof tooltipContentVariants
> {
  children: ReactNode;

  className?: string;

  side?: "top" | "right" | "bottom" | "left";

  align?: "start" | "center" | "end";

  sideOffset?: number;
}
