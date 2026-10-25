import { cn } from "../../lib";
import { SpinnerProps } from "./Spinner.types";
import { spinnerVariants } from "./spinnerVariants";

export function Spinner({ size, className }: SpinnerProps) {
  return <div className={cn(spinnerVariants({ size }), className)} />;
}
