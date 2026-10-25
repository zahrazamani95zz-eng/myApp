import type { Meta, StoryObj } from "@storybook/react-vite";
import { fn } from "storybook/test";

import { Input } from "../../src/ui/input";

const meta = {
  title: "UI/Forms/Input",
  component: Input,
  args: {
    placeholder: "نام کاربری را وارد کنید",
    onChange: fn(),
  },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    disabled: { control: "boolean" },
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search", "tel"],
    },
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div className="space-y-3">
      <Input {...args} size="sm" placeholder="کوچک" />
      <Input {...args} size="md" placeholder="متوسط" />
      <Input {...args} size="lg" placeholder="بزرگ" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: "غیرقابل ویرایش" },
};

export const Password: Story = {
  args: { type: "password", placeholder: "رمز عبور", dir: "ltr" },
};

export const Invalid: Story = {
  args: { "aria-invalid": true, defaultValue: "مقدار نامعتبر" },
};
