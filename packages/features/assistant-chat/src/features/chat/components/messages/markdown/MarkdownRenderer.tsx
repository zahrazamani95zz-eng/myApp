"use client";

import ReactMarkdown from "react-markdown";

import remarkGfm from "remark-gfm";

import { MarkdownRendererProps } from "./MarkdownRenderer.types";

import { RichText } from "./RichText";
import { Quote } from "./Quote";
import { List } from "./List";
import { Table } from "./Table";
import { Link } from "./Link";

export function MarkdownRenderer({ text }: MarkdownRendererProps) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <RichText>{children}</RichText>,

        blockquote: ({ children }) => <Quote>{children}</Quote>,

        ul: ({ children }) => <List>{children}</List>,

        ol: ({ children }) => <List ordered>{children}</List>,

        table: ({ children }) => <Table>{children}</Table>,

        a: ({ href, children }) => <Link href={href}>{children}</Link>,
      }}
    >
      {text}
    </ReactMarkdown>
  );
}
