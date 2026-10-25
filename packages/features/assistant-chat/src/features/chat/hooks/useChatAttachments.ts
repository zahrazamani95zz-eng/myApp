"use client";

import { useState } from "react";

export function useChatAttachments() {
  const [files, setFiles] = useState<File[]>([]);

  function addFiles(selectedFiles: FileList | null) {
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);

    setFiles((prev) => [...prev, ...newFiles]);
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function clearFiles() {
    setFiles([]);
  }

  return {
    files,
    addFiles,
    removeFile,
    clearFiles,
  };
}
