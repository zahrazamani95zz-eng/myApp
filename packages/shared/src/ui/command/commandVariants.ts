import { cva } from "class-variance-authority";

export const commandItemVariants = cva(
  [
    "flex",

    "items-center",

    "gap-2",

    "px-3",
    "py-2",

    "text-sm",

    "rounded-md",

    "cursor-pointer",

    "select-none",

    "outline-none",

    "transition-colors",

    "hover:bg-surface",

    "aria-selected:bg-primary",
    "aria-selected:text-white",
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);
