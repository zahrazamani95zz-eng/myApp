import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../../src/ui/select";

const meta = {
  title: "UI/Forms/Select",
  component: SelectTrigger,
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "outline", "filled", "ghost"],
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-64 max-w-xs">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof SelectTrigger>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Select dir="rtl">
      <SelectTrigger {...args}>
        <SelectValue placeholder="محصول را انتخاب کنید" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="talk">تاک</SelectItem>
        <SelectItem value="ml">ML</SelectItem>
        <SelectItem value="docs">اسناد</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="space-y-3">
      {(["default", "outline", "filled", "ghost"] as const).map((variant) => (
        <Select key={variant} dir="rtl">
          <SelectTrigger variant={variant}>
            <SelectValue placeholder={variant} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">گزینه اول</SelectItem>
            <SelectItem value="b">گزینه دوم</SelectItem>
          </SelectContent>
        </Select>
      ))}
    </div>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select dir="rtl" defaultValue="users">
      <SelectTrigger>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>مدیریت</SelectLabel>
          <SelectItem value="users">کاربران</SelectItem>
          <SelectItem value="roles">نقش‌ها</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>سیستم</SelectLabel>
          <SelectItem value="audit">گزارش ممیزی</SelectItem>
          <SelectItem value="settings">تنظیمات</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};
