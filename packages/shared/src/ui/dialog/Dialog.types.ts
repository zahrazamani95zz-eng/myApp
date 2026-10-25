import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { dialogContentVariants } from "./dialogVariants";

export interface DialogContentProps extends VariantProps<
  typeof dialogContentVariants
> {
  children: ReactNode;

  className?: string;

  container?: HTMLElement;

  closeOnOutsideClick?: boolean;

  closeOnEscape?: boolean;
}
