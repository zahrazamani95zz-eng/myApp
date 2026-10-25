import { cva } from "class-variance-authority";

export const tabsListVariants = cva(
  ["inline-flex", "items-center", "gap-1", "rounded-lg", "bg-surface", "p-1"],

  {
    variants: {
      variant: {
        default: "",

        underline: "bg-transparent p-0 rounded-none",

        pills: "rounded-full",
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export const tabsTriggerVariants = cva(
  [
    "inline-flex",

    "items-center",
    "justify-center",

    "whitespace-nowrap",

    "rounded-md",

    "px-4",
    "py-2",

    "text-sm",

    "font-medium",

    "transition-all",

    "disabled:pointer-events-none",

    "disabled:opacity-50",
  ],

  {
    variants: {
      variant: {
        default: [
          "data-[state=active]:bg-card",
          "data-[state=active]:text-text",
          "data-[state=active]:shadow-sm",
        ],

        underline: [
          "rounded-none",

          "border-b-2",

          "border-transparent",

          "data-[state=active]:border-primary",

          "data-[state=active]:text-primary",
        ],

        pills: [
          "rounded-full",

          "data-[state=active]:bg-primary",

          "data-[state=active]:text-white",
        ],
      },
    },

    defaultVariants: {
      variant: "default",
    },
  },
);

export const tabsContentVariants = cva(["mt-4", "outline-none"]);
