"use client";

import { Description } from "../primitives";

import { useFormFieldContext } from "./FormContext";
import { useFormItemContext } from "./FormItem";

export function FormDescription(
  props: React.ComponentProps<typeof Description>,
) {
  const { name } = useFormFieldContext();

  const { id } = useFormItemContext();

  return <Description id={`${id}-${name}-description`} {...props} />;
}
