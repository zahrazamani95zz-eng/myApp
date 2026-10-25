"use client";

import * as React from "react";

import { cn } from "../../lib";

export function ComboboxInput({
  //  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "w-full",

        "border-b",

        "border-border",

        "bg-transparent",

        "px-3",
        "py-2",

        "text-sm",

        "outline-none",
      )}
      {...props}
    />
  );
}
