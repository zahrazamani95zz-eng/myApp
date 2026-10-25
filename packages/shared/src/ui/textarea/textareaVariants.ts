import { cva } from "class-variance-authority";

export const textareaVariants = cva(
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

    "disabled:pointer-events-none",
    "disabled:opacity-50",

    "resize-none",
  ],
  {
    variants: {
      size: {
        sm: "min-h-20",
        md: "min-h-28",
        lg: "min-h-36",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);
