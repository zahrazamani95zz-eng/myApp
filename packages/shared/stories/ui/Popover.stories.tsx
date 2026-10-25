import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../src/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../../src/ui/popover";

const meta = {
  title: "UI/Overlays/Popover",
  component: PopoverContent,
  parameters: { layout: "centered" },
  args: { children: null, size: "md", side: "bottom", align: "center" },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg", "auto"] },
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="min-h-72 pt-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof PopoverContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">اطلاعات بیشتر</Button>
      </PopoverTrigger>
      <PopoverContent {...args}>
        <div className="space-y-2 p-4 text-sm" dir="rtl">
          <h3 className="font-semibold">دربارهٔ این گزینه</h3>
          <p className="text-text-secondary">
            توضیحات تکمیلی در یک popover نمایش داده می‌شود.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
};
