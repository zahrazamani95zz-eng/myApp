"use client";

import * as React from "react";

import { Slot } from "@radix-ui/react-slot";

import { useFormFieldContext } from "./FormContext";

export function FormControl(props: React.ComponentProps<typeof Slot>) {
  const { id, name, error } = useFormFieldContext();

  return (
    <Slot
      id={`${id}-${name}`}
      aria-invalid={!!error}
      aria-describedby={`${id}-${name}-description ${id}-${name}-message`}
      {...props}
    />
  );
}
