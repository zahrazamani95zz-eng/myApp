"use client";

import * as React from "react";

import { useFormContext, get } from "react-hook-form";

import { useFormItemContext } from "./FormItem";

interface FormFieldContextValue {
  name: string;
}

export const FormFieldContext =
  React.createContext<FormFieldContextValue | null>(null);

export function useFormFieldContext() {
  const fieldContext = React.useContext(FormFieldContext);

  if (!fieldContext) {
    throw new Error("useFormFieldContext must be used inside FormField");
  }

  const itemContext = useFormItemContext();

  const { formState } = useFormContext();

  const fieldState = get(formState.errors, fieldContext.name);

  return {
    id: itemContext.id,

    name: fieldContext.name,

    error: fieldState,
  };
}
