"use client";

import * as ToastPrimitive from "@radix-ui/react-toast";

import type { ReactNode } from "react";
import { ToastViewport } from "./ToastViewport";

interface ToastProviderProps {
  children: ReactNode;
}

export function ToastProvider({ children }: ToastProviderProps) {
  return (
    <ToastPrimitive.Provider swipeDirection="right" duration={4000}>
      <ToastViewport />
      {children}
    </ToastPrimitive.Provider>
  );
}
