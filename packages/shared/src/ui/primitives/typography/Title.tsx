import type { HTMLAttributes } from "react";

import { cn } from "../../../lib";

export function Title({
  className,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        "text-lg",

        "font-semibold",

        "leading-none",

        "tracking-tight",

        "text-right",
        className,
      )}
      {...props}
    />
  );
}
