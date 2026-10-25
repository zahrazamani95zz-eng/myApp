"use client";

import { X } from "lucide-react";

import { cn } from "../../../lib";

interface CloseButtonProps {
  className?: string;

  onClick?: () => void;
}

export function CloseButton({ className, onClick }: CloseButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "absolute",

        "right-4",
        "top-4",

        "rounded-md",

        "p-2",

        "text-text-muted",

        "transition-colors",

        "hover:bg-surface",
        "hover:text-text",

        "focus:outline-none",

        "focus:ring-2",

        "focus:ring-primary",

        className,
      )}
    >
      <X className="h-4 w-4" />
    </button>
  );
}
