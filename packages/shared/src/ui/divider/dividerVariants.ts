import { cva } from "class-variance-authority";

export const dividerVariants = cva("bg-border", {
  variants: {
    orientation: {
      horizontal: "h-px w-full",

      vertical: "w-px h-full",
    },
  },

  defaultVariants: {
    orientation: "horizontal",
  },
});
