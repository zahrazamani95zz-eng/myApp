import type { Meta, StoryObj } from "@storybook/react-vite";

import { OverflowTooltip } from "../../src/ui/overflow-tooltip";

const longText =
  "این یک متن بسیار طولانی است که در عرض محدود بریده می‌شود و با نگه داشتن ماوس روی آن، متن کامل در tooltip نمایش داده خواهد شد.";

const meta = {
  title: "UI/Data Display/OverflowTooltip",
  component: OverflowTooltip,
  args: {
    content: longText,
    children: longText,
    side: "top",
  },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["top", "right", "bottom", "left"],
    },
    align: { control: "inline-radio", options: ["start", "center", "end"] },
    dir: { control: "inline-radio", options: ["auto", "rtl", "ltr"] },
  },
  decorators: [
    (Story) => (
      <div className="w-64 pt-16">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof OverflowTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
