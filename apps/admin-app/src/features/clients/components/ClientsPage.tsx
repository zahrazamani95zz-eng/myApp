"use client";

import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { Eye, Plus, RefreshCw, Trash2, Power } from "lucide-react";
import {
  OverflowTooltip,
  Badge,
  Button,
  DataTable,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  toast,
  type DataTableColumn,
} from "@super-app/shared/ui";
import {
  useDeleteClientMutation,
  useGetClientsQuery,
  useRevokeClientMutation,
  useRotateClientSecretMutation,
  type OAuthClient,
} from "../../../store/api/clientsApi";
import { ClientForm } from "./ClientForm";
import { getApiErrorMessage } from "@/lib/api-error";
import { AdminConfirmDialog } from "../../../components/admin/AdminConfirmDialog";
import { AdminSearchBar } from "../../../components/admin/AdminSearchBar";
import { usePermissions } from "../../../components/admin/permissions";

export function ClientsPage() {
  const { hasPermission } = usePermissions();
  const [pageIndex, setPageIndex] = useState(0),
    [pageSize, setPageSize] = useState(20),
    [search, setSearch] = useState(""),
    [sorting, setSorting] = useState<SortingState>([
      { id: "clientId", desc: false },
    ]),
    [formOpen, setFormOpen] = useState(false),
    [editId, setEditId] = useState<string | null>(null),
    [detail, setDetail] = useState<OAuthClient | null>(null),
    [action, setAction] = useState<{
      kind: "delete" | "revoke" | "rotate";
      client: OAuthClient;
    } | null>(null),
    [secret, setSecret] = useState<string | null>(null);
  const s = sorting[0];
  const q = useGetClientsQuery({
    page: pageIndex + 1,
    pageSize,
    search: search || undefined,
    sortBy: s?.id,
    sortDir: s?.desc ? "desc" : "asc",
  });
  const [del, { isLoading: deleting }] = useDeleteClientMutation();
  const [revoke, { isLoading: revoking }] = useRevokeClientMutation();
  const [rotate, { isLoading: rotating }] = useRotateClientSecretMutation();
  const cols = useMemo<DataTableColumn<OAuthClient>[]>(
    () => [
      {
        accessorKey: "clientId",
        header: "Client ID",
        enableSorting: true,
        cell: ({ row }) => (
          <OverflowTooltip
            content={row.original.clientId}
            className="max-w-52 font-medium"
            contentClassName="font-mono text-xs"
            dir="ltr"
          >
            {row.original.clientId}
          </OverflowTooltip>
        ),
      },
      {
        accessorKey: "displayName",
        header: "نام نمایشی",
        enableSorting: true,
        cell: ({ row }) => (
          <OverflowTooltip
            content={row.original.displayName ?? "—"}
            className="max-w-52"
          >
            {row.original.displayName ?? "—"}
          </OverflowTooltip>
        ),
      },
      {
        accessorKey: "clientType",
        header: "نوع",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.clientType ?? "—"}</Badge>
        ),
      },
      {
        accessorKey: "hasClientSecret",
        header: "Secret",
        cell: ({ row }) => (
          <Badge variant={row.original.hasClientSecret ? "success" : "outline"}>
            {row.original.hasClientSecret ? "دارد" : "ندارد"}
          </Badge>
        ),
      },
      {
        id: "actions",
        header: "عملیات",
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDetail(row.original)}
            >
              <Eye size={16} />
            </Button>
            {hasPermission("clients.update") ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditId(row.original.id);
                  setFormOpen(true);
                }}
              >
                ویرایش
              </Button>
            ) : null}
            {hasPermission("clients.secrets") ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAction({ kind: "rotate", client: row.original })
                }
                title="Rotate secret"
              >
                <RefreshCw size={16} />
              </Button>
            ) : null}
            {hasPermission("clients.revoke") ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAction({ kind: "revoke", client: row.original })
                }
                title="Revoke"
              >
                <Power size={16} />
              </Button>
            ) : null}
            {hasPermission("clients.delete") ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setAction({ kind: "delete", client: row.original })
                }
                title="حذف"
              >
                <Trash2 size={16} />
              </Button>
            ) : null}
          </div>
        ),
      },
    ],
    [hasPermission],
  );
  async function confirm() {
    if (!action) return;
    try {
      if (action.kind === "delete") await del(action.client.id).unwrap();
      if (action.kind === "revoke") await revoke(action.client.id).unwrap();
      if (action.kind === "rotate") {
        const r = await rotate(action.client.id).unwrap();
        setSecret(r.clientSecret);
      }
      setAction(null);
      toast.success({
        title:
          action.kind === "delete"
            ? "کلاینت حذف شد"
            : action.kind === "revoke"
              ? "نشست‌ها لغو شد"
              : "Secret چرخانده شد",
      });
    } catch (e) {
      toast.error({
        title: "خطا",
        description: getApiErrorMessage(e, "عملیات انجام نشد."),
      });
    }
  }
  const forbidden = q.isError && "status" in q.error && q.error.status === 403;
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">کلاینت‌های OAuth</h2>
        <p className="text-sm text-text-secondary">
          مدیریت OpenIddict clients، secret و نشست‌ها
        </p>
      </div>
      {forbidden ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-danger">
          دسترسی مشاهده کلاینت‌ها را ندارید.
        </div>
      ) : (
        <>
          <AdminSearchBar
            value={search}
            onApply={(value) => {
              setPageIndex(0);
              setSearch(value);
            }}
            placeholder="Client ID یا نام..."
          />
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>تعداد کل:</span>
              <strong className="text-text">
                {(q.data?.totalCount ?? 0).toLocaleString("fa-IR")}
              </strong>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasPermission("clients.create") ? (
                <Button
                  onClick={() => {
                    setEditId(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus size={17} /> افزودن کلاینت
                </Button>
              ) : null}
              <Button
                variant="ghost"
                onClick={() => void q.refetch()}
                disabled={q.isFetching}
              >
                <RefreshCw
                  size={17}
                  className={q.isFetching ? "animate-spin" : ""}
                />
                بروزرسانی
              </Button>
            </div>
          </div>
          <DataTable
            columns={cols}
            data={q.data?.items ?? []}
            getRowId={(r) => r.id}
            loading={q.isLoading}
            manualPagination
            pageIndex={pageIndex}
            pageSize={pageSize}
            pageCount={q.data ? Math.ceil(q.data.totalCount / pageSize) : 0}
            totalRows={q.data?.totalCount ?? 0}
            onPaginationChange={({ pageIndex: pi, pageSize: ps }) => {
              setPageIndex(pi);
              setPageSize(ps);
            }}
            manualSorting
            sorting={sorting}
            onSortingChange={setSorting}
            emptyMessage="کلاینتی پیدا نشد."
          />
        </>
      )}
      {hasPermission("clients.create") || hasPermission("clients.update") ? (
        <ClientForm open={formOpen} onOpenChange={setFormOpen} id={editId} />
      ) : null}
      <Dialog open={!!detail} onOpenChange={(v) => !v && setDetail(null)}>
        <DialogContent size="lg">
          <DialogHeader>
            <DialogTitle>جزئیات کلاینت</DialogTitle>
          </DialogHeader>
          {detail ? (
            <div className="space-y-3 text-sm">
              {[
                ...["Client ID", detail.clientId],
                ["Display name", detail.displayName ?? "—"],
                ["Client type", detail.clientType ?? "—"],
                ["Consent type", detail.consentType ?? "—"],
                ["Secret", detail.hasClientSecret ? "ثبت شده" : "ثبت نشده"],
              ].map(([l, v]) => (
                <div
                  key={l}
                  className="flex justify-between gap-4 border-b border-border/60 py-2"
                >
                  <span className="text-text-muted">{l}</span>
                  <span dir={l === "Client ID" ? "ltr" : undefined}>{v}</span>
                </div>
              ))}
              <ArrayBlock title="Redirect URIs" values={detail.redirectUris} />
              <ArrayBlock
                title="Post logout redirect URIs"
                values={detail.postLogoutRedirectUris}
              />
              <ArrayBlock title="Permissions" values={detail.permissions} />
              <ArrayBlock title="Requirements" values={detail.requirements} />
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
      <AdminConfirmDialog
        open={!!action}
        onOpenChange={(v) => !v && setAction(null)}
        title={
          action?.kind === "delete"
            ? "حذف کلاینت"
            : action?.kind === "revoke"
              ? "لغو نشست‌های کلاینت"
              : "چرخش Secret"
        }
        description={
          action?.kind === "delete"
            ? "کلاینت حذف می‌شود و authorization/tokenهای مرتبط نیز لغو می‌شوند."
            : action?.kind === "revoke"
              ? "تمام authorizationها و tokenهای این client لغو می‌شوند؛ خود application حذف نمی‌شود."
              : "Secret قبلی باطل می‌شود و secret جدید فقط یک‌بار نمایش داده خواهد شد."
        }
        onConfirm={() => void confirm()}
        loading={deleting || revoking || rotating}
        variant={action?.kind === "delete" ? "danger" : "warning"}
      />
      <Dialog open={!!secret} onOpenChange={(v) => !v && setSecret(null)}>
        <DialogContent size="md">
          <DialogHeader>
            <DialogTitle>Secret جدید</DialogTitle>
            <DialogDescription>
              این secret فقط همین یک بار نمایش داده شده است؛ آن را امن ذخیره
              کنید.
            </DialogDescription>
          </DialogHeader>
          <div
            className="rounded-xl border border-border bg-surface p-4 font-mono text-sm break-all"
            dir="ltr"
          >
            {secret}
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                if (secret) void navigator.clipboard?.writeText(secret);
                setSecret(null);
              }}
            >
              کپی و بستن
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
function ArrayBlock({ title, values }: { title: string; values?: string[] }) {
  return (
    <div>
      <div className="mb-1 font-medium">{title}</div>
      <div className="rounded-xl border border-border bg-surface p-3" dir="ltr">
        {values?.length ? (
          values.map((v) => (
            <div key={v} className="py-1 text-xs">
              {v}
            </div>
          ))
        ) : (
          <span className="text-text-muted">—</span>
        )}
      </div>
    </div>
  );
}
