import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { sheetContentVariants } from "./sheetVariants";

export interface SheetContentProps extends VariantProps<
  typeof sheetContentVariants
> {
  children: ReactNode;

  className?: string;

  container?: HTMLElement;

  closeOnOutsideClick?: boolean;

  closeOnEscape?: boolean;
}
