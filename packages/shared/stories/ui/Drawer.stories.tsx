import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../src/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from "../../src/ui/drawer";

const meta = {
  title: "UI/Overlays/Drawer",
  component: DrawerContent,
  parameters: {
    layout: "centered",
    docs: { story: { inline: false, iframeHeight: 420 } },
  },
  args: { children: null, side: "left", padding: "md", radius: "none" },
  argTypes: {
    side: { control: "inline-radio", options: ["left", "right", "bottom"] },
    padding: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    radius: { control: "inline-radio", options: ["none", "sm", "md", "lg"] },
    children: { control: false },
  },
} satisfies Meta<typeof DrawerContent>;

export default meta;
type Story = StoryObj<typeof meta>;

function DrawerDemo(props: React.ComponentProps<typeof DrawerContent>) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline">باز کردن منو</Button>
      </DrawerTrigger>
      <DrawerContent {...props}>
        <div className="space-y-4" dir="rtl">
          <h2 className="text-lg font-semibold">منو</h2>
          <ul className="space-y-2 text-sm">
            <li>داشبورد</li>
            <li>کاربران</li>
            <li>تنظیمات</li>
          </ul>
          <DrawerClose asChild>
            <Button size="sm" variant="ghost">
              بستن
            </Button>
          </DrawerClose>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

export const Playground: Story = {
  render: (args) => <DrawerDemo {...args} />,
};

export const Bottom: Story = {
  args: { side: "bottom", radius: "lg" },
  render: (args) => <DrawerDemo {...args} />,
};
