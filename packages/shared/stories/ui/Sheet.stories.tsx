import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../src/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "../../src/ui/sheet";

const meta = {
  title: "UI/Overlays/Sheet",
  component: SheetContent,
  parameters: {
    layout: "centered",
    docs: { story: { inline: false, iframeHeight: 420 } },
  },
  args: { children: null, side: "right", size: "md" },
  argTypes: {
    side: {
      control: "inline-radio",
      options: ["right", "left", "top", "bottom"],
    },
    size: { control: "inline-radio", options: ["sm", "md", "lg", "full"] },
    children: { control: false },
  },
} satisfies Meta<typeof SheetContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">باز کردن پنل</Button>
      </SheetTrigger>
      <SheetContent {...args}>
        <div className="space-y-4 p-6" dir="rtl">
          <h2 className="text-lg font-semibold">فیلترها</h2>
          <p className="text-sm text-text-secondary">
            محتوای دلخواه پنل کناری اینجا قرار می‌گیرد.
          </p>
          <SheetClose asChild>
            <Button size="sm">اعمال</Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Sides: Story = {
  render: (args) => (
    <div className="sb-stack">
      {(["right", "left", "top", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger asChild>
            <Button variant="outline">{side}</Button>
          </SheetTrigger>
          <SheetContent {...args} side={side}>
            <div className="p-6" dir="rtl">
              پنل از سمت <code dir="ltr">{side}</code>
            </div>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  ),
};
