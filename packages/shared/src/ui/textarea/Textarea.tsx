import { forwardRef } from "react";

import { cn } from "../../lib";
import { TextareaProps } from "./Textarea.types";
import { textareaVariants } from "./textareaVariants";

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, size, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(textareaVariants({ size }), className)}
        {...props}
      />
    );
  },
);

Textarea.displayName = "Textarea";
