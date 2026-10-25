"use client";

import { File, X } from "lucide-react";

import { Button } from "@super-app/shared/ui";

type Props = {
  files: File[];
  onRemove: (index: number) => void;
};

export function AttachmentPreview({ files, onRemove }: Props) {
  if (!files.length) {
    return null;
  }

  return (
    <div
      className="
        flex
        flex-wrap
        gap-2
        px-4
        pt-3
        sm:px-5
      "
    >
      {files.map((file, index) => (
        <div
          key={`${file.name}-${file.size}-${file.lastModified}-${index}`}
          className="
            flex
            min-w-0
            max-w-full
            items-center
            gap-2.5
            rounded-2xl
            border
            border-border
            bg-background
            px-2.5
            py-2
            shadow-sm
          "
        >
          <span
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-primary/10
              text-primary
            "
            aria-hidden="true"
          >
            <File size={20} strokeWidth={2} />
          </span>

          <span
            className="
              min-w-0
              max-w-[180px]
              truncate
              text-sm
              font-medium
              text-text
            "
            title={file.name}
          >
            {file.name}
          </span>

          <Button
            type="button"
            variant="ghost"
            aria-label={`حذف ${file.name}`}
            title={`حذف ${file.name}`}
            className="
              h-8
              w-8
              shrink-0
              rounded-full
              p-0
              text-text-muted
              hover:bg-danger/10
              hover:text-danger
            "
            onClick={() => onRemove(index)}
          >
            <X size={18} />
          </Button>
        </div>
      ))}
    </div>
  );
}
