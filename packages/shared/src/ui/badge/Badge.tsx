import { cn } from "../../lib";
import { badgeVariants } from "./badgeVariants";
import { BadgeProps } from "./Badge.types";

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
