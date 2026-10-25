import type { Meta, StoryObj } from "@storybook/react-vite";

import { Input } from "../../src/ui/input";
import { InputField } from "../../src/ui/input-field";

const meta = {
  title: "UI/Forms/InputField",
  component: InputField,
  args: {
    label: "ایمیل",
    description: "از این ایمیل برای ورود استفاده می‌شود.",
    required: false,
    children: <Input type="email" dir="ltr" placeholder="name@example.com" />,
  },
  argTypes: {
    required: { control: "boolean" },
    children: { control: false },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Required: Story = {
  args: { required: true },
};

export const WithError: Story = {
  args: { error: "فرمت ایمیل صحیح نیست." },
};
