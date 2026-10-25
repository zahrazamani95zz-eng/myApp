import { VariantProps } from "class-variance-authority";

import { cn } from "../../lib";

import { CardProps } from "./Card.types";
import { cardVariants } from "./cardVariants";

interface Props extends CardProps, VariantProps<typeof cardVariants> {}

export function Card({
  title,
  subtitle,
  children,
  className,
  padding,
  ...props
}: Props) {
  return (
    <div className={cn(cardVariants({ padding }), className)} {...props}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}

          {subtitle && (
            <p className="text-sm text-text-secondary">{subtitle}</p>
          )}
        </div>
      )}

      {children}
    </div>
  );
}
