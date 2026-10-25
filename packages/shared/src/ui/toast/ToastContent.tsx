"use client";

import * as React from "react";
import * as ToastPrimitive from "@radix-ui/react-toast";

import { X } from "lucide-react";

import { cn } from "../../lib";

import { toast } from "./toast.api";

import { ToastClose } from "./Toast";

import { toastVariants } from "./toastVariants";

import type { ToastContentProps } from "./Toast.types";

export const ToastContent = React.forwardRef<
  React.ElementRef<typeof ToastPrimitive.Root>,
  ToastContentProps
>(
  (
    {
      id,
      open,

      children,

      className,

      variant,
      size,
    },
    ref,
  ) => {
    return (
      <ToastPrimitive.Root
        ref={ref}
        open={open}
        onOpenChange={(value) => {
          if (!value) {
            toast.dismiss(id);
          }
        }}
        className={cn(
          toastVariants({
            variant,
            size,
          }),
          className,
        )}
      >
        <div className="flex flex-1 flex-col gap-1">{children}</div>

        <ToastClose asChild>
          <button
            type="button"
            onClick={() => toast.dismiss(id)}
            className={cn(
              "rounded-md",

              "p-1",

              "text-text-muted",

              "transition-colors",

              "hover:text-text",

              "focus:outline-none",

              "focus:ring-2",

              "focus:ring-primary",
            )}
          >
            <X className="h-4 w-4" />
          </button>
        </ToastClose>
      </ToastPrimitive.Root>
    );
  },
);

ToastContent.displayName = "ToastContent";
