import {
  Badge,
  Button,
  OverflowTooltip,
  type DataTableColumn,
} from "@super-app/shared/ui";
import { Eye, Lock, LockOpen, LogOut, Pencil, UserRound } from "lucide-react";
import type { AdminUser } from "../../../store/api/usersApi";

function formatDate(value: string | null) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("fa-IR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getUsersColumns({
  hasPermission,
  lockLoading,
  unlockLoading,
  onDetails,
  onEdit,
  onToggleLock,
  onLock,
  onRevoke,
}: {
  hasPermission: (permission: string) => boolean;
  lockLoading: boolean;
  unlockLoading: boolean;
  onDetails: (user: AdminUser) => void;
  onEdit: (user: AdminUser) => void;
  onToggleLock: (user: AdminUser) => void;
  onLock: (user: AdminUser) => void;
  onRevoke: (user: AdminUser) => void;
}): DataTableColumn<AdminUser>[] {
  return [
    {
      id: "displayname",
      accessorKey: "displayName",
      header: "نام کاربر",
      enableSorting: true,
      cell: ({ row }) => (
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            <UserRound size={17} />
          </span>
          <div className="min-w-0">
            <OverflowTooltip
              content={row.original.displayName}
              className="max-w-48 font-medium"
            >
              {row.original.displayName}
            </OverflowTooltip>
            <OverflowTooltip
              content={row.original.userName ?? row.original.loginName ?? "—"}
              className="block max-w-48 text-xs text-text-muted"
              contentClassName="font-mono text-xs"
              dir="ltr"
            >
              {row.original.userName ?? row.original.loginName ?? "—"}
            </OverflowTooltip>
          </div>
        </div>
      ),
    },
    {
      id: "phone",
      accessorKey: "phoneNumber",
      header: "موبایل",
      enableSorting: true,
      cell: ({ row }) => (
        <span dir="ltr">{row.original.phoneNumber ?? "—"}</span>
      ),
    },
    {
      id: "tenant",
      header: "سازمان",
      cell: ({ row }) => (
        <span className="text-text-secondary">
          {row.original.tenantSlug ?? row.original.tenantId}
        </span>
      ),
    },
    {
      id: "roles",
      header: "نقش‌ها",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          {row.original.roles.length ? (
            row.original.roles.map((role) => (
              <Badge
                key={role}
                // variant="primary"
              >
                {role}
              </Badge>
            ))
          ) : (
            <span className="text-text-muted">—</span>
          )}
        </div>
      ),
    },
    {
      id: "status",
      header: "وضعیت",
      cell: ({ row }) => (
        <div className="flex flex-wrap gap-1">
          <Badge
          //variant={row.original.isActive ? "success" : "outline"}
          >
            {row.original.isActive ? "فعال" : "غیرفعال"}
          </Badge>
          {row.original.lockoutEnd ? (
            <Badge
            // variant="danger"
            >
              قفل‌شده
            </Badge>
          ) : null}
        </div>
      ),
    },
    {
      id: "created",
      accessorKey: "createdAtUtc",
      header: "تاریخ ایجاد",
      enableSorting: true,
      cell: ({ row }) => (
        <span className="text-text-secondary">
          {formatDate(row.original.createdAtUtc)}
        </span>
      ),
    },
    {
      id: "actions",
      header: "عملیات",
      enableSorting: false,
      cell: ({ row }) => {
        const user = row.original;
        const isLocked = Boolean(user.lockoutEnd);
        return (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="جزئیات"
              onClick={() => onDetails(user)}
            >
              <Eye size={16} />
            </Button>
            {hasPermission("users.update") ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="ویرایش کاربر"
                onClick={() => onEdit(user)}
              >
                <Pencil size={16} />
              </Button>
            ) : null}
            {hasPermission("users.lock") ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={isLocked ? "باز کردن قفل" : "قفل کردن کاربر"}
                disabled={lockLoading || unlockLoading}
                onClick={() => (isLocked ? onToggleLock(user) : onLock(user))}
              >
                {isLocked ? (
                  <LockOpen size={16} className="text-success" />
                ) : (
                  <Lock size={16} className="text-text-secondary" />
                )}
              </Button>
            ) : null}
            {hasPermission("users.sessions") ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="لغو نشست‌ها"
                onClick={() => onRevoke(user)}
              >
                <LogOut size={16} className="text-danger" />
              </Button>
            ) : null}
          </div>
        );
      },
    },
  ];
}
