"use client";

import { Button } from "@super-app/shared/ui";
import { cn } from "@super-app/shared/lib";

interface Props {
  icon: React.ReactNode;
  onClick(): void;
  // aria-label?: string;
  title?: string;
  selected?: boolean;
  disabled?: boolean;
}

export function ToolbarButton({
  icon,
  onClick,
  // "aria-label": ariaLabel,
  title,
  selected,
  disabled,
}: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={onClick}
      //aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      className={cn("h-7 w-7 p-0", selected && "bg-primary/10 text-primary")}
    >
      {icon}
    </Button>
  );
}
