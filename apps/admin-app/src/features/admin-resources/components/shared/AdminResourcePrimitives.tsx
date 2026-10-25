"use client";

import { RefreshCw } from "lucide-react";
import {
  Button,
  DataTable,
  Spinner,
  type DataTableColumn,
} from "@super-app/shared/ui";
import type { ReactNode } from "react";
import { AdminSearchBar } from "../../../../components/admin/AdminSearchBar";

export const PAGE_SIZE = 10;

export function PageTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-xl font-bold tracking-tight">{title}</h2>
      <p className="mt-1 text-sm text-text-secondary">{description}</p>
    </div>
  );
}

export function ErrorBox({
  message,
  retry,
}: {
  message: string;
  retry: () => void;
}) {
  return (
    <div className="rounded-2xl border border-danger/20 bg-danger/5 p-8 text-center">
      <p className="text-sm text-danger">{message}</p>
      <Button className="mt-4" variant="outline" onClick={retry}>
        <RefreshCw size={16} /> تلاش دوباره
      </Button>
    </div>
  );
}

export function LoadingBox() {
  return (
    <div className="flex min-h-48 items-center justify-center gap-2 text-text-secondary">
      <Spinner size="sm" /> در حال دریافت اطلاعات...
    </div>
  );
}

export function Toolbar({
  search,
  setSearch,
  action,
  total,
  onRefresh,
  refreshing = false,
}: {
  search: string;
  setSearch: (v: string) => void;
  action?: ReactNode;
  total?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
}) {
  return (
    <div className="space-y-3">
      <AdminSearchBar value={search} onApply={setSearch} />
      <AdminListActionBar
        total={total}
        onRefresh={onRefresh}
        refreshing={refreshing}
        action={action}
      />
    </div>
  );
}

export function AdminListActionBar({
  total = 0,
  onRefresh,
  refreshing = false,
  action,
}: {
  total?: number;
  onRefresh?: () => void;
  refreshing?: boolean;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3 text-sm text-text-secondary">
        <span>تعداد کل:</span>
        <strong className="text-text">{total.toLocaleString("fa-IR")}</strong>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {action}
        {onRefresh ? (
          <Button
            type="button"
            variant="ghost"
            onClick={onRefresh}
            disabled={refreshing}
          >
            <RefreshCw size={17} className={refreshing ? "animate-spin" : ""} />
            بروزرسانی
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export function ServerTable<T extends { id: string }>({
  columns,
  data,
  page,
  totalRows,
  onPageChange,
  loading,
  emptyMessage,
}: {
  columns: DataTableColumn<T>[];
  data: T[];
  page: number;
  totalRows: number;
  onPageChange: (page: number) => void;
  loading: boolean;
  emptyMessage: string;
}) {
  return (
    <DataTable
      columns={columns}
      data={data}
      getRowId={(row) => row.id}
      pagination
      manualPagination
      pageIndex={page - 1}
      pageSize={PAGE_SIZE}
      pageCount={Math.max(1, Math.ceil(totalRows / PAGE_SIZE))}
      totalRows={totalRows}
      onPaginationChange={({ pageIndex }) => onPageChange(pageIndex + 1)}
      loading={loading}
      emptyMessage={emptyMessage}
    />
  );
}
