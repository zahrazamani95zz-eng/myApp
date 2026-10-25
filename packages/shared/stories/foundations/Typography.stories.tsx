import type { Meta, StoryObj } from "@storybook/react-vite";

const meta = {
  title: "Foundations/Typography",
  tags: ["!autodocs"],
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const weights = [
  ["Thin", 100],
  ["UltraLight", 200],
  ["Light", 300],
  ["Regular", 400],
  ["Medium", 500],
  ["DemiBold", 600],
  ["Bold", 700],
  ["ExtraBold", 800],
  ["Black", 900],
] as const;

const sample = "سامانهٔ هوشمند مدیریت یکپارچه ۰۱۲۳۴۵۶۷۸۹";

export const FontFamily: Story = {
  name: "IRANSans weights",
  render: () => (
    <div className="space-y-3">
      {weights.map(([name, weight]) => (
        <div
          key={name}
          className="flex items-baseline justify-between gap-6 border-b border-border pb-3"
        >
          <span className="text-2xl" style={{ fontWeight: weight }}>
            {sample}
          </span>
          <code dir="ltr" className="shrink-0 text-xs text-text-muted">
            {name} · {weight}
          </code>
        </div>
      ))}
    </div>
  ),
};

const scale = [
  ["text-xs", "text-xs"],
  ["text-sm", "text-sm"],
  ["text-base", "text-base"],
  ["text-lg", "text-lg"],
  ["text-xl", "text-xl"],
  ["text-2xl", "text-2xl"],
  ["text-3xl", "text-3xl"],
] as const;

export const Scale: Story = {
  render: () => (
    <div className="space-y-3">
      {scale.map(([label, className]) => (
        <div key={label} className="flex items-baseline gap-6">
          <code dir="ltr" className="w-20 shrink-0 text-xs text-text-muted">
            {label}
          </code>
          <span className={className}>عنوان نمونه برای مقیاس تایپوگرافی</span>
        </div>
      ))}
    </div>
  ),
};

export const TextColors: Story = {
  render: () => (
    <div className="space-y-2 text-lg">
      <p className="text-text">text — متن اصلی</p>
      <p className="text-text-secondary">text-secondary — متن ثانویه</p>
      <p className="text-text-muted">text-muted — متن کم‌رنگ</p>
      <p className="text-primary">primary</p>
      <p className="text-success">success</p>
      <p className="text-warning">warning</p>
      <p className="text-danger">danger</p>
      <p className="text-info">info</p>
    </div>
  ),
};
