import { cva } from "class-variance-authority";

import { tooltipAnimation } from "../../theme/animations";

export const tooltipContentVariants = cva([
  "z-50",

  "max-w-[calc(100vw-1rem)]",

  "rounded-md",

  "border",
  "border-border",

  "bg-card",

  "text-text",

  "px-3",
  "py-2",

  "text-sm",

  "shadow-lg",

  ...tooltipAnimation.content,
]);
