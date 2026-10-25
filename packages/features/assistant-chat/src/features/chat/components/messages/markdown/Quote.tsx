"use client";

interface Props {
  children: React.ReactNode;
}

export function Quote({ children }: Props) {
  return (
    <blockquote className="border-l-4 border-primary pl-4 italic text-text-secondary">
      {children}
    </blockquote>
  );
}
