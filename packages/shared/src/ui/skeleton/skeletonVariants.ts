import { cva } from "class-variance-authority";

export const skeletonVariants = cva(
  ["animate-pulse", "rounded-md", "bg-surface"],
  {
    variants: {
      variant: {
        default: "",

        circle: "rounded-full",

        text: "h-4 rounded",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);
