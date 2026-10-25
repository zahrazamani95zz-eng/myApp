import type { HTMLAttributes } from "react";

import { cn } from "../../../lib";

export function Header({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "flex",

        "flex-col",

        "gap-2",

        "text-center",

        "sm:text-left",

        className,
      )}
      {...props}
    />
  );
}
