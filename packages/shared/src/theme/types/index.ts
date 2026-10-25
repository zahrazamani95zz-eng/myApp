export interface ThemeMode {
  primary: string;
  secondary: string;

  background: string;
  surface: string;
  card: string;

  text: string;
  textSecondary: string;
  textMuted: string;

  border: string;

  success: string;
  warning: string;
  danger: string;
  info: string;

  overlay: string;
}

export type ThemeModeName = "light" | "dark";
export interface ThemeConfig {
  defaultMode: ThemeModeName;

  modes: Record<ThemeModeName, ThemeMode>;
}

export interface TenantConfig {
  id: string;
  name: string;
  apps: string[];
  theme: ThemeConfig;
}

export interface User {
  id: string;
  name: string;
}

export interface AuthData {
  user: User;
  tenant: TenantConfig;
  roles: string[];
  permissions: string[];
}

export type Language = "fa" | "en";
export type Direction = "rtl" | "ltr";
