"use client";

import type { ReactNode } from "react";
import { AlertTriangle, RefreshCw, Trash2 } from "lucide-react";

import { AlertDialog } from "./AlertDialog";

import {
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./AlertDialogContent";
import { buttonVariants } from "../button/buttonVariants";
import { cn } from "../../lib";

export interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: ReactNode;
  onConfirm: () => void | Promise<void>;
  confirmLabel?: string;
  loading?: boolean;
}

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmLabel = "حذف",
  loading = false,
}: DeleteConfirmDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!loading) onOpenChange(nextOpen);
      }}
    >
      <AlertDialogContent
        variant="danger"
        size="md"
        className="space-y-5 p-5 sm:p-6 "
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
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-danger/10 text-danger">
            <AlertTriangle size={22} />
          </div>
        </div>
        <AlertDialogFooter
          className="sm:justify-start justify-start gap-2"
          dir="ltr"
        >
          <button
            type="button"
            disabled={loading}
            className={cn(buttonVariants({ variant: "outline", size: "md" }))}
            onClick={() => onOpenChange(false)}
          >
            <span dir="rtl">انصراف</span>
          </button>
          <button
            type="button"
            disabled={loading}
            className={cn(buttonVariants({ variant: "danger", size: "md" }))}
            onClick={() => void onConfirm()}
          >
            {loading ? (
              <RefreshCw className="animate-spin" size={16} />
            ) : (
              <Trash2 size={16} />
            )}
            <span dir="rtl">{loading ? "در حال حذف..." : confirmLabel}</span>
          </button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
