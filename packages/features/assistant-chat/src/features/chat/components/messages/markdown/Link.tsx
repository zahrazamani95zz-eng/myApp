"use client";

interface Props {
  href?: string;
  children: React.ReactNode;
}

export function Link({ href, children }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  );
}
