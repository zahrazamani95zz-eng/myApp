"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "../../lib";

import { drawerOverlayVariants } from "./drawerVariants";

export function DrawerOverlay({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>) {
  return (
    <DialogPrimitive.Overlay
      className={cn(drawerOverlayVariants(), className)}
      {...props}
    />
  );
}
