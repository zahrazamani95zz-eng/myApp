import type { ThemeMode } from "./types";

const cssVariableNames: Record<keyof ThemeMode, string> = {
  primary: "--primary",
  secondary: "--secondary",
  background: "--background",
  surface: "--surface",
  card: "--card",
  text: "--text",
  textSecondary: "--text-secondary",
  textMuted: "--text-muted",
  border: "--border",
  success: "--success",
  warning: "--warning",
  danger: "--danger",
  info: "--info",
  overlay: "--overlay",
};

export function applyTheme(colors: ThemeMode): void {
  const root = document.documentElement;

  for (const key of Object.keys(cssVariableNames) as Array<keyof ThemeMode>) {
    root.style.setProperty(cssVariableNames[key], colors[key]);
  }

  root.style.colorScheme = root.classList.contains("dark") ? "dark" : "light";
}
