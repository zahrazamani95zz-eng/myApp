//"use client";

// import { useTheme } from "@super-app/shared/theme";
// import { Button } from "@super-app/shared/ui";
// import { Moon, Sun } from "lucide-react";

export function ChatHeader() {
  // const { mode, toggleTheme } = useTheme();
  // const isDark = mode === "dark";
  return (
    <header className="shrink-0 bg-transparent">
      <div className="flex h-14 w-full items-center justify-between px-4 sm:h-16 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-secondary/20 text-primary shadow-sm">
            <span className="text-sm font-bold">ت</span>
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-text sm:text-base">
              AI Assistant
            </h2>
            <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(74,199,156,0.7)]" />
              <span>Online</span>
            </div>
          </div>
        </div>

        {/* <Button
          variant="ghost"
          size="sm"
          aria-label={isDark ? "فعال کردن تم روشن" : "فعال کردن تم تاریک"}
          onClick={toggleTheme}
        >
          {isDark ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </Button> */}
      </div>
    </header>
  );
}
