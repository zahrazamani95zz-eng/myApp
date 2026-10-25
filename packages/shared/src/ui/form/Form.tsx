"use client";

import type { ReactNode } from "react";

import {
  FormProvider,
  type FieldValues,
  type SubmitHandler,
  type UseFormReturn,
} from "react-hook-form";

interface FormProps<TFieldValues extends FieldValues = FieldValues> {
  children: ReactNode;

  form: UseFormReturn<TFieldValues>;

  onSubmit: SubmitHandler<TFieldValues>;

  className?: string;
}

export function Form<TFieldValues extends FieldValues = FieldValues>({
  children,
  form,
  onSubmit,
  className,
}: FormProps<TFieldValues>) {
  return (
    <FormProvider {...form}>
      <form
        className={className}
        onSubmit={(e) => {
          void form.handleSubmit(onSubmit)(e);
        }}
      >
        {children}
      </form>
    </FormProvider>
  );
}
