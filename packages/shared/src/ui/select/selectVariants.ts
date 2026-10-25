import { cva } from "class-variance-authority";

export const selectTriggerVariants = cva(
  [
    "flex",

    "w-full",

    "items-center",
    "justify-between",

    "rounded-md",

    "border",
    "border-border",

    "bg-card",

    "px-3",
    "py-2",

    "text-sm",

    "text-text",

    "shadow-sm",

    "outline-none",

    "transition",

    "focus:ring-2",
    "focus:ring-primary",
  ],
  {
    variants: {
      variant: {
        default: "",

        outline: "bg-transparent",

        filled: "bg-surface",

        ghost: "border-transparent bg-transparent",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export const selectContentVariants = cva(
  [
    "relative",

    "z-50",

    "min-w-[8rem]",

    "overflow-hidden",

    "rounded-md",

    "border",

    "border-border",

    "bg-card",

    "shadow-md",
  ],
  {
    variants: {
      variant: {
        default: "",

        compact: "p-1",

        full: "w-screen",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);
