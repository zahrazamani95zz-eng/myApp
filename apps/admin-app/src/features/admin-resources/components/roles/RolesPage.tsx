"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
  OverflowTooltip,
  Badge,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  toast,
  type DataTableColumn,
} from "@super-app/shared/ui";
import {
  useCreateRoleMutation,
  useDeleteRoleMutation,
  useGetPermissionsCatalogQuery,
  useGetRolesQuery,
  useUpdateRoleMutation,
  type RoleDto,
} from "../../../../store/api/adminResourcesApi";
import { getApiErrorMessage } from "@/lib/api-error";
import { AdminConfirmDialog } from "../../../../components/admin/AdminConfirmDialog";
import { usePermissions } from "../../../../components/admin/permissions";
import {
  PAGE_SIZE,
  PageTitle,
  Toolbar,
  ServerTable,
  LoadingBox,
  ErrorBox,
} from "../shared/AdminResourcePrimitives";

export function RolesPage() {
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1),
    [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false),
    [editing, setEditing] = useState<RoleDto | null>(null),
    [deleteTarget, setDeleteTarget] = useState<RoleDto | null>(null);
  const [name, setName] = useState(""),
    [permissions, setPermissions] = useState<string[]>([]);
  const q = useGetRolesQuery({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });
  const catalog = useGetPermissionsCatalogQuery();
  const [createRole, createState] = useCreateRoleMutation(),
    [updateRole, updateState] = useUpdateRoleMutation(),
    [deleteRole] = useDeleteRoleMutation();
  const perms = catalog.data?.permissions ?? [];
  const grouped = useMemo(
    () =>
      perms.reduce<Record<string, string[]>>((a, p) => {
        const k = p.split(".")[0] ?? "other";
        (a[k] ??= []).push(p);
        return a;
      }, {}),
    [perms],
  );
  function openCreate() {
    setEditing(null);
    setName("");
    setPermissions([]);
    setDialogOpen(true);
  }
  function startEdit(r: RoleDto) {
    setEditing(r);
    setName(r.name);
    setPermissions([...r.permissions]);
    setDialogOpen(true);
  }
  function close() {
    if (createState.isLoading || updateState.isLoading) return;
    setDialogOpen(false);
    setEditing(null);
    setName("");
    setPermissions([]);
  }
  async function save() {
    const n = name.trim();
    if (!n) return;
    try {
      if (editing)
        await updateRole({ id: editing.id, name: n, permissions }).unwrap();
      else await createRole({ name: n, permissions }).unwrap();
      close();
    } catch (e) {
      toast.error({
        title: "خطا در ذخیره نقش",
        description: getApiErrorMessage(e, "ذخیره نقش ناموفق بود."),
      });
    }
  }
  const roleColumns = useMemo<DataTableColumn<RoleDto>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "نام",
        cell: ({ row }) => (
          <span className="font-semibold">{row.original.name}</span>
        ),
      },
      {
        id: "permissions",
        header: "مجوزها",
        cell: ({ row }) => (
          <div className="flex max-w-xl flex-wrap gap-1">
            {row.original.permissions.slice(0, 6).map((permission) => (
              <OverflowTooltip
                key={permission}
                content={permission}
                className="max-w-52"
                contentClassName="font-mono text-xs"
                dir="ltr"
              >
                <Badge variant="outline">{permission}</Badge>
              </OverflowTooltip>
            ))}
            {row.original.permissions.length > 6 ? (
              <Badge variant="outline">
                +{row.original.permissions.length - 6}
              </Badge>
            ) : null}
          </div>
        ),
      },
      {
        id: "id",
        accessorKey: "id",
        header: "شناسه",
        meta: { className: "font-mono text-xs" },
        cell: ({ row }) => (
          <OverflowTooltip
            content={row.original.id}
            className="max-w-40 font-mono text-xs"
            contentClassName="font-mono text-xs"
            dir="ltr"
          >
            {`${row.original.id.slice(0, 10)}…`}
          </OverflowTooltip>
        ),
      },
      {
        id: "actions",
        header: "عملیات",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex gap-2">
            {hasPermission("roles.update") ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => startEdit(row.original)}
              >
                <Pencil size={14} />
              </Button>
            ) : null}
            {hasPermission("roles.delete") ? (
              <Button
                size="sm"
                variant="outline"
                disabled={row.original.name.toLowerCase() === "superadmin"}
                onClick={() => setDeleteTarget(row.original)}
              >
                <Trash2 size={14} />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [deleteRole, hasPermission],
  );
  return (
    <section className="space-y-5">
      <PageTitle
        title="نقش‌ها"
        description="مدیریت نقش‌ها و مجوزهای قابل انتساب به آن‌ها."
      />
      <Toolbar
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        total={q.data?.totalCount ?? 0}
        onRefresh={() => void q.refetch()}
        refreshing={q.isFetching}
        action={
          hasPermission("roles.create") ? (
            <Button onClick={openCreate}>
              <Plus size={16} />
              ایجاد نقش
            </Button>
          ) : null
        }
      />
      {q.isLoading ? (
        <LoadingBox />
      ) : q.isError ? (
        <ErrorBox
          message={getApiErrorMessage(q.error, "دریافت نقش‌ها ناموفق بود.")}
          retry={() => void q.refetch()}
        />
      ) : (
        <ServerTable
          columns={roleColumns}
          data={q.data?.items ?? []}
          page={page}
          totalRows={q.data?.totalCount ?? 0}
          onPageChange={setPage}
          loading={false}
          emptyMessage="نقشی برای نمایش وجود ندارد."
        />
      )}
      {hasPermission("roles.delete") ? (
        <AdminConfirmDialog
          open={deleteTarget !== null}
          title="حذف نقش"
          description={
            deleteTarget ? `نقش «${deleteTarget.name}» حذف می‌شود.` : ""
          }
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          loading={false}
          variant="danger"
          confirmLabel="حذف"
          onConfirm={async () => {
            if (!deleteTarget) return;
            try {
              await deleteRole(deleteTarget.id).unwrap();
              setDeleteTarget(null);
            } catch (e) {
              toast.error({
                title: "خطا در حذف  نقش",
                description: getApiErrorMessage(e, "حذف نقش ناموفق بود."),
              });
            }
          }}
        />
      ) : null}
      {(
        editing ? hasPermission("roles.update") : hasPermission("roles.create")
      ) ? (
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && close()}>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>{editing ? "ویرایش نقش" : "ایجاد نقش"}</DialogTitle>
              <DialogDescription>
                {editing
                  ? "نام و مجوزهای این نقش را ویرایش کنید."
                  : "یک نقش جدید بسازید و مجوزهای آن را انتخاب کنید."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-1">
                <label
                  className="text-xs text-text-secondary"
                  htmlFor="admin-role-name"
                >
                  نام نقش
                </label>
                <Input
                  id="admin-role-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="نام نقش"
                  autoFocus
                  dir="rtl"
                  className="mt-1"
                />
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-text-secondary">
                  مجوزها
                </div>
                <div className="max-h-72 overflow-y-auto rounded-xl border border-border p-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    {Object.entries(grouped).map(([g, ps]) => (
                      <div key={g}>
                        <p className="mb-1 text-xs font-bold text-text-secondary">
                          {g}
                        </p>
                        {ps.map((p) => (
                          <label
                            key={p}
                            className="flex items-center gap-2 py-1 text-xs"
                          >
                            <input
                              type="checkbox"
                              checked={permissions.includes(p)}
                              disabled={
                                createState.isLoading || updateState.isLoading
                              }
                              onChange={(e) =>
                                setPermissions((x) =>
                                  e.target.checked
                                    ? [...x, p]
                                    : x.filter((v) => v !== p),
                                )
                              }
                            />
                            <span dir="ltr">{p}</span>
                          </label>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                انصراف
              </Button>
              <Button
                onClick={() => void save()}
                disabled={
                  !name.trim() || createState.isLoading || updateState.isLoading
                }
              >
                {createState.isLoading || updateState.isLoading
                  ? "در حال ذخیره…"
                  : editing
                    ? "ذخیره تغییرات"
                    : "ایجاد نقش"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </section>
  );
}
