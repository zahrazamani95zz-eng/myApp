import { TextareaHTMLAttributes } from "react";
import { VariantProps } from "class-variance-authority";

import { textareaVariants } from "./textareaVariants";

export interface TextareaProps
  extends
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {}
