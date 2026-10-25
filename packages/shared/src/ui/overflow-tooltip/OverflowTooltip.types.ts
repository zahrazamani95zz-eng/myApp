import type { ReactNode } from "react";

export interface OverflowTooltipProps {
  children: ReactNode;
  content: ReactNode;
  className?: string;
  contentClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
  sideOffset?: number;
  dir?: "ltr" | "rtl" | "auto";
}
