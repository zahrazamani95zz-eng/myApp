"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "../../lib";

import { drawerContentVariants } from "./drawerVariants";

import { DrawerOverlay } from "./DrawerOverlay";

import type { DrawerContentProps } from "./Drawer.types";

export function DrawerContent({
  children,
  side = "left",
  padding = "none",
  radius = "none",
  className,
}: DrawerContentProps) {
  return (
    <DialogPrimitive.Portal>
      <DrawerOverlay />

      <DialogPrimitive.Content
        className={cn(
          drawerContentVariants({
            side,
            padding,
            radius,
          }),
          className,
        )}
      >
        {children}
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}
