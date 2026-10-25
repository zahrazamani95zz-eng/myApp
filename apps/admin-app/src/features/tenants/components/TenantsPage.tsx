"use client";
import { useMemo, useState } from "react";
import type { SortingState } from "@tanstack/react-table";
import { Eye, Plus, RefreshCw } from "lucide-react";
import {
  Badge,
  Button,
  DataTable,
  type DataTableColumn,
} from "@super-app/shared/ui";
import { useGetTenantsQuery, type Tenant } from "../../../store/api/tenantsApi";
import { TenantDetailsDialog, TenantFormDialog } from "./TenantDialogs";
import { AdminSearchBar } from "../../../components/admin/AdminSearchBar";
import { usePermissions } from "../../../components/admin/permissions";
export function TenantsPage() {
  const { hasPermission } = usePermissions();
  const [pageIndex, setPageIndex] = useState(0),
    [pageSize, setPageSize] = useState(20),
    [search, setSearch] = useState(""),
    [sorting, setSorting] = useState<SortingState>([
      { id: "name", desc: false },
    ]),
    [formOpen, setFormOpen] = useState(false),
    [details, setDetails] = useState<Tenant | null>(null),
    [editId, setEditId] = useState<string | null>(null);
  const s = sorting[0];
  const q = useGetTenantsQuery({
    page: pageIndex + 1,
    pageSize,
    search: search || undefined,
    sortBy: s?.id,
    sortDir: s?.desc ? "desc" : "asc",
  });
  const cols = useMemo<DataTableColumn<Tenant>[]>(
    () => [
      {
        accessorKey: "name",
        header: "نام سازمان",
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="font-medium">{row.original.name}</div>
            <div dir="ltr" className="text-xs text-text-muted">
              {row.original.slug}
            </div>
          </div>
        ),
      },
      {
        id: "status",
        header: "وضعیت",
        cell: ({ row }) => (
          <Badge variant={row.original.isActive ? "success" : "outline"}>
            {row.original.isActive ? "فعال" : "غیرفعال"}
          </Badge>
        ),
      },
      {
        accessorKey: "createdAtUtc",
        id: "created",
        header: "تاریخ ایجاد",
        cell: ({ row }) =>
          new Intl.DateTimeFormat("fa-IR", { dateStyle: "medium" }).format(
            new Date(row.original.createdAtUtc),
          ),
      },
      {
        id: "actions",
        header: "عملیات",
        cell: ({ row }) => (
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDetails(row.original)}
            >
              <Eye size={16} />
            </Button>
            {hasPermission("tenants.update") ? (
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
          </div>
        ),
      },
    ],
    [hasPermission],
  );
  const forbidden = q.isError && "status" in q.error && q.error.status === 403;
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold">سازمان‌ها</h2>
        <p className="text-sm text-text-secondary">
          مدیریت سازمان‌های multi-tenant
        </p>
      </div>
      {forbidden ? (
        <div className="rounded-xl border border-border bg-card p-8 text-center text-danger">
          دسترسی مشاهده سازمان‌ها را ندارید.
        </div>
      ) : (
        <>
          <AdminSearchBar
            value={search}
            onApply={(value) => {
              setPageIndex(0);
              setSearch(value);
            }}
            placeholder="نام یا slug..."
          />
          <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 text-sm text-text-secondary">
              <span>تعداد کل:</span>
              <strong className="text-text">
                {(q.data?.totalCount ?? 0).toLocaleString("fa-IR")}
              </strong>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {hasPermission("tenants.create") ? (
                <Button
                  onClick={() => {
                    setEditId(null);
                    setFormOpen(true);
                  }}
                >
                  <Plus size={17} /> افزودن سازمان
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
            emptyMessage="سازمانی پیدا نشد."
          />
        </>
      )}
      {hasPermission("tenants.create") || hasPermission("tenants.update") ? (
        <TenantFormDialog
          open={formOpen}
          onOpenChange={(v) => {
            setFormOpen(v);
            if (!v) setEditId(null);
          }}
          tenantId={editId}
        />
      ) : null}
      <TenantDetailsDialog
        tenant={details}
        onOpenChange={(v) => !v && setDetails(null)}
      />
    </section>
  );
}
