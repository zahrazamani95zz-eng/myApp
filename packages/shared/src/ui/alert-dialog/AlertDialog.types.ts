import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { alertDialogContentVariants } from "./alertDialogVariants";

export interface AlertDialogContentProps extends VariantProps<
  typeof alertDialogContentVariants
> {
  children: ReactNode;

  className?: string;

  container?: HTMLElement;

  closeOnEscape?: boolean;
}
