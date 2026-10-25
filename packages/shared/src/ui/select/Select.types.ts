import type { ReactNode } from "react";

import type { VariantProps } from "class-variance-authority";

import { selectTriggerVariants } from "./selectVariants";

export interface SelectTriggerProps extends VariantProps<
  typeof selectTriggerVariants
> {
  className?: string;

  children?: ReactNode;
}
