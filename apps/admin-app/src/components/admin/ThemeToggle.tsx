"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@super-app/shared/theme";

export function ThemeToggle() {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={mode === "dark" ? "فعال کردن تم روشن" : "فعال کردن تم تاریک"}
      title={mode === "dark" ? "تم روشن" : "تم تاریک"}
      className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-text-secondary transition hover:border-primary hover:text-primary"
    >
      {mode === "dark" ? (
        <Sun className="h-4.5 w-4.5" />
      ) : (
        <Moon className="h-4.5 w-4.5" />
      )}
    </button>
  );
}
