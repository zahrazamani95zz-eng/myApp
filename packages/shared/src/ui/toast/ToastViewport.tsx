"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";

import { cn } from "../../lib";

import { useToast } from "./useToast";
import { ToastContent } from "./ToastContent";

export function ToastViewport() {
  const { toasts } = useToast();

  return (
    <>
      {toasts.map((toast) => (
        <ToastContent
          key={toast.id}
          id={toast.id}
          open={toast.open}
          variant={toast.variant}
        >
          {toast.title && (
            <ToastPrimitive.Title className="font-semibold">
              {toast.title}
            </ToastPrimitive.Title>
          )}

          {toast.description && (
            <ToastPrimitive.Description className="text-sm text-text-muted">
              {toast.description}
            </ToastPrimitive.Description>
          )}
        </ToastContent>
      ))}

      <ToastPrimitive.Viewport
        className={cn(
          "fixed",
          "bottom-0",
          "right-0",
          "z-[100]",
          "flex",
          "max-h-screen",
          "w-full",
          "flex-col",
          "gap-2",
          "p-4",
          "sm:max-w-sm",
        )}
      />
    </>
  );
}
