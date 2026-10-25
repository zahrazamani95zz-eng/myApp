"use client";

import * as React from "react";

import {
  Controller,
  type ControllerProps,
  type FieldValues,
} from "react-hook-form";

import { FormFieldContext } from "./FormContext";

export function FormField<TFieldValues extends FieldValues = FieldValues>({
  ...props
}: ControllerProps<TFieldValues>) {
  return (
    <FormFieldContext.Provider
      value={{
        name: props.name,
      }}
    >
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
}
