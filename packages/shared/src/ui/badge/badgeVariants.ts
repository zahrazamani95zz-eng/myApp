import { cva } from "class-variance-authority";

export const badgeVariants = cva(
  [
    "inline-flex",
    "items-center",
    "rounded-full",
    "px-2.5",
    "py-1",
    "text-xs",
    "font-medium",
  ],
  {
    variants: {
      variant: {
        primary: "bg-primary text-white",

        secondary: "bg-secondary text-white",

        success: "bg-success text-white",

        warning: "bg-warning text-white",

        danger: "bg-danger text-white",

        outline: "border border-border bg-transparent text-text",
      },
    },

    defaultVariants: {
      variant: "primary",
    },
  },
);
