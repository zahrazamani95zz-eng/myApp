"use client";

import { Label } from "../label";

import { useFormFieldContext } from "./FormContext";
import { useFormItemContext } from "./FormItem";

export function FormLabel(props: React.ComponentProps<typeof Label>) {
  const { name } = useFormFieldContext();

  const { id } = useFormItemContext();

  return <Label htmlFor={`${id}-${name}`} {...props} />;
}
