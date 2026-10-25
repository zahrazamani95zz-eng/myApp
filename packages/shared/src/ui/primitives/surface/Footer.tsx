import type { HTMLAttributes } from "react";

import { cn } from "../../../lib";

export function Footer({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "mt-6",

        "flex",

        "flex-col-reverse",

        "gap-2",

        "sm:flex-row",

        "sm:justify-end",

        className,
      )}
      {...props}
    />
  );
}
