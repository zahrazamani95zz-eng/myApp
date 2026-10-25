"use client";

import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { Plus, RefreshCw, ShieldAlert, Lock, LogOut } from "lucide-react";

import { Badge, Button, DataTable, toast } from "@super-app/shared/ui";

import {
  useGetUsersQuery,
  useGetPermissionsQuery,
  useLockUserMutation,
  useUnlockUserMutation,
  useRevokeUserSessionsMutation,
  type AdminUser,
  type UsersSortBy,
  type SortDirection,
} from "../../../store/api/usersApi";
import { CreateUserDialog } from "./CreateUserDialog";
import { getUsersColumns } from "./UsersTableColumns";
import { UserDetailsDialog } from "./UserDetailsDialog";
import { EditUserDialog } from "./EditUserDialog";
import { AdminConfirmDialog } from "../../../components/admin/AdminConfirmDialog";
import { getApiErrorMessage } from "@/lib/api-error";
import { AdminSearchBar } from "../../../components/admin/AdminSearchBar";
import { usePermissions } from "../../../components/admin/permissions";

const SORT_COLUMN_TO_API: Record<string, UsersSortBy> = {
  displayname: "displayname",
  phone: "phone",
  created: "created",
};

// function formatDate(value: string | null) {
//   if (!value) return "—";
//   return new Intl.DateTimeFormat("fa-IR", {
//     dateStyle: "medium",
//     timeStyle: "short",
//   }).format(new Date(value));
// }

export function UsersPage() {
  const { hasPermission } = usePermissions();
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "created", desc: true },
  ]);

  const [createOpen, setCreateOpen] = useState(false);
  const [detailsUserId, setDetailsUserId] = useState<string | null>(null);
  const [editUserId, setEditUserId] = useState<string | null>(null);
  const [lockTarget, setLockTarget] = useState<AdminUser | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<AdminUser | null>(null);

  const activeSort = sorting[0];
  const sortBy: UsersSortBy | undefined = activeSort
    ? SORT_COLUMN_TO_API[activeSort.id]
    : undefined;
  const sortDir: SortDirection | undefined = activeSort
    ? activeSort.desc
      ? "desc"
      : "asc"
    : undefined;

  const query = useGetUsersQuery({
    page: pageIndex + 1,
    pageSize,
    search: search || undefined,
    sortBy,
    sortDir,
  });

  const [lockUser, lockState] = useLockUserMutation();
  const [unlockUser, unlockState] = useUnlockUserMutation();
  const [revokeUserSessions, revokeState] = useRevokeUserSessionsMutation();

  const isForbidden = Boolean(
    query.isError &&
    query.error &&
    "status" in query.error &&
    query.error.status === 403,
  );

  const permissionsQuery = useGetPermissionsQuery(undefined, {
    skip: !isForbidden,
  });

  async function toggleLock(user: AdminUser) {
    const isLocked = Boolean(user.lockoutEnd);
    try {
      if (isLocked) {
        await unlockUser(user.id).unwrap();
        toast.success({
          title: "قفل باز شد",
          description: `قفل حساب «${user.displayName}» باز شد.`,
        });
      } else {
        await lockUser(user.id).unwrap();
        toast.success({
          title: "کاربر قفل شد",
          description: `حساب «${user.displayName}» قفل شد.`,
        });
      }
      setLockTarget(null);
    } catch (error) {
      toast.error({
        title: "خطا",
        description: getApiErrorMessage(
          error,
          "انجام عملیات قفل/بازکردن قفل ناموفق بود.",
        ),
      });
    }
  }

  async function confirmRevoke() {
    if (!revokeTarget) return;
    try {
      await revokeUserSessions(revokeTarget.id).unwrap();
      toast.success({
        title: "نشست‌ها لغو شد",
        description: `تمام نشست‌های فعال «${revokeTarget.displayName}» لغو شد.`,
      });
      setRevokeTarget(null);
    } catch (error) {
      toast.error({
        title: "خطا در لغو نشست",
        description: getApiErrorMessage(error, "لغو نشست‌های کاربر انجام نشد."),
      });
    }
  }

  const columns = useMemo(
    () =>
      getUsersColumns({
        hasPermission,
        lockLoading: lockState.isLoading,
        unlockLoading: unlockState.isLoading,
        onDetails: (user) => setDetailsUserId(user.id),
        onEdit: (user) => setEditUserId(user.id),
        onToggleLock: (user) => void toggleLock(user),
        onLock: setLockTarget,
        onRevoke: setRevokeTarget,
      }),
    [hasPermission, lockState.isLoading, unlockState.isLoading],
  );

  if (isForbidden) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-border bg-card py-16 text-center">
        <ShieldAlert className="text-danger" size={36} />
        <p className="text-lg font-semibold">دسترسی غیرمجاز</p>
        <p className="max-w-sm text-sm text-text-secondary">
          حساب شما مجوز مشاهده‌ی فهرست کاربران را ندارد
        </p>
        {permissionsQuery.data?.permissions.length ? (
          <div className="mt-2 flex max-w-md flex-wrap justify-center gap-1.5">
            {permissionsQuery.data.permissions.map((permission) => (
              <Badge
                key={permission}
                //variant={permission === "users.view" ? "primary" : "outline"}
              >
                {permission}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <section className="space-y-5">
      <AdminSearchBar
        value={search}
        onApply={(value) => {
          setPageIndex(0);
          setSearch(value);
        }}
        placeholder="نام، نام کاربری، موبایل، ایمیل یا سازمان..."
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>تعداد کل:</span>
          <strong className="text-text">
            {(query.data?.totalCount ?? 0).toLocaleString("fa-IR")}
          </strong>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasPermission("users.create") ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus size={18} /> افزودن کاربر
            </Button>
          ) : null}
          <Button
            variant="ghost"
            onClick={() => void query.refetch()}
            disabled={query.isFetching}
          >
            <RefreshCw
              size={17}
              className={query.isFetching ? "animate-spin" : ""}
            />
            بروزرسانی
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={query.data?.items ?? []}
        getRowId={(row) => row.id}
        loading={query.isLoading}
        pagination
        manualPagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.max(
          1,
          Math.ceil((query.data?.totalCount ?? 0) / pageSize),
        )}
        totalRows={query.data?.totalCount ?? 0}
        onPaginationChange={({
          pageIndex: nextPageIndex,
          pageSize: nextPageSize,
        }) => {
          setPageIndex(nextPageIndex);
          setPageSize(nextPageSize);
        }}
        manualSorting
        sorting={sorting}
        onSortingChange={(updater) =>
          setSorting((current) =>
            typeof updater === "function" ? updater(current) : updater,
          )
        }
        pageSizeOptions={[20, 50, 100]}
        emptyMessage={
          query.isError
            ? "دریافت کاربران با خطا مواجه شد."
            : "کاربری برای نمایش وجود ندارد."
        }
      />

      {hasPermission("users.create") ? (
        <CreateUserDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          onCreated={() => void query.refetch()}
        />
      ) : null}

      <UserDetailsDialog
        userId={detailsUserId}
        onOpenChange={(open) => !open && setDetailsUserId(null)}
      />

      {hasPermission("users.update") ? (
        <EditUserDialog
          userId={editUserId}
          onOpenChange={(open) => !open && setEditUserId(null)}
          onUpdated={() => void query.refetch()}
        />
      ) : null}

      {hasPermission("users.lock") ? (
        <AdminConfirmDialog
          open={lockTarget !== null}
          onOpenChange={(open) => !open && setLockTarget(null)}
          title="قفل کردن کاربر"
          description={
            lockTarget ? (
              <>
                حساب «{lockTarget.displayName}» قفل می‌شود و امکان ورود نخواهد
                داشت.
              </>
            ) : null
          }
          confirmLabel="قفل کردن"
          icon={Lock}
          variant="warning"
          loading={lockState.isLoading}
          onConfirm={() => {
            if (!lockTarget) return;
            return toggleLock(lockTarget);
          }}
        />
      ) : null}

      {hasPermission("users.sessions") ? (
        <AdminConfirmDialog
          open={revokeTarget !== null}
          onOpenChange={(open) => !open && setRevokeTarget(null)}
          title="لغو نشست‌های کاربر"
          description={
            revokeTarget ? (
              <>
                تمام نشست‌ها و توکن‌های فعال «{revokeTarget.displayName}» لغو
                می‌شود و کاربر از همه‌جا خارج می‌شود.
              </>
            ) : null
          }
          confirmLabel="لغو نشست‌ها"
          icon={LogOut}
          variant="danger"
          loading={revokeState.isLoading}
          onConfirm={confirmRevoke}
        />
      ) : null}
    </section>
  );
}
