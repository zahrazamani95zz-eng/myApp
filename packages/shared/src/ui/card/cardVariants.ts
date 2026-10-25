import { cva } from "class-variance-authority";

export const cardVariants = cva(
  [
    "rounded-[20px]",
    "border",
    "border-border/80",
    "bg-card",
    "text-text",
    "shadow-[0_8px_30px_rgba(24,46,39,0.055)]",
    "transition-all",
    "duration-200",
    "hover:-translate-y-0.5",
    "hover:shadow-[0_14px_38px_rgba(24,46,39,0.08)]",
    "dark:shadow-[0_12px_34px_rgba(0,0,0,0.20)]",
  ],
  {
    variants: {
      padding: { none: "", sm: "p-4", md: "p-6", lg: "p-8" },
    },
    defaultVariants: { padding: "md" },
  },
);
