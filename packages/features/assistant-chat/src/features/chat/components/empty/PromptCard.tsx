"use client";

import { ChevronLeft } from "lucide-react";
import { cn } from "@super-app/shared/lib";

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export function PromptCard({ title, description, icon, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group rounded-2xl  bg-card p-5 text-right",
        "transition-all duration-200",
        "hover:-translate-y-0.5",
        "hover:border-primary/30",
        "hover:shadow-md",
      )}
    >
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="truncate whitespace-nowrap font-semibold">{title}</h3>

          <p className="mt-1 hidden text-sm text-text-muted sm:block">
            {description}
          </p>
        </div>

        <ChevronLeft className="mt-1 h-4 w-4 text-text-secondary opacity-0 transition group-hover:opacity-100" />
      </div>
    </button>
  );
}
