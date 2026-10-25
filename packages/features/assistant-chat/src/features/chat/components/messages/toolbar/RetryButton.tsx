"use client";

import { RotateCcw } from "lucide-react";

import { ToolbarButton } from "./ToolbarButton";

export function RetryButton() {
  return (
    <ToolbarButton
      icon={<RotateCcw size={16} />}
      onClick={() => console.log("retry")}
    />
  );
}
