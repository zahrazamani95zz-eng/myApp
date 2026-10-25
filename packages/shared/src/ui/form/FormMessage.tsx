"use client";

import { useFormFieldContext } from "./FormContext";

interface FormMessageProps {
  className?: string;
}

export function FormMessage({ className }: FormMessageProps) {
  const { id, name, error } = useFormFieldContext();

  if (!error) {
    return null;
  }

  return (
    <p
      id={`${id}-${name}-message`}
      className={["text-sm", "text-danger", className]
        .filter(Boolean)
        .join(" ")}
    >
      {String(error.message)}
    </p>
  );
}
