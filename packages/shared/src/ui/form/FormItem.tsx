"use client";

import * as React from "react";

interface FormItemContextValue {
  id: string;
}

export const FormItemContext = React.createContext<FormItemContextValue | null>(
  null,
);

export function useFormItemContext() {
  const context = React.useContext(FormItemContext);

  if (!context) {
    throw new Error("useFormItemContext must be used inside FormItem");
  }

  return context;
}

interface FormItemProps {
  children: React.ReactNode;

  className?: string;
}

export function FormItem({ children, className }: FormItemProps) {
  const id = React.useId();

  return (
    <FormItemContext.Provider value={{ id }}>
      <div className={className}>{children}</div>
    </FormItemContext.Provider>
  );
}
