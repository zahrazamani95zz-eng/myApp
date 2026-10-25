"use client";

import { Mic, MicOff } from "lucide-react";

import { Button } from "@super-app/shared/ui";

type Props = {
  recording: boolean;
  onStart: () => void;
};

export function ComposerMicButton({ recording, onStart }: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onStart}
      disabled={recording}
      aria-label={recording ? "در حال ضبط صدا" : "ضبط صدا"}
      title={recording ? "در حال ضبط صدا" : "ضبط صدا"}
      className="h-6 w-6 shrink-0 rounded-full p-0 text-text-secondary hover:bg-primary/10 hover:text-primary"
    >
      {recording ? (
        <MicOff className="h-4 w-4" strokeWidth={2.1} />
      ) : (
        <Mic className="h-4 w-4" strokeWidth={2.1} />
      )}
    </Button>
  );
}
