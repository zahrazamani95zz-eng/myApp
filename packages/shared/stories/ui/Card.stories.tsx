import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../src/ui/button";
import { Card } from "../../src/ui/card";

const meta = {
  title: "UI/Data Display/Card",
  component: Card,
  args: {
    title: "گزارش فروش",
    subtitle: "خلاصهٔ عملکرد ماه جاری",
    children: (
      <p className="text-sm text-text-secondary">
        فروش نسبت به ماه گذشته ۱۲٪ رشد داشته است.
      </p>
    ),
  },
  argTypes: {
    padding: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithActions: Story = {
  args: {
    children: (
      <div className="space-y-4">
        <p className="text-sm text-text-secondary">
          آیا می‌خواهید گزارش کامل را دریافت کنید؟
        </p>
        <div className="flex gap-2">
          <Button size="sm">دریافت</Button>
          <Button size="sm" variant="ghost">
            بعداً
          </Button>
        </div>
      </div>
    ),
  },
};

export const Paddings: Story = {
  render: () => (
    <div className="space-y-4">
      {(["none", "sm", "md", "lg"] as const).map((padding) => (
        <Card key={padding} padding={padding}>
          <code dir="ltr">padding=&quot;{padding}&quot;</code>
        </Card>
      ))}
    </div>
  ),
};
