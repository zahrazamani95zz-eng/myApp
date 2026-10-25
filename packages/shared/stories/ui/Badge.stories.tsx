import type { Meta, StoryObj } from "@storybook/react-vite";

import { Badge } from "../../src/ui/badge";

const meta = {
  title: "UI/Data Display/Badge",
  component: Badge,
  args: { children: "فعال" },
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondary",
        "success",
        "warning",
        "danger",
        "outline",
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="sb-stack">
      <Badge variant="primary">اصلی</Badge>
      <Badge variant="secondary">ثانویه</Badge>
      <Badge variant="success">موفق</Badge>
      <Badge variant="warning">هشدار</Badge>
      <Badge variant="danger">خطا</Badge>
      <Badge variant="outline">طرح کلی</Badge>
    </div>
  ),
};
