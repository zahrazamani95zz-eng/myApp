import { InputFieldProps } from "./InputField.types";

export function InputField({
  label,
  description,
  error,
  required,
  children,
}: InputFieldProps) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium text-text">
          {label}

          {required && <span className="ml-1 text-danger">*</span>}
        </label>
      )}

      {children}

      {description && !error && (
        <p className="text-xs text-text-muted">{description}</p>
      )}

      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
