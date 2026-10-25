import { cva } from "class-variance-authority";

import { dialogAnimation } from "../../theme/animations";

export const dialogOverlayVariants = cva([
  "fixed",
  "inset-0",

  "z-50",

  "bg-black/50",
  "backdrop-blur-sm",

  ...dialogAnimation.overlay,
]);

export const dialogContentVariants = cva(
  [
    "fixed",

    "left-1/2",
    "top-1/2",

    "-translate-x-1/2",
    "-translate-y-1/2",

    "z-50",

    "bg-card",
    "text-text",

    "border",
    "border-border",

    "rounded-xl",

    "shadow-2xl",

    "max-h-[90vh]",

    "overflow-y-auto",

    "p-6",

    "outline-none",

    ...dialogAnimation.content,
  ],

  {
    variants: {
      size: {
        sm: "w-[90vw] sm:w-[24rem]",

        md: "w-[90vw] sm:w-[32rem]",

        lg: "w-[92vw] lg:w-[42rem]",

        xl: "w-[95vw] xl:w-[60rem]",

        full: "w-screen h-screen max-w-none rounded-none",
      },
    },

    defaultVariants: {
      size: "md",
    },
  },
);
