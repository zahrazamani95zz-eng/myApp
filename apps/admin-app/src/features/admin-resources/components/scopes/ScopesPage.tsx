"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import {
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
  useCreateScopeMutation,
  useDeleteScopeMutation,
  useGetScopesQuery,
  useUpdateScopeMutation,
  type ScopeDto,
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

export function ScopesPage() {
  const { hasPermission } = usePermissions();
  const [page, setPage] = useState(1),
    [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false),
    [editTarget, setEditTarget] = useState<ScopeDto | null>(null),
    [deleteTarget, setDeleteTarget] = useState<ScopeDto | null>(null),
    [name, setName] = useState(""),
    [displayName, setDisplayName] = useState(""),
    [description, setDescription] = useState(""),
    [resources, setResources] = useState("");
  const q = useGetScopesQuery({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });
  const [createScope, state] = useCreateScopeMutation();
  const [deleteScope] = useDeleteScopeMutation();
  const [updateScope, updateState] = useUpdateScopeMutation();
  function close() {
    if (state.isLoading || updateState.isLoading) return;
    setDialogOpen(false);
    setEditTarget(null);
    setName("");
    setDisplayName("");
    setDescription("");
    setResources("");
  }
  async function create() {
    if (!name.trim()) return;
    try {
      await createScope({
        name: name.trim(),
        displayName: displayName.trim() || undefined,
        description: description.trim() || undefined,
        resources: resources
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      }).unwrap();
      close();
    } catch (e) {
      toast.error({
        title: "خطا در  ایجاد اسکوپ ",
        description: getApiErrorMessage(e, " ایجاد اسکوپ  ناموفق بود."),
      });
    }
  }
  function openEdit(scope: ScopeDto) {
    setEditTarget(scope);
    setName(scope.name);
    setDisplayName(scope.displayName ?? "");
    setDescription(scope.description ?? "");
    setResources(scope.resources.join(", "));
    setDialogOpen(true);
  }

  async function update() {
    if (!editTarget || !name.trim()) return;
    try {
      await updateScope({
        id: editTarget.id,
        name: name.trim(),
        displayName: displayName.trim() || undefined,
        description: description.trim() || undefined,
        resources: resources
          .split(",")
          .map((x) => x.trim())
          .filter(Boolean),
      }).unwrap();
      close();
    } catch (e) {
      toast.error({
        title: "خطا در  ویرایش اسکوپ ",
        description: getApiErrorMessage(e, " ویرایش اسکوپ  ناموفق بود."),
      });
    }
  }

  const scopeColumns = useMemo<DataTableColumn<ScopeDto>[]>(
    () => [
      {
        id: "name",
        accessorKey: "name",
        header: "نام",
        cell: ({ row }) => (
          <span dir="ltr" className="font-mono">
            {row.original.name}
          </span>
        ),
      },
      {
        id: "displayName",
        accessorKey: "displayName",
        header: "عنوان",
        cell: ({ row }) => row.original.displayName ?? "—",
      },
      {
        id: "description",
        accessorKey: "description",
        header: "توضیح",
        cell: ({ row }) => row.original.description ?? "—",
      },
      {
        id: "resources",
        header: "منابع",
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1">
            {row.original.resources.map((resource) => (
              <Badge key={resource} variant="outline">
                {resource}
              </Badge>
            ))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "عملیات",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            {hasPermission("scopes.update") ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => openEdit(row.original)}
              >
                <Pencil size={14} />
              </Button>
            ) : null}
            {hasPermission("scopes.delete") ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setDeleteTarget(row.original)}
              >
                <Trash2 size={14} />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [hasPermission],
  );
  return (
    <section className="space-y-5">
      <PageTitle
        title="اسکوپ‌ها"
        description="مدیریت Scopeهای OAuth و منابع مرتبط با آن‌ها."
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
          hasPermission("scopes.create") ? (
            <Button onClick={() => setDialogOpen(true)}>
              <Plus size={16} />
              ایجاد اسکوپ
            </Button>
          ) : null
        }
      />
      {q.isLoading ? (
        <LoadingBox />
      ) : q.isError ? (
        <ErrorBox
          message={getApiErrorMessage(q.error, "دریافت اسکوپ‌ها ناموفق بود.")}
          retry={() => void q.refetch()}
        />
      ) : (
        <ServerTable
          columns={scopeColumns}
          data={q.data?.items ?? []}
          page={page}
          totalRows={q.data?.totalCount ?? 0}
          onPageChange={setPage}
          loading={false}
          emptyMessage="اسکوپی برای نمایش وجود ندارد."
        />
      )}
      {hasPermission("scopes.delete") ? (
        <AdminConfirmDialog
          open={deleteTarget !== null}
          title="حذف اسکوپ"
          description={
            deleteTarget ? `اسکوپ «${deleteTarget.name}» حذف می‌شود.` : ""
          }
          onOpenChange={(open) => !open && setDeleteTarget(null)}
          loading={false}
          variant="danger"
          confirmLabel="حذف"
          onConfirm={async () => {
            if (!deleteTarget) return;
            try {
              await deleteScope(deleteTarget.id).unwrap();
              setDeleteTarget(null);
            } catch (e) {
              toast.error({
                title: "خطا در  حذف اسکوپ ",
                description: getApiErrorMessage(e, " حذف اسکوپ  ناموفق بود."),
              });
            }
          }}
        />
      ) : null}
      {hasPermission("scopes.create") || hasPermission("scopes.update") ? (
        <Dialog open={dialogOpen} onOpenChange={(open) => !open && close()}>
          <DialogContent size="md">
            <DialogHeader>
              <DialogTitle>
                {editTarget ? "ویرایش اسکوپ" : "ایجاد اسکوپ"}
              </DialogTitle>
              <DialogDescription>
                اطلاعات Scope و منابع مرتبط را وارد کنید.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="نام"
                autoFocus
              />
              <Input
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="عنوان نمایشی"
              />
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="توضیح"
              />
              <Input
                value={resources}
                onChange={(e) => setResources(e.target.value)}
                placeholder="resources با کاما"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={close}>
                انصراف
              </Button>
              <Button
                onClick={() => void (editTarget ? update() : create())}
                disabled={
                  !name.trim() || state.isLoading || updateState.isLoading
                }
              >
                {editTarget
                  ? updateState.isLoading
                    ? "در حال ذخیره…"
                    : "ذخیره تغییرات"
                  : state.isLoading
                    ? "در حال ایجاد…"
                    : "ایجاد اسکوپ"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </section>
  );
}
