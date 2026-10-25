import { cn } from "../../lib";

import { dividerVariants } from "./dividerVariants";
import { DividerProps } from "./Divider.types";

export function Divider({ orientation, className }: DividerProps) {
  return (
    <div
      className={cn(
        dividerVariants({
          orientation,
        }),
        className,
      )}
    />
  );
}
