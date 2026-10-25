import type { Meta, StoryObj } from "@storybook/react-vite";

import { Avatar } from "../../src/ui/avatar";

const meta = {
  title: "UI/Data Display/Avatar",
  component: Avatar,
  args: {
    fallback: "ز ز",
    alt: "زهرا زمانی",
  },
  argTypes: {
    size: { control: "inline-radio", options: ["xs", "sm", "md", "lg", "xl"] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-stack">
      {(["xs", "sm", "md", "lg", "xl"] as const).map((size) => (
        <Avatar key={size} {...args} size={size} fallback="ز" />
      ))}
    </div>
  ),
};

/** وقتی تصویر بارگذاری نشود، fallback نمایش داده می‌شود. */
export const BrokenImage: Story = {
  args: { src: "https://invalid.example/avatar.png", fallback: "؟" },
};
