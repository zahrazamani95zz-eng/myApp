import { VariantProps } from "class-variance-authority";
import { AvatarProps as RadixAvatarProps } from "@radix-ui/react-avatar";

import { avatarVariants } from "./avatarVariants";

export interface AvatarProps
  extends RadixAvatarProps, VariantProps<typeof avatarVariants> {
  src?: string;
  alt?: string;
  fallback?: string;
}
