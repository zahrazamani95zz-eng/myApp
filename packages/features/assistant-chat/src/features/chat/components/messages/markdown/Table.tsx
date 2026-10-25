"use client";

interface Props {
  children: React.ReactNode;
}

export function Table({ children }: Props) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  );
}
