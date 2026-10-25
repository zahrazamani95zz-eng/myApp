import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../src/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../src/ui/dialog";
import { Input } from "../../src/ui/input";
import { InputField } from "../../src/ui/input-field";

const meta = {
  title: "UI/Overlays/Dialog",
  component: DialogContent,
  parameters: {
    layout: "centered",
    docs: { story: { inline: false, iframeHeight: 420 } },
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg", "xl", "full"],
    },
    closeOnEscape: { control: "boolean" },
    closeOnOutsideClick: { control: "boolean" },
    children: { control: false },
  },
  args: { children: null },
} satisfies Meta<typeof DialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button>ویرایش پروفایل</Button>
      </DialogTrigger>
      <DialogContent {...args}>
        <DialogHeader>
          <DialogTitle>ویرایش پروفایل</DialogTitle>
          <DialogDescription>
            اطلاعات حساب کاربری خود را به‌روزرسانی کنید.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <InputField label="نام" required>
            <Input defaultValue="زهرا" />
          </InputField>
          <InputField label="ایمیل" description="نمایش داده نمی‌شود.">
            <Input dir="ltr" defaultValue="zahra@example.com" />
          </InputField>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">انصراف</Button>
          </DialogClose>
          <Button>ذخیره</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div className="sb-stack">
      {(["sm", "md", "lg", "xl"] as const).map((size) => (
        <Dialog key={size}>
          <DialogTrigger asChild>
            <Button variant="outline">{size}</Button>
          </DialogTrigger>
          <DialogContent {...args} size={size}>
            <DialogHeader>
              <DialogTitle>اندازهٔ {size}</DialogTitle>
              <DialogDescription>نمونهٔ اندازهٔ dialog.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      ))}
    </div>
  ),
};

export const NotDismissible: Story = {
  name: "Not dismissible (Esc / outside disabled)",
  render: (args) => (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">باز کردن</Button>
      </DialogTrigger>
      <DialogContent
        {...args}
        closeOnEscape={false}
        closeOnOutsideClick={false}
      >
        <DialogHeader>
          <DialogTitle>عملیات حساس</DialogTitle>
          <DialogDescription>فقط با دکمه‌ها قابل بستن است.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button>متوجه شدم</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
};
