import { cva } from "class-variance-authority";

import { dropdownAnimation } from "../../theme/animations";

export const dropdownContentVariants = cva([
  "z-50",

  "min-w-48",

  "overflow-hidden",

  "rounded-lg",

  "border",

  "border-border",

  "bg-card",

  "text-text",

  "shadow-lg",
  "rounded-lg",

  "w-auto",
  "max-w-[calc(100vw-1rem)]",
  "p-1",

  "outline-none",

  ...dropdownAnimation.content,
]);
