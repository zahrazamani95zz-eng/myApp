"use client";

interface Props {
  children: React.ReactNode;
}

export function RichText({ children }: Props) {
  return <p className="leading-7 whitespace-pre-wrap">{children}</p>;
}
