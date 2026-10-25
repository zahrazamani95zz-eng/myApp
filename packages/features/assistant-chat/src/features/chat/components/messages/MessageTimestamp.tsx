"use client";

interface Props {
  value: string;
}

export function MessageTimestamp({ value }: Props) {
  return <span className="text-[11px] text-text-secondary">{value}</span>;
}
