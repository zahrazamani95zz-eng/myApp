"use client";

import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw, type LucideIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
} from "@super-app/shared/ui";

export function AdminConfirmDialog({
  open,
  title,
  description,
  onOpenChange,
  onConfirm,
  loading = false,
  variant = "warning",
  confirmLabel = "تأیید",
  icon: Icon = AlertTriangle,
}: {
  open: boolean;
  title: string;
  description: ReactNode;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void | Promise<void>;
  loading?: boolean;
  variant?: "danger" | "warning";
  confirmLabel?: string;
  icon?: LucideIcon;
}) {
  const isDanger = variant === "danger";
  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!loading) onOpenChange(next);
      }}
    >
      <AlertDialogContent
        variant={isDanger ? "danger" : "default"}
        size="md"
        className="space-y-5 p-5 sm:p-6"
      >
        <div className="flex items-start gap-4" dir="rtl">
          <AlertDialogHeader className="min-w-0 flex-1 space-y-1.5 text-right">
            <AlertDialogTitle className="text-base font-semibold text-right">
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm leading-6 text-right">
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div
            className={
              isDanger
                ? "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-danger/10 text-danger"
                : "grid h-11 w-11 shrink-0 place-items-center rounded-full bg-warning/10 text-warning"
            }
          >
            <Icon size={22} />
          </div>
        </div>

        <AlertDialogFooter className="justify-start gap-2" dir="ltr">
          <Button
            type="button"
            variant="outline"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            <span dir="rtl">انصراف</span>
          </Button>
          <Button
            type="button"
            variant={isDanger ? "danger" : "secondary"}
            disabled={loading}
            onClick={() => void onConfirm()}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Icon size={16} />
            )}
            <span dir="rtl">{loading ? "در حال انجام..." : confirmLabel}</span>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
