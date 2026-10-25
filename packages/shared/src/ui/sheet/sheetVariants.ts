import { cva } from "class-variance-authority";

import { sheetAnimation } from "../../theme/animations";

export const sheetOverlayVariants = cva([
  "fixed",
  "inset-0",

  "z-50",

  "bg-black/50",
  "backdrop-blur-sm",

  ...sheetAnimation.overlay,
]);

export const sheetContentVariants = cva(
  [
    "fixed",

    "z-50",

    "bg-card",
    "text-text",

    "border",
    "border-border",

    "shadow-xl",

    "outline-none",

    "overflow-y-auto",
    "overscroll-contain",

    "p-6",

    "pt-[env(safe-area-inset-top)]",
    "pb-[env(safe-area-inset-bottom)]",

    "pl-[env(safe-area-inset-left)]",
    "pr-[env(safe-area-inset-right)]",
  ],

  {
    variants: {
      side: {
        right: ["top-0", "right-0", "h-screen", "rounded-l-xl", "border-l"],

        left: ["top-0", "left-0", "h-screen", "rounded-r-xl", "border-r"],

        top: ["top-0", "left-0", "w-full", "rounded-b-xl", "border-b"],

        bottom: ["bottom-0", "left-0", "w-full", "rounded-t-xl", "border-t"],
      },

      size: {
        sm: "",

        md: "",

        lg: "",

        full: "",
      },
    },

    compoundVariants: [
      // ---------- RIGHT ----------

      {
        side: "right",
        size: "sm",
        class: ["w-[85vw]", "sm:w-[20rem]", ...sheetAnimation.content.right],
      },

      {
        side: "right",
        size: "md",
        class: [
          "w-[90vw]",
          "sm:w-[24rem]",
          "lg:w-[28rem]",

          ...sheetAnimation.content.right,
        ],
      },

      {
        side: "right",
        size: "lg",
        class: [
          "w-[92vw]",
          "sm:w-[28rem]",
          "lg:w-[36rem]",

          ...sheetAnimation.content.right,
        ],
      },

      {
        side: "right",
        size: "full",
        class: ["w-screen", ...sheetAnimation.content.right],
      },

      // ---------- LEFT ----------

      {
        side: "left",
        size: "sm",
        class: ["w-[85vw]", "sm:w-[20rem]", ...sheetAnimation.content.left],
      },

      {
        side: "left",
        size: "md",
        class: [
          "w-[90vw]",
          "sm:w-[24rem]",
          "lg:w-[28rem]",

          ...sheetAnimation.content.left,
        ],
      },

      {
        side: "left",
        size: "lg",
        class: [
          "w-[92vw]",
          "sm:w-[28rem]",
          "lg:w-[36rem]",

          ...sheetAnimation.content.left,
        ],
      },

      {
        side: "left",
        size: "full",
        class: ["w-screen", ...sheetAnimation.content.left],
      },

      // ---------- TOP ----------

      {
        side: "top",
        size: "sm",
        class: ["h-[45vh]", "sm:h-48", ...sheetAnimation.content.top],
      },

      {
        side: "top",
        size: "md",
        class: ["h-[60vh]", "sm:h-72", ...sheetAnimation.content.top],
      },

      {
        side: "top",
        size: "lg",
        class: ["h-[75vh]", "sm:h-96", ...sheetAnimation.content.top],
      },

      {
        side: "top",
        size: "full",
        class: ["h-screen", ...sheetAnimation.content.top],
      },

      // ---------- BOTTOM ----------

      {
        side: "bottom",
        size: "sm",
        class: ["h-[45vh]", "sm:h-48", ...sheetAnimation.content.bottom],
      },

      {
        side: "bottom",
        size: "md",
        class: ["h-[60vh]", "sm:h-72", ...sheetAnimation.content.bottom],
      },

      {
        side: "bottom",
        size: "lg",
        class: ["h-[75vh]", "sm:h-96", ...sheetAnimation.content.bottom],
      },

      {
        side: "bottom",
        size: "full",
        class: ["h-screen", ...sheetAnimation.content.bottom],
      },
    ],

    defaultVariants: {
      side: "right",
      size: "md",
    },
  },
);
