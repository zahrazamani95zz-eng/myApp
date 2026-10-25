import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../src/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../../src/ui/command";

const meta = {
  title: "UI/Forms/Command",
  component: Command,
} satisfies Meta<typeof Command>;

export default meta;
type Story = StoryObj<typeof meta>;

/** پالت فرمان (cmdk) بدون dialog. */
export const Inline: Story = {
  render: () => (
    <Command
      className="max-w-md overflow-hidden rounded-xl border border-border bg-card"
      dir="rtl"
    >
      <CommandInput placeholder="جستجوی فرمان..." />
      <CommandList>
        <CommandEmpty>موردی یافت نشد.</CommandEmpty>
        <CommandGroup heading="ناوبری">
          <CommandItem>داشبورد</CommandItem>
          <CommandItem>کاربران</CommandItem>
          <CommandItem>نقش‌ها</CommandItem>
        </CommandGroup>
        <CommandGroup heading="سیستم">
          <CommandItem>تنظیمات</CommandItem>
          <CommandItem>گزارش ممیزی</CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};

function CommandDialogDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        باز کردن پالت فرمان
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="جستجو..." />
        <CommandList>
          <CommandEmpty>موردی یافت نشد.</CommandEmpty>
          <CommandGroup heading="پیشنهادها">
            <CommandItem>کاربر جدید</CommandItem>
            <CommandItem>سند جدید</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

export const AsDialog: Story = {
  render: () => <CommandDialogDemo />,
  parameters: { docs: { story: { inline: false, iframeHeight: 360 } } },
};
