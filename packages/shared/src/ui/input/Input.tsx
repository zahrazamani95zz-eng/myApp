import { forwardRef } from "react";

import { cn } from "../../lib";
import { InputProps } from "./Input.types";
import { inputVariants } from "./inputVariants";

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(inputVariants({ size }), className)}
        {...props}
      />
    );
  },
);

Input.displayName = "Input";
