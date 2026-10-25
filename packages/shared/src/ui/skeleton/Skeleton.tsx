import { cn } from "../../lib";

import { SkeletonProps } from "./Skeleton.types";
import { skeletonVariants } from "./skeletonVariants";

export function Skeleton({ className, variant, ...props }: SkeletonProps) {
  return (
    <div className={cn(skeletonVariants({ variant }), className)} {...props} />
  );
}
