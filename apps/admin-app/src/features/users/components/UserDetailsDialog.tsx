"use client";

import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  Badge,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Spinner,
} from "@super-app/shared/ui";

import { useGetUserByIdQuery } from "../../../store/api/usersApi";
import { getApiErrorMessage } from "@/lib/api-error";

interface UserDetailsDialogProps {
  userId: string | null;
  onOpenChange: (open: boolean) => void;
}

function formatDate(value: string | null | undefined) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-2.5 text-sm last:border-0">
      <span className="text-text-muted">{label}</span>
      <span className="min-w-0 truncate font-medium text-text">{children}</span>
    </div>
  );
}

export function UserDetailsDialog({
  userId,
  onOpenChange,
}: UserDetailsDialogProps) {
  const query = useGetUserByIdQuery(userId ?? skipToken);
  const user = query.data;
  const isLocked = Boolean(user?.lockoutEnd);

  return (
    <Dialog open={userId !== null} onOpenChange={onOpenChange}>
      <DialogContent
      //size="md"
      >
        <DialogHeader>
          <DialogTitle>جزئیات کاربر</DialogTitle>
        </DialogHeader>

        {query.isLoading ? (
          <div className="flex items-center justify-center gap-2 py-10 text-text-secondary">
            <Spinner
            // size="sm"
            />{" "}
            در حال دریافت اطلاعات...
          </div>
        ) : query.isError ? (
          <p className="py-8 text-center text-sm text-danger">
            {getApiErrorMessage(
              query.error,
              "دریافت جزئیات کاربر با خطا مواجه شد.",
            )}
          </p>
        ) : user ? (
          <div className="space-y-4 pt-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
              //variant={user.isActive ? "success" : "outline"}
              >
                {user.isActive ? "فعال" : "غیرفعال"}
              </Badge>
              <Badge
              //variant={isLocked ? "danger" : "outline"}
              >
                {isLocked ? "قفل‌شده" : "بدون قفل"}
              </Badge>
              {user.phoneNumberConfirmed ? (
                <Badge
                //variant="secondary"
                >
                  موبایل تأییدشده
                </Badge>
              ) : null}
              {user.roles.map((role) => (
                <Badge
                  key={role}
                  //variant="primary"
                >
                  {role}
                </Badge>
              ))}
            </div>

            <div className="rounded-xl border border-border bg-surface px-4">
              <Row label="نام نمایشی">{user.displayName}</Row>
              <Row label="نام کاربری">{user.userName ?? "—"}</Row>
              <Row label="Login name">{user.loginName ?? "—"}</Row>
              <Row label="موبایل">
                <span dir="ltr">{user.phoneNumber ?? "—"}</span>
              </Row>
              <Row label="ایمیل">
                <span dir="ltr">{user.email ?? "—"}</span>
              </Row>
              <Row label="سازمان">{user.tenantSlug ?? user.tenantId}</Row>
              <Row label="تاریخ ایجاد">{formatDate(user.createdAtUtc)}</Row>
              <Row label="آخرین ورود">{formatDate(user.lastLoginAtUtc)}</Row>
              {user.updatedAtUtc ? (
                <Row label="آخرین بروزرسانی">
                  {formatDate(user.updatedAtUtc)}
                </Row>
              ) : null}
              {typeof user.accessFailedCount === "number" ? (
                <Row label="تلاش‌های ناموفق ورود">{user.accessFailedCount}</Row>
              ) : null}
              <Row label="شناسه کاربر">
                <span dir="ltr" className="text-xs text-text-muted">
                  {user.id}
                </span>
              </Row>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
