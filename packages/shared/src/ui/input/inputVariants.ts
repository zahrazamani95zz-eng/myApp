import { cva } from "class-variance-authority";

export const inputVariants = cva(
  [
    "flex",
    "w-full",

    "rounded-md",

    "border",

    "border-border",

    "bg-background",

    "px-3",

    "py-2",

    "text-sm",

    "text-text",

    "placeholder:text-text-muted",

    "transition-all",

    "focus-visible:outline-none",

    "focus-visible:ring-2",

    "focus-visible:ring-primary",

    "disabled:cursor-not-allowed",

    "disabled:opacity-50",
  ],
  {
    variants: {
      size: {
        sm: "h-8",
        md: "h-10",
        lg: "h-12",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);
