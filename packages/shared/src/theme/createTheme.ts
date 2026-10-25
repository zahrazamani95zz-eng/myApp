import { defaultTheme } from "./defaultTheme";
import type { ThemeConfig } from "./types";

export function createTheme(tenantTheme?: Partial<ThemeConfig>): ThemeConfig {
  if (!tenantTheme) {
    return defaultTheme;
  }

  return {
    defaultMode: tenantTheme.defaultMode ?? defaultTheme.defaultMode,

    modes: {
      light: {
        ...defaultTheme.modes.light,
        ...(tenantTheme.modes?.light ?? {}),
      },

      dark: {
        ...defaultTheme.modes.dark,
        ...(tenantTheme.modes?.dark ?? {}),
      },
    },
  };
}
