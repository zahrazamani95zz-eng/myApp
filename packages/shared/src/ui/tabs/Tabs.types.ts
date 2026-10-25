import type { ReactNode } from "react";
import type { VariantProps } from "class-variance-authority";

import { tabsListVariants } from "./tabsVariants";

export interface TabsListProps extends VariantProps<typeof tabsListVariants> {
  children: ReactNode;

  className?: string;
}
