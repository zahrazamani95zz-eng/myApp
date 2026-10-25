import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogOut, Settings, User } from "lucide-react";

import { Button } from "../../src/ui/button";
import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownLabel,
  DropdownSeparator,
  DropdownShortcut,
  DropdownTrigger,
} from "../../src/ui/dropdown";

const meta = {
  title: "UI/Overlays/Dropdown",
  component: Dropdown,
  parameters: { layout: "centered" },
  decorators: [
    (Story) => (
      <div className="min-h-64">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Dropdown>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Dropdown dir="rtl">
      <DropdownTrigger asChild>
        <Button variant="outline">حساب کاربری</Button>
      </DropdownTrigger>
      <DropdownContent>
        <DropdownLabel className="px-3 py-1.5 text-xs text-text-muted">
          zahra@example.com
        </DropdownLabel>
        <DropdownSeparator />
        <DropdownItem>
          <User size={16} className="ml-2" />
          پروفایل
          <DropdownShortcut>⌘P</DropdownShortcut>
        </DropdownItem>
        <DropdownItem>
          <Settings size={16} className="ml-2" />
          تنظیمات
          <DropdownShortcut>⌘,</DropdownShortcut>
        </DropdownItem>
        <DropdownItem disabled>غیرفعال</DropdownItem>
        <DropdownSeparator />
        <DropdownItem className="text-danger">
          <LogOut size={16} className="ml-2" />
          خروج
        </DropdownItem>
      </DropdownContent>
    </Dropdown>
  ),
};
