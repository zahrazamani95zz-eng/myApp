"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

import { ToolbarButton } from "./ToolbarButton";

interface Props {
  text: string;
}

export function CopyButton({ text }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();

        const copiedSuccessfully = document.execCommand("copy");
        textarea.remove();

        if (!copiedSuccessfully) return;
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <ToolbarButton
      icon={copied ? <Check size={16} /> : <Copy size={16} />}
      onClick={handleCopy}
      aria-label={copied ? "کپی شد" : "کپی پیام"}
      title={copied ? "کپی شد" : "کپی"}
      disabled={copied}
    />
  );
}
