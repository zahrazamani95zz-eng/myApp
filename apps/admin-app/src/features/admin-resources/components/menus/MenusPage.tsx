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
  useCreateMenuMutation,
  useDeleteMenuMutation,
  useGetMenusQuery,
  useUpdateMenuMutation,
  type MenuItemDto,
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

interface MenuFormState {
  key: string;
  parentId: string;
  route: string;
  titleFa: string;
  titleEn: string;
  iconKey: string;
  permissionKey: string;
  sortOrder: string;
  isActive: boolean;
}

const EMPTY_FORM: MenuFormState = {
  key: "",
  parentId: "",
  route: "",
  titleFa: "",
  titleEn: "",
  iconKey: "",
  permissionKey: "",
  sortOrder: "0",
  isActive: true,
};

const selectClassName =
  "h-10 w-full rounded-xl border border-border bg-surface px-3 text-sm outline-none focus:border-primary mt-1";

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-text-secondary" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
    </div>
  );
}

export function MenusPage() {
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<MenuItemDto | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MenuItemDto | null>(null);
  const [form, setForm] = useState<MenuFormState>(EMPTY_FORM);

  const q = useGetMenusQuery({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });
  // Full list (max page size) used to resolve parent titles and the parent picker.
  const allMenus = useGetMenusQuery({ page: 1, pageSize: 100 });
  const [createMenu, createState] = useCreateMenuMutation();
  const [updateMenu, updateState] = useUpdateMenuMutation();
  const [deleteMenu, deleteState] = useDeleteMenuMutation();
  const saving = createState.isLoading || updateState.isLoading;

  const menuById = useMemo(
    () => new Map((allMenus.data?.items ?? []).map((item) => [item.id, item])),
    [allMenus.data],
  );
  const parentOptions = useMemo(
    () =>
      (allMenus.data?.items ?? []).filter((item) => item.id !== editing?.id),
    [allMenus.data, editing],
  );

  function setField<K extends keyof MenuFormState>(
    field: K,
    value: MenuFormState[K],
  ) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function openCreate() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setDialogOpen(true);
  }

  function openEdit(item: MenuItemDto) {
    setEditing(item);
    setForm({
      key: item.key,
      parentId: item.parentId ?? "",
      route: item.route,
      titleFa: item.titleFa,
      titleEn: item.titleEn,
      iconKey: item.iconKey ?? "",
      permissionKey: item.permissionKey ?? "",
      sortOrder: String(item.sortOrder),
      isActive: item.isActive,
    });
    setDialogOpen(true);
  }

  function close() {
    if (saving) return;
    setDialogOpen(false);
    setEditing(null);
    setForm(EMPTY_FORM);
  }

  const sortOrderValue = Number.parseInt(form.sortOrder, 10);
  const canSave =
    (editing ? true : form.key.trim().length > 0) &&
    form.route.trim().length > 0 &&
    form.titleFa.trim().length > 0 &&
    form.titleEn.trim().length > 0 &&
    Number.isFinite(sortOrderValue);

  async function save() {
    if (!canSave) return;
    const payload = {
      parentId: form.parentId || null,
      route: form.route.trim(),
      titleFa: form.titleFa.trim(),
      titleEn: form.titleEn.trim(),
      iconKey: form.iconKey.trim() || null,
      permissionKey: form.permissionKey.trim() || null,
      sortOrder: sortOrderValue,
      isActive: form.isActive,
    };
    try {
      if (editing) await updateMenu({ id: editing.id, ...payload }).unwrap();
      else await createMenu({ key: form.key.trim(), ...payload }).unwrap();
      close();
    } catch (e) {
      toast.error({
        title: editing ? "خطا در ویرایش منو" : "خطا در ایجاد منو",
        description: getApiErrorMessage(
          e,
          editing ? "ویرایش منو ناموفق بود." : "ایجاد منو ناموفق بود.",
        ),
      });
    }
  }

  const columns = useMemo<DataTableColumn<MenuItemDto>[]>(
    () => [
      {
        id: "titleFa",
        accessorKey: "titleFa",
        header: "عنوان",
        cell: ({ row }) => (
          <div>
            <div className="font-semibold">{row.original.titleFa}</div>
            <div dir="ltr" className="text-xs text-text-secondary">
              {row.original.titleEn}
            </div>
          </div>
        ),
      },
      {
        id: "key",
        accessorKey: "key",
        header: "کلید",
        cell: ({ row }) => (
          <OverflowTooltip
            content={row.original.key}
            className="max-w-48 font-mono text-xs"
            contentClassName="font-mono text-xs"
            dir="ltr"
          >
            {row.original.key}
          </OverflowTooltip>
        ),
      },
      {
        id: "route",
        accessorKey: "route",
        header: "مسیر",
        cell: ({ row }) => (
          <OverflowTooltip
            content={row.original.route}
            className="max-w-56 font-mono text-xs"
            contentClassName="font-mono text-xs"
            dir="ltr"
          >
            {row.original.route}
          </OverflowTooltip>
        ),
      },
      {
        id: "parent",
        header: "منوی والد",
        cell: ({ row }) => {
          const parentId = row.original.parentId;
          if (!parentId) return "—";
          const parent = menuById.get(parentId);
          if (parent) {
            return (
              <OverflowTooltip content={parent.titleFa} className="max-w-40">
                {parent.titleFa}
              </OverflowTooltip>
            );
          }
          return (
            <OverflowTooltip
              content={parentId}
              className="max-w-40 font-mono text-xs"
              contentClassName="font-mono text-xs"
              dir="ltr"
            >
              {`${parentId.slice(0, 8)}…`}
            </OverflowTooltip>
          );
        },
      },
      {
        id: "permissionKey",
        header: "مجوز",
        cell: ({ row }) =>
          row.original.permissionKey ? (
            <OverflowTooltip
              content={row.original.permissionKey}
              className="max-w-52"
              contentClassName="font-mono text-xs"
              dir="ltr"
            >
              <Badge variant="outline">{row.original.permissionKey}</Badge>
            </OverflowTooltip>
          ) : (
            "—"
          ),
      },
      {
        id: "sortOrder",
        accessorKey: "sortOrder",
        header: "ترتیب",
        cell: ({ row }) => row.original.sortOrder.toLocaleString("fa-IR"),
      },
      {
        id: "status",
        header: "وضعیت",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            <Badge variant={row.original.isActive ? "success" : "outline"}>
              {row.original.isActive ? "فعال" : "غیرفعال"}
            </Badge>
            {row.original.isSystem ? (
              <Badge variant="outline">سیستمی</Badge>
            ) : null}
          </div>
        ),
      },
      {
        id: "actions",
        header: "عملیات",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {hasPermission("menus.update") ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEdit(row.original)}
              >
                <Pencil size={14} />
              </Button>
            ) : null}
            {hasPermission("menus.delete") ? (
              <Button
                size="sm"
                variant="outline"
                disabled={row.original.isSystem}
                title={
                  row.original.isSystem
                    ? "منوی سیستمی قابل حذف نیست"
                    : undefined
                }
                onClick={() => setDeleteTarget(row.original)}
              >
                <Trash2 size={14} />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [hasPermission, menuById],
  );

  return (
    <section className="space-y-5">
      <PageTitle
        title="مدیریت منوها"
        description="مدیریت آیتم‌های منوی سامانه، سلسله‌مراتب، مسیر و مجوز موردنیاز هر منو."
      />
      <Toolbar
        search={search}
        setSearch={(v) => {
          setSearch(v);
          setPage(1);
        }}
        total={q.data?.totalCount ?? 0}
        onRefresh={() => {
          void q.refetch();
          void allMenus.refetch();
        }}
        refreshing={q.isFetching}
        action={
          hasPermission("menus.create") ? (
            <Button onClick={openCreate}>
              <Plus size={16} />
              ایجاد منو
            </Button>
          ) : null
        }
      />
      {q.isLoading ? (
        <LoadingBox />
      ) : q.isError ? (
        <ErrorBox
          message={getApiErrorMessage(q.error, "دریافت منوها ناموفق بود.")}
          retry={() => void q.refetch()}
        />
      ) : (
        <ServerTable
          columns={columns}
          data={q.data?.items ?? []}
          page={page}
          totalRows={q.data?.totalCount ?? 0}
          onPageChange={setPage}
          loading={false}
          emptyMessage="منویی برای نمایش وجود ندارد."
        />
      )}

      {hasPermission("menus.delete") ? (
        <AdminConfirmDialog
          open={deleteTarget !== null}
          title="حذف منو"
          description={
            deleteTarget ? `منوی «${deleteTarget.titleFa}» حذف می‌شود.` : ""
          }
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          loading={deleteState.isLoading}
          variant="danger"
          confirmLabel="حذف"
          onConfirm={async () => {
            if (!deleteTarget) return;
            try {
              await deleteMenu(deleteTarget.id).unwrap();
              setDeleteTarget(null);
            } catch (e) {
              toast.error({
                title: "خطا در حذف منو",
                description: getApiErrorMessage(e, "حذف منو ناموفق بود."),
              });
            }
          }}
        />
      ) : null}

      {(
        editing ? hasPermission("menus.update") : hasPermission("menus.create")
      ) ? (
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && close()}>
          <DialogContent size="lg">
            <DialogHeader>
              <DialogTitle>{editing ? "ویرایش منو" : "ایجاد منو"}</DialogTitle>
              <DialogDescription>
                {editing
                  ? "اطلاعات این آیتم منو را ویرایش کنید. کلید منو قابل تغییر نیست."
                  : "اطلاعات آیتم جدید منو را وارد کنید."}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="کلید (key)" htmlFor="admin-menu-key">
                <Input
                  id="admin-menu-key"
                  value={form.key}
                  onChange={(e) => setField("key", e.target.value)}
                  placeholder="users"
                  maxLength={64}
                  dir="ltr"
                  disabled={editing !== null}
                  autoFocus={!editing}
                  className="mt-1"
                />
              </Field>
              <Field label="مسیر (route)" htmlFor="admin-menu-route">
                <Input
                  id="admin-menu-route"
                  value={form.route}
                  onChange={(e) => setField("route", e.target.value)}
                  placeholder="/admin/users"
                  maxLength={256}
                  dir="ltr"
                  className="mt-1"
                />
              </Field>
              <Field label="عنوان فارسی" htmlFor="admin-menu-title-fa">
                <Input
                  id="admin-menu-title-fa"
                  value={form.titleFa}
                  onChange={(e) => setField("titleFa", e.target.value)}
                  placeholder="کاربران"
                  maxLength={100}
                  className="mt-1"
                />
              </Field>
              <Field label="عنوان انگلیسی" htmlFor="admin-menu-title-en">
                <Input
                  id="admin-menu-title-en"
                  value={form.titleEn}
                  onChange={(e) => setField("titleEn", e.target.value)}
                  placeholder="Users"
                  maxLength={100}
                  dir="ltr"
                  className="mt-1"
                />
              </Field>
              <Field label="منوی والد" htmlFor="admin-menu-parent">
                <select
                  id="admin-menu-parent"
                  className={selectClassName}
                  value={form.parentId}
                  onChange={(e) => setField("parentId", e.target.value)}
                >
                  <option value="">— بدون والد (سطح اول) —</option>
                  {parentOptions.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.titleFa} ({item.key})
                    </option>
                  ))}
                </select>
              </Field>
              <Field
                label="مجوز موردنیاز (permissionKey)"
                htmlFor="admin-menu-permission"
              >
                <Input
                  id="admin-menu-permission"
                  value={form.permissionKey}
                  onChange={(e) => setField("permissionKey", e.target.value)}
                  placeholder="users.view"
                  maxLength={128}
                  dir="ltr"
                  className="mt-1"
                />
              </Field>
              <Field label="کلید آیکن (iconKey)" htmlFor="admin-menu-icon">
                <Input
                  id="admin-menu-icon"
                  value={form.iconKey}
                  onChange={(e) => setField("iconKey", e.target.value)}
                  placeholder="users"
                  maxLength={64}
                  dir="ltr"
                  className="mt-1"
                />
              </Field>
              <Field label="ترتیب نمایش" htmlFor="admin-menu-sort">
                <Input
                  id="admin-menu-sort"
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) => setField("sortOrder", e.target.value)}
                  dir="ltr"
                  className="mt-1"
                />
              </Field>
              <label className="flex items-center gap-2 text-sm sm:col-span-2">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setField("isActive", e.target.checked)}
                  className="mt-1"
                />
                منو فعال باشد
              </label>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close} disabled={saving}>
                انصراف
              </Button>
              <Button onClick={() => void save()} disabled={!canSave || saving}>
                {saving
                  ? "در حال ذخیره…"
                  : editing
                    ? "ذخیره تغییرات"
                    : "ایجاد منو"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </section>
  );
}
