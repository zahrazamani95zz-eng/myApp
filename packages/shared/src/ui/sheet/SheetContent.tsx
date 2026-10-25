"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { X } from "lucide-react";

import { cn } from "../../lib";

import { SheetClose, SheetPortal } from "./Sheet";

import { sheetOverlayVariants, sheetContentVariants } from "./sheetVariants";

import type { SheetContentProps } from "./Sheet.types";

function SheetOverlay() {
  return <DialogPrimitive.Overlay className={sheetOverlayVariants()} />;
}

export const SheetContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  SheetContentProps
>(
  (
    {
      children,
      className,

      side = "right",
      size = "md",

      container,

      closeOnEscape = true,
      closeOnOutsideClick = true,
    },
    ref,
  ) => {
    return (
      <SheetPortal container={container}>
        <SheetOverlay />

        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            sheetContentVariants({
              side,
              size,
            }),
            className,
          )}
          onPointerDownOutside={(event) => {
            if (!closeOnOutsideClick) {
              event.preventDefault();
            }
          }}
          onEscapeKeyDown={(event) => {
            if (!closeOnEscape) {
              event.preventDefault();
            }
          }}
        >
          {children}

          <SheetClose asChild>
            <button
              type="button"
              className={cn(
                "absolute",
                "right-4",
                "top-4",

                "rounded-md",
                "p-2",

                "text-text-muted",

                "transition-colors",

                "hover:bg-surface",
                "hover:text-text",

                "focus:outline-none",
                "focus:ring-2",
                "focus:ring-primary",
              )}
            >
              <X className="h-4 w-4" />
            </button>
          </SheetClose>
        </DialogPrimitive.Content>
      </SheetPortal>
    );
  },
);

SheetContent.displayName = "SheetContent";
