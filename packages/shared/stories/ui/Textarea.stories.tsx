import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Textarea } from "../../src/ui/textarea";

const meta = {
  title: "UI/Forms/Textarea",
  component: Textarea,
  args: {
    placeholder: "توضیحات را بنویسید...",
    onChange: fn(),
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-3">
      <Textarea {...args} size="sm" placeholder="کوچک" />
      <Textarea {...args} size="md" placeholder="متوسط" />
      <Textarea {...args} size="lg" placeholder="بزرگ" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "این فیلد غیرفعال است." },
};
