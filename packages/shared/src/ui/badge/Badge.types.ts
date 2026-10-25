import { HTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";

import { badgeVariants } from "./badgeVariants";

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}
