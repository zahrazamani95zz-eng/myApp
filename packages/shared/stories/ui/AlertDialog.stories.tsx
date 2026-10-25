import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  DeleteConfirmDialog,
} from "../../src/ui/alert-dialog";
import { Button } from "../../src/ui/button";

const meta = {
  title: "UI/Overlays/AlertDialog",
  component: AlertDialogContent,
  parameters: {
    layout: "centered",
    docs: { story: { inline: false, iframeHeight: 360 } },
  },
  args: { children: null },
  argTypes: {
    size: { control: "inline-radio", options: ["sm", "md", "lg"] },
    variant: {
      control: "inline-radio",
      options: ["default", "danger", "warning"],
    },
    children: { control: false },
  },
} satisfies Meta<typeof AlertDialogContent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">خروج از حساب</Button>
      </AlertDialogTrigger>
      <AlertDialogContent {...args}>
        <AlertDialogHeader>
          <AlertDialogTitle>خروج از حساب کاربری</AlertDialogTitle>
          <AlertDialogDescription>
            آیا مطمئن هستید که می‌خواهید خارج شوید؟
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline">انصراف</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button>خروج</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const Danger: Story = {
  args: { variant: "danger" },
  render: Playground.render,
};

function DeleteConfirmDemo() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Button variant="danger" onClick={() => setOpen(true)}>
        حذف کاربر
      </Button>
      <DeleteConfirmDialog
        open={open}
        onOpenChange={setOpen}
        loading={loading}
        title="حذف کاربر"
        description="کاربر انتخاب‌شده برای همیشه حذف می‌شود و این عمل قابل بازگشت نیست."
        onConfirm={async () => {
          setLoading(true);
          await new Promise((resolve) => setTimeout(resolve, 1200));
          setLoading(false);
          setOpen(false);
        }}
      />
    </>
  );
}

/** کامپوننت آمادهٔ تأیید حذف؛ پس از تأیید ۱٫۲ ثانیه حالت loading دارد. */
export const DeleteConfirm: Story = {
  render: () => <DeleteConfirmDemo />,
};
