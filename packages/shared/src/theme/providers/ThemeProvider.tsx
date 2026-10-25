"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

import type { ThemeModeName } from "../types";
import { applyTheme } from "../applyTheme";
import { useTenant } from "../../tenant";
import { createTheme } from "../createTheme";

interface ThemeContextType {
  mode: ThemeModeName;
  toggleTheme(): void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

interface Props {
  children: React.ReactNode;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  storageKey = "super-app-theme",
}: Props) {
  const { tenant, isLoading } = useTenant();

  /**
   * مهم:
   * createTheme نباید در هر render یک object جدید بسازد.
   */
  const theme = useMemo(() => createTheme(tenant?.theme), [tenant?.theme]);

  const [mode, setMode] = useState<ThemeModeName>("light");

  /**
   * اولویت با انتخاب ذخیره‌شده کاربر است؛ در غیر این صورت
   * defaultMode مربوط به tenant استفاده می‌شود.
   */
  useEffect(() => {
    if (!theme) {
      return;
    }

    const saved = window.localStorage.getItem(storageKey);
    setMode(saved === "light" || saved === "dark" ? saved : theme.defaultMode);
  }, [storageKey, theme]);

  /**
   * هر بار mode تغییر کرد، theme را روی document اعمال کن.
   */
  useEffect(() => {
    if (!theme) {
      return;
    }

    applyTheme(theme.modes[mode]);

    document.documentElement.classList.toggle("dark", mode === "dark");
  }, [mode, theme]);

  const value = useMemo<ThemeContextType>(
    () => ({
      mode,

      toggleTheme() {
        setMode((prev) => {
          const next = prev === "light" ? "dark" : "light";
          window.localStorage.setItem(storageKey, next);
          return next;
        });
      },
    }),
    [mode, storageKey],
  );

  if (isLoading || !theme) {
    return null;
  }

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}
