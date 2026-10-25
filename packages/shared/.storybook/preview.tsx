import { useEffect, type ReactNode } from "react";
import type { Decorator, Preview } from "@storybook/react-vite";

import "./fonts.css";
import "./preview.css";

import { TenantProvider } from "../src/tenant";
import { ThemeProvider, useTheme } from "../src/theme";
import {
  PersianDatePickerProvider,
  ToastProvider,
  TooltipProvider,
} from "../src/ui";

type ThemeMode = "light" | "dark";
type Direction = "rtl" | "ltr";

/**
 * Keeps the real shared ThemeProvider in sync with the Storybook toolbar.
 * (ThemeProvider owns the CSS variables via `applyTheme`, so we drive it
 * instead of toggling a class manually.)
 */
function ThemeSync({ mode }: { mode: ThemeMode }) {
  const { mode: current, toggleTheme } = useTheme();

  useEffect(() => {
    if (current !== mode) {
      toggleTheme();
    }
  }, [current, mode, toggleTheme]);

  return null;
}

function StoryProviders({
  mode,
  direction,
  children,
}: {
  mode: ThemeMode;
  direction: Direction;
  children: ReactNode;
}) {
  useEffect(() => {
    document.documentElement.lang = direction === "rtl" ? "fa" : "en";
    document.documentElement.dir = direction;
  }, [direction]);

  return (
    <TooltipProvider>
      <TenantProvider>
        <ThemeProvider storageKey="super-app-storybook-theme">
          <ThemeSync mode={mode} />
          <PersianDatePickerProvider>
            <ToastProvider>
              <div dir={direction}>{children}</div>
            </ToastProvider>
          </PersianDatePickerProvider>
        </ThemeProvider>
      </TenantProvider>
    </TooltipProvider>
  );
}

/**
 * Mirrors the provider order used by the apps' root layouts:
 * TooltipProvider > TenantProvider > ThemeProvider >
 * PersianDatePickerProvider > ToastProvider
 */
const withAppProviders: Decorator = (Story, context) => (
  <StoryProviders
    mode={(context.globals.theme as ThemeMode | undefined) ?? "light"}
    direction={(context.globals.direction as Direction | undefined) ?? "rtl"}
  >
    <Story />
  </StoryProviders>
);

const preview: Preview = {
  tags: ["autodocs"],

  decorators: [withAppProviders],

  globalTypes: {
    theme: {
      description: "Theme mode (shared ThemeProvider)",
      toolbar: {
        title: "Theme",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Light", icon: "sun" },
          { value: "dark", title: "Dark", icon: "moon" },
        ],
        dynamicTitle: true,
      },
    },
    direction: {
      description: "Text direction",
      toolbar: {
        title: "Direction",
        icon: "transfer",
        items: [
          { value: "rtl", title: "RTL (فارسی)" },
          { value: "ltr", title: "LTR" },
        ],
        dynamicTitle: true,
      },
    },
  },

  initialGlobals: {
    theme: "light",
    direction: "rtl",
  },

  parameters: {
    layout: "padded",
    // Colors come from the design tokens (light/dark theme), not from the
    // Storybook backgrounds addon.
    backgrounds: { disable: true },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: { test: "todo" },
    options: {
      storySort: {
        order: [
          "Introduction",
          "Foundations",
          ["Colors", "Typography", "Radius & Shadows"],
          "UI",
          [
            "Actions",
            "Forms",
            "Data Display",
            "Feedback",
            "Overlays",
            "Navigation",
            "Layout",
          ],
        ],
      },
    },
  },
};

export default preview;
