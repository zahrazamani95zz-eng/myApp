"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { cn } from "../../lib";

import { DialogPortal } from "./Dialog";
import { dialogOverlayVariants, dialogContentVariants } from "./dialogVariants";

import type { DialogContentProps } from "./Dialog.types";
import { Header, Footer, Title, Description, CloseButton } from "../primitives";

function DialogOverlay() {
  return <DialogPrimitive.Overlay className={dialogOverlayVariants()} />;
}

export function DialogHeader({
  className,
  ...props
}: React.ComponentProps<typeof Header>) {
  return (
    <Header
      className={cn("border-b border-border/60 pb-4", className)}
      {...props}
    />
  );
}

export function DialogFooter({
  className,
  ...props
}: React.ComponentProps<typeof Footer>) {
  return (
    <Footer
      className={cn("border-t border-border/60 pt-4", className)}
      {...props}
    />
  );
}

export function DialogTitle(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>,
) {
  return (
    <DialogPrimitive.Title asChild>
      <Title {...props} />
    </DialogPrimitive.Title>
  );
}

export function DialogDescription(
  props: React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>,
) {
  return (
    <DialogPrimitive.Description asChild>
      <Description {...props} />
    </DialogPrimitive.Description>
  );
}

export const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(
  (
    {
      children,
      className,
      size,

      container,

      closeOnEscape = true,
      closeOnOutsideClick = true,
    },
    ref,
  ) => {
    return (
      <DialogPortal container={container}>
        <DialogOverlay />

        <DialogPrimitive.Content
          ref={ref}
          dir="rtl"
          className={cn(
            dialogContentVariants({
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

          <DialogPrimitive.Close asChild>
            <CloseButton className="left-4 right-auto" />
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  },
);

DialogContent.displayName = "DialogContent";
