import type { Meta, StoryObj } from "@storybook/react-vite";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { fn } from "storybook/test";

import { Button } from "../../src/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../src/ui/form";
import { useForm } from "../../src/ui/form/useForm";
import { Input } from "../../src/ui/input";
import { Textarea } from "../../src/ui/textarea";

const schema = z.object({
  name: z.string().min(2, "نام باید حداقل ۲ نویسه باشد."),
  email: z.email("فرمت ایمیل صحیح نیست."),
  message: z.string().max(200, "حداکثر ۲۰۰ نویسه مجاز است.").optional(),
});

type FormValues = z.infer<typeof schema>;

const onSubmit = fn();

const meta = {
  title: "UI/Forms/Form",
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "`Form` + `FormField` روی react-hook-form ساخته شده‌اند. مصرف‌کننده‌ها `useForm` را از `@super-app/shared/ui` import می‌کنند، نه مستقیم از react-hook-form.",
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

function ContactForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", message: "" },
  });

  return (
    <Form form={form} onSubmit={onSubmit} className="w-96 space-y-4">
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>نام</FormLabel>
            <FormControl>
              <Input placeholder="نام و نام خانوادگی" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>ایمیل</FormLabel>
            <FormControl>
              <Input dir="ltr" placeholder="name@example.com" {...field} />
            </FormControl>
            <FormDescription>پاسخ به این نشانی ارسال می‌شود.</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem className="space-y-2">
            <FormLabel>پیام</FormLabel>
            <FormControl>
              <Textarea placeholder="پیام خود را بنویسید..." {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">ارسال</Button>
    </Form>
  );
}

/** با زدن «ارسال» روی فرم خالی، پیام‌های اعتبارسنجی zod نمایش داده می‌شوند. */
export const WithValidation: Story = {
  render: () => <ContactForm />,
};
