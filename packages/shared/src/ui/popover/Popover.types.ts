import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { popoverContentVariants } from "./popoverVariants";

export interface PopoverContentProps extends VariantProps<
  typeof popoverContentVariants
> {
  children: ReactNode;

  className?: string;

  sideOffset?: number;

  align?: "start" | "center" | "end";

  side?: "top" | "right" | "bottom" | "left";
}
