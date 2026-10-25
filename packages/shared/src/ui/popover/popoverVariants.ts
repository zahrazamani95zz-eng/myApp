import { cva } from "class-variance-authority";

import { popoverAnimation } from "../../theme/animations";

export const popoverContentVariants = cva(
  [
    "z-50",

    "min-w-48",

    "overflow-hidden",

    "rounded-xl",

    "border",
    "border-border",

    "bg-card",
    "text-text",

    "shadow-xl",

    "p-4",

    "outline-none",

    ...popoverAnimation.content,
  ],
  {
    variants: {
      size: {
        sm: "w-[min(18rem,calc(100vw-2rem))]",
        md: "w-[min(22rem,calc(100vw-2rem))]",
        lg: "w-[min(28rem,calc(100vw-2rem))]",

        auto: "w-auto",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);
