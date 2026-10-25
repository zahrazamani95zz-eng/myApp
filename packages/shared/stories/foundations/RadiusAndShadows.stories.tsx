import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Radius & Shadows",
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const radii = [
  ["rounded-md", "rounded-md"],
  ["rounded-lg", "rounded-lg"],
  ["rounded-xl", "rounded-xl"],
  ["rounded-[20px] (Card)", "rounded-[20px]"],
  ["rounded-full", "rounded-full"],
] as const;

export const Radius: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6">
      {radii.map(([label, className]) => (
        <div key={label} className="space-y-2 text-center">
          <div
            className={`h-24 w-24 border border-border-strong bg-primary/15 ${className}`}
          />
          <code dir="ltr" className="text-xs text-text-secondary">
            {label}
          </code>
        </div>
      ))}
    </div>
  ),
};

const shadows = [
  ["shadow-sm", "shadow-sm"],
  ["shadow-md", "shadow-md"],
  ["shadow-lg", "shadow-lg"],
  ["glass", "glass"],
] as const;

export const Shadows: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 rounded-2xl bg-background p-6">
      {shadows.map(([label, className]) => (
        <div key={label} className="space-y-2 text-center">
          <div className={`h-24 w-32 rounded-2xl bg-card ${className}`} />
          <code dir="ltr" className="text-xs text-text-secondary">
            {label}
          </code>
        </div>
      ))}
    </div>
  ),
};

export const Surfaces: Story = {
  render: () => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {["bg-background", "bg-surface", "bg-card"].map((className) => (
        <div
          key={className}
          className={`${className} rounded-2xl border border-border p-6 text-sm`}
        >
          <code dir="ltr">{className}</code>
        </div>
      ))}
    </div>
  ),
};
