import { ReactNode } from "react";

export interface InputFieldProps {
  label?: string;

  description?: string;

  error?: string;

  required?: boolean;

  children: ReactNode;
}
