import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button } from "../../src/ui/button";
import { toast } from "../../src/ui/toast";

const meta = {
  title: "UI/Feedback/Toast",
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Toastها با API امپراتیو `toast.success()` و … ساخته می‌شوند؛ `ToastProvider` در decorator سراسری Storybook نصب شده است (مثل layout اپ‌ها).",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  render: () => (
    <div className="sb-stack">
      <Button
        variant="outline"
        onClick={() =>
          toast.show({ title: "اطلاعیه", description: "پیام عمومی" })
        }
      >
        Default
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.success({
            title: "ذخیره شد",
            description: "تغییرات با موفقیت ثبت شد.",
          })
        }
      >
        Success
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.error({
            title: "خطا",
            description: "ارتباط با سرور برقرار نشد.",
          })
        }
      >
        Error
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.warning({
            title: "هشدار",
            description: "نشست شما رو به اتمام است.",
          })
        }
      >
        Warning
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.info({
            title: "راهنما",
            description: "برای جستجو Ctrl+K را بزنید.",
          })
        }
      >
        Info
      </Button>
      <Button variant="ghost" onClick={() => toast.dismissAll()}>
        بستن همه
      </Button>
    </div>
  ),
};
