"use client";

import type { ReactNode } from "react";
import { AvanProvider } from "@avan-persian/react/client";

export interface PersianDatePickerProviderProps {
  children: ReactNode;
}

export function PersianDatePickerProvider({
  children,
}: PersianDatePickerProviderProps) {
  return (
    <AvanProvider dir="rtl" locale="fa-IR">
      {children}
    </AvanProvider>
  );
}
