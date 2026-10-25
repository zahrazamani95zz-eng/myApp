"use client";

import { AccountMenu } from "@super-app/features-auth/presentation";
import { logoutEverywhere } from "../app/actions/session-actions";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@super-app/shared/theme";

export function AppHeader() {
  const { mode, toggleTheme } = useTheme();
  return (
    <header className="relative z-30 flex min-h-[64px] flex-none items-center justify-between border-b border-border bg-background px-4 sm:px-6 lg:px-8">
      {/* عنوان سمت راست */}
      <div className="min-w-0">
        <h1 className="truncate text-base font-bold sm:text-lg"> تاک</h1>
      </div>

      {/* تغییر تم و خروج سمت چپ */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={
            mode === "dark" ? "فعال کردن تم روشن" : "فعال کردن تم تاریک"
          }
          title={mode === "dark" ? "تم روشن" : "تم تاریک"}
          className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-surface text-text-secondary transition hover:border-primary hover:text-primary"
        >
          {mode === "dark" ? (
            <Sun className="h-4.5 w-4.5" />
          ) : (
            <Moon className="h-4.5 w-4.5" />
          )}
        </button>

        <AccountMenu onSignOut={logoutEverywhere} />
      </div>
    </header>
  );
}
