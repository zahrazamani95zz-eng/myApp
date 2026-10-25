"use client";

import { Square } from "lucide-react";

import { Button } from "@super-app/shared/ui";

interface Props {
  onClick(): void;
}

export function ComposerStopButton({ onClick }: Props) {
  return (
    <Button variant="secondary" onClick={onClick}>
      <Square size={16} />
    </Button>
  );
}
