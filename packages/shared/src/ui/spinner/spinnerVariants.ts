import { cva } from "class-variance-authority";

export const spinnerVariants = cva(
  [
    "animate-spin",
    "rounded-full",
    "border-2",
    "border-border",
    "border-t-primary",
  ],
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);
