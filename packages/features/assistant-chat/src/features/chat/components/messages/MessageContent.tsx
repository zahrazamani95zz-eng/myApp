"use client";

import { MarkdownRenderer } from "./markdown";

interface Props {
  text: string;
}

export function MessageContent({ text }: Props) {
  return <MarkdownRenderer text={text} />;
}
