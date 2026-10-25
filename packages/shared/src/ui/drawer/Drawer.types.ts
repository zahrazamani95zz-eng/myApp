import { ReactNode } from "react";

export type DrawerSide = "left" | "right" | "bottom";
export type DrawerPadding = "none" | "sm" | "md" | "lg";
export type DrawerRadius = "none" | "sm" | "md" | "lg";

export interface DrawerProps {
  open: boolean;
  onOpenChange(open: boolean): void;
  children: ReactNode;
}

export interface DrawerContentProps {
  side?: DrawerSide;
  padding?: DrawerPadding;
  radius?: DrawerRadius;
  className?: string;
  children: ReactNode;
}
