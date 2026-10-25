import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { toastVariants } from "./toastVariants";

export interface ToastContentProps extends VariantProps<typeof toastVariants> {
  id: string;

  open: boolean;

  children: ReactNode;

  className?: string;
}
