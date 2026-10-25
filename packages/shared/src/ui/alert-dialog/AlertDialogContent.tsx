"use client";

import * as React from "react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

import { cn } from "../../lib";

import { AlertDialogPortal } from "./AlertDialog";

import {
  alertDialogOverlayVariants,
  alertDialogContentVariants,
} from "./alertDialogVariants";

import type { AlertDialogContentProps } from "./AlertDialog.types";

import { Header, Footer, Title, Description } from "../primitives";

function AlertDialogOverlay() {
  return (
    <AlertDialogPrimitive.Overlay className={alertDialogOverlayVariants()} />
  );
}

export const AlertDialogHeader = Header;

export const AlertDialogFooter = Footer;

export function AlertDialogTitle(
  props: React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>,
) {
  return (
    <AlertDialogPrimitive.Title asChild>
      <Title {...props} />
    </AlertDialogPrimitive.Title>
  );
}

export function AlertDialogDescription(
  props: React.ComponentPropsWithoutRef<
    typeof AlertDialogPrimitive.Description
  >,
) {
  return (
    <AlertDialogPrimitive.Description asChild>
      <Description {...props} />
    </AlertDialogPrimitive.Description>
  );
}

export const AlertDialogContent = React.forwardRef<
  React.ElementRef<typeof AlertDialogPrimitive.Content>,
  AlertDialogContentProps
>(
  (
    {
      children,

      className,

      size,
      variant,

      container,

      closeOnEscape = true,
    },
    ref,
  ) => {
    return (
      <AlertDialogPortal container={container}>
        <AlertDialogOverlay />

        <AlertDialogPrimitive.Content
          ref={ref}
          className={cn(
            alertDialogContentVariants({
              size,
              variant,
            }),
            className,
          )}
          onEscapeKeyDown={(event) => {
            if (!closeOnEscape) {
              event.preventDefault();
            }
          }}
        >
          {children}
        </AlertDialogPrimitive.Content>
      </AlertDialogPortal>
    );
  },
);

AlertDialogContent.displayName = "AlertDialogContent";
