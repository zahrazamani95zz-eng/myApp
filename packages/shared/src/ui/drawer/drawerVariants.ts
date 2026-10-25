import { cva } from "class-variance-authority";

export const drawerOverlayVariants = cva([
  "fixed",
  "inset-0",
  "z-40",
  "bg-black/50",
  "backdrop-blur-sm",
]);

export const drawerContentVariants = cva(
  [
    "fixed",
    "z-50",
    "bg-background",
    "shadow-xl",
    "outline-none",
    "transition-all",
    "duration-300",
  ],
  {
    variants: {
      side: {
        left: ["left-0", "top-0", "h-full", "w-80", "border-r"],
        right: ["right-0", "top-0", "h-full", "w-80", "border-l"],
        bottom: ["bottom-0", "left-0", "w-full", "rounded-t-2xl", "border-t"],
      },
      padding: {
        none: "p-0",
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
      radius: {
        none: "rounded-none",
        sm: "rounded-[15px]",
        md: "rounded-[20px]",
        lg: "rounded-[28px]",
      },
    },

    defaultVariants: {
      side: "left",
      padding: "none",
      radius: "none",
    },
  },
);
