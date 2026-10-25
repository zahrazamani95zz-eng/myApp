import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "../../lib";
import { avatarVariants } from "./avatarVariants";
import type { AvatarProps } from "./Avatar.types";

export function Avatar({
  className,
  size,
  src,
  alt,
  fallback,
  ...props
}: AvatarProps) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size }), className)}
      {...props}
    >
      <AvatarPrimitive.Image
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />

      <AvatarPrimitive.Fallback
        delayMs={300}
        className="flex h-full w-full items-center justify-center bg-surface text-text font-medium"
      >
        {fallback}
      </AvatarPrimitive.Fallback>
    </AvatarPrimitive.Root>
  );
}
