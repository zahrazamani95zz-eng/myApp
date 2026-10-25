"use client";

import { useRef } from "react";
import { FileUp, UploadCloud } from "lucide-react";

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Form,
  useForm,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Spinner,
} from "@super-app/shared/ui";
import { toast } from "@super-app/shared/ui";

import { useUploadDocumentMutation } from "../../../store/api/documentsApi";
import { getApiErrorMessage } from "@/lib/api-error";

interface FormValues {
  file: FileList | undefined;
}

interface DocumentUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadSuccess?: () => void;
}

const MAX_FILE_SIZE = 20 * 1024 * 1024;

export function DocumentUploadDialog({
  open,
  onOpenChange,
  onUploadSuccess,
}: DocumentUploadDialogProps) {
  const form = useForm<FormValues>({ defaultValues: { file: undefined } });
  const [uploadDocument, { isLoading }] = useUploadDocumentMutation();
  const inputRef = useRef<HTMLInputElement | null>(null);

  async function onSubmit(values: FormValues) {
    const file = values.file?.[0];

    if (!file) {
      form.setError("file", { message: "لطفاً یک فایل PDF انتخاب کنید." });
      return;
    }

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      form.setError("file", {
        message: "فقط فایل با فرمت PDF قابل بارگذاری است.",
      });
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      form.setError("file", { message: "حداکثر حجم فایل ۲۰ مگابایت است." });
      return;
    }

    try {
      const response = await uploadDocument(file).unwrap();
      if (!response.success) {
        throw new Error(response.message ?? "بارگذاری فایل انجام نشد.");
      }

      toast.success({
        title: "آپلود موفق",
        description:
          response.message ??
          `فایل «${response.filename ?? file.name}» با موفقیت پردازش شد.`,
      });
      form.reset();
      if (inputRef.current) inputRef.current.value = "";
      onUploadSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error({
        title: "خطا در آپلود",
        description: getApiErrorMessage(
          error,
          "خطایی در ارتباط با سرویس رخ داد.",
        ),
      });
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => !isLoading && onOpenChange(value)}
    >
      <DialogContent
        size="sm"
        closeOnOutsideClick={!isLoading}
        closeOnEscape={!isLoading}
      >
        <DialogHeader>
          <DialogTitle>افزودن مستند</DialogTitle>
          <DialogDescription>
            فقط فایل PDF با حداکثر حجم ۲۰ مگابایت قابل بارگذاری است. پس از
            ارسال، فایل توسط سرویس پردازش و به Qdrant اضافه می‌شود.
          </DialogDescription>
        </DialogHeader>

        <Form form={form} onSubmit={onSubmit} className="space-y-5 pt-4">
          <FormField
            control={form.control}
            name="file"
            render={({ field: { onChange }, fieldState }) => (
              <FormItem>
                <FormLabel>فایل PDF</FormLabel>
                <FormControl>
                  <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-5 py-10 text-center transition hover:border-primary/50 hover:bg-primary/5">
                    <input
                      ref={(element) => {
                        inputRef.current = element;
                      }}
                      type="file"
                      accept="application/pdf,.pdf"
                      className="sr-only"
                      disabled={isLoading}
                      onChange={(event) =>
                        onChange(event.target.files ?? undefined)
                      }
                    />
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                      <UploadCloud size={22} />
                    </span>
                    <span className="mt-3 text-sm font-medium text-text">
                      برای انتخاب فایل کلیک کنید
                    </span>
                    <span className="mt-1 text-xs text-text-muted">
                      PDF · حداکثر ۲۰MB
                    </span>
                    {form.watch("file")?.[0]?.name ? (
                      <span className="mt-3 max-w-full truncate rounded-lg bg-background px-3 py-2 text-xs text-text-secondary">
                        {form.watch("file")?.[0]?.name}
                      </span>
                    ) : null}
                  </label>
                </FormControl>
                {fieldState.error ? <FormMessage /> : null}
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isLoading}
              onClick={() => onOpenChange(false)}
            >
              انصراف
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Spinner size="sm" /> در حال پردازش...
                </>
              ) : (
                <>
                  <FileUp size={17} /> بارگذاری فایل
                </>
              )}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
