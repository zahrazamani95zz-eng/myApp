"use client";

interface Props {
  ordered?: boolean;
  children: React.ReactNode;
}

export function List({ ordered, children }: Props) {
  if (ordered) {
    return <ol className="ml-5 list-decimal space-y-1">{children}</ol>;
  }

  return <ul className="ml-5 list-disc space-y-1">{children}</ul>;
}
