import { cva } from "class-variance-authority";

export const comboboxContentVariants = cva(
  [
    "z-50",

    "w-[var(--radix-popover-trigger-width)]",

    "overflow-hidden",

    "rounded-md",

    "border",

    "border-border",

    "bg-card",

    "shadow-lg",
  ],
  {
    variants: {
      size: {
        sm: "p-1",

        md: "p-2",

        lg: "p-3",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);
