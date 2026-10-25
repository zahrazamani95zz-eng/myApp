import type { Meta, StoryObj } from "@storybook/react-vite";

import { Divider } from "../../src/ui/divider";

const meta = {
  title: "UI/Data Display/Divider",
  component: Divider,
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="max-w-sm space-y-3 text-sm">
      <p>بخش اول</p>
      <Divider />
      <p>بخش دوم</p>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-8 items-center gap-3 text-sm">
      <span>نمای کلی</span>
      <Divider orientation="vertical" />
      <span>جزئیات</span>
      <Divider orientation="vertical" />
      <span>تاریخچه</span>
    </div>
  ),
};
