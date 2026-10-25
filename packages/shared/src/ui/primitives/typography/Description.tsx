import type { HTMLAttributes } from "react";

import { cn } from "../../../lib";

export function Description({
  className,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-sm",
        "text-right",
        "text-text-muted",

        className,
      )}
      {...props}
    />
  );
}
