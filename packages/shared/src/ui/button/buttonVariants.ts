import { cva } from "class-variance-authority";

export const buttonVariants = cva(
  [
    "inline-flex",
    "items-center",
    "justify-center",
    "gap-2",
    "rounded-xl",
    "font-medium",
    "transition-all",
    "duration-200",
    "focus-visible:outline-none",
    "focus-visible:ring-4",
    "focus-visible:ring-primary/15",
    "disabled:pointer-events-none",
    "disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-primary text-white shadow-[0_8px_20px_color-mix(in_srgb,var(--primary)_20%,transparent)] hover:-translate-y-0.5 hover:brightness-105",
        secondary:
          "bg-secondary text-white shadow-[0_8px_20px_color-mix(in_srgb,var(--secondary)_18%,transparent)] hover:-translate-y-0.5 hover:brightness-105",
        outline:
          "border border-border/90 bg-surface text-text shadow-sm hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary/5",
        ghost:
          "bg-transparent text-text-secondary hover:bg-primary/7 hover:text-primary",
        danger:
          "bg-danger text-white shadow-sm hover:-translate-y-0.5 hover:brightness-105",
      },
      size: {
        sm: "h-9 px-3.5 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);
