import { cva } from "class-variance-authority";

export const avatarVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "overflow-hidden",
    "rounded-full",
    "bg-surface",
    "text-text",
    "border",
    "border-border",
    "select-none",
    "shrink-0",
  ],
  {
    variants: {
      size: {
        xs: "h-6 w-6 text-xs",
        sm: "h-8 w-8 text-sm",
        md: "h-10 w-10 text-base",
        lg: "h-14 w-14 text-lg",
        xl: "h-20 w-20 text-xl",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);
