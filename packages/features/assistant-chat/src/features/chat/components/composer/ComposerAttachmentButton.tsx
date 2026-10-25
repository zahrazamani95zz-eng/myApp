"use client";

import { useRef } from "react";
import { Paperclip } from "lucide-react";

import { Button } from "@super-app/shared/ui";

type Props = {
  onFilesSelected: (files: FileList | null) => void;
};

export function ComposerAttachmentButton({ onFilesSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        hidden
        onChange={(event) => {
          onFilesSelected(event.target.files);
          event.currentTarget.value = "";
        }}
      />

      <Button
        type="button"
        variant="ghost"
        aria-label="افزودن فایل"
        title="افزودن فایل"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="h-6 w-6 shrink-0 rounded-full p-0 text-text-secondary hover:bg-primary/10 hover:text-primary"
      >
        <Paperclip className="h-4 w-4" strokeWidth={2.1} />
      </Button>
    </>
  );
}
