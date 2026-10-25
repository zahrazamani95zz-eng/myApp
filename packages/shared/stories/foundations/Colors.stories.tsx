import type { Meta, StoryObj } from "@storybook/react-vite";

import { defaultTheme } from "../../src/theme";
import type { ThemeMode } from "../../src/theme";

const meta = {
  title: "Foundations/Colors",
  parameters: { layout: "padded" },
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const cssVariable: Record<keyof ThemeMode, string> = {
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

function Swatches({ mode }: { mode: "light" | "dark" }) {
  const colors = defaultTheme.modes[mode];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {(Object.keys(colors) as Array<keyof ThemeMode>).map((token) => (
        <div
          key={token}
          className="overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div
            className="h-20 border-b border-border"
            style={{ background: colors[token] }}
          />
          <div className="space-y-1 p-3 text-xs">
            <div className="font-semibold text-text">{token}</div>
            <div dir="ltr" className="text-text-muted">
              {cssVariable[token]}
            </div>
            <div dir="ltr" className="text-text-secondary">
              {colors[token]}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export const Light: Story = {
  name: "Light (defaultTheme)",
  render: () => <Swatches mode="light" />,
};

export const Dark: Story = {
  name: "Dark (defaultTheme)",
  render: () => <Swatches mode="dark" />,
};

/** رنگ‌های زنده: از CSS variableهایی که ThemeProvider روی `:root` می‌گذارد. */
export const LiveTokens: Story = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
      {(Object.values(cssVariable) as string[]).map((variable) => (
        <div key={variable} className="space-y-2">
          <div
            className="h-14 rounded-xl border border-border"
            style={{ background: `var(${variable})` }}
          />
          <code dir="ltr" className="text-xs text-text-secondary">
            var({variable})
          </code>
        </div>
      ))}
    </div>
  ),
};
