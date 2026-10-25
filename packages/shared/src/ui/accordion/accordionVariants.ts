import { cva } from "class-variance-authority";

import { accordionAnimation } from "../../theme/animations";

export const accordionTriggerVariants = cva([
  "flex",
  "w-full",

  "items-center",
  "justify-between",

  "gap-4",

  "py-4",

  "text-left",

  "font-medium",

  "transition-colors",

  "hover:text-primary",
]);

export const accordionContentVariants = cva([
  "overflow-hidden",

  ...accordionAnimation.content,
]);
