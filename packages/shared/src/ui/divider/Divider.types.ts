import { VariantProps } from "class-variance-authority";

import { dividerVariants } from "./dividerVariants";

export interface DividerProps extends VariantProps<typeof dividerVariants> {
  className?: string;
}
