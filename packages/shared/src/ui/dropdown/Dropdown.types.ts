import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { dropdownContentVariants } from "./dropdownVariants";

export interface DropdownContentProps extends VariantProps<
  typeof dropdownContentVariants
> {
  children: ReactNode;
  className?: string;
  sideOffset?: number;
}
