import { cva } from "class-variance-authority";

export const toastVariants = cva(
  [
    "group",

    "relative",

    "flex",
    "items-start",
    "justify-between",

    "gap-4",

    "overflow-hidden",

    "rounded-xl",

    "border",

    "p-4",

    "shadow-lg",

    "bg-card",

    "text-text",

    "transition-all",

    "data-[state=open]:animate-in",
    "data-[state=closed]:animate-out",
  ],

  {
    variants: {
      variant: {
        default: "",

        success: "border-success",

        error: "border-danger",

        warning: "border-warning",

        info: "border-info",
      },

      size: {
        sm: "text-sm",

        md: "text-base",
      },
    },

    defaultVariants: {
      variant: "default",

      size: "md",
    },
  },
);
