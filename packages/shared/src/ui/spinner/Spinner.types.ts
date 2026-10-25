import { VariantProps } from "class-variance-authority";

import { spinnerVariants } from "./spinnerVariants";

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  className?: string;
}
