"use client";

import { ChevronDown } from "lucide-react";

import { Button } from "@super-app/shared/ui";

interface Props {
  visible: boolean;

  onClick(): void;
}

export function ScrollToBottomButton({ visible, onClick }: Props) {
  if (!visible) return null;

  return (
    <div className="absolute bottom-18 left-1/2 z-20 -translate-x-1/2">
      <Button
        size="sm"
        variant="primary"
        className="rounded-full shadow-lg"
        onClick={onClick}
      >
        <ChevronDown className="mr-2 h-4 w-4" />
        آخرین پیام
      </Button>
    </div>
  );
}
