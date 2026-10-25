"use client";

import { useMemo, useState } from "react";
import {
  Badge,
  Button,
  OverflowTooltip,
  type DataTableColumn,
} from "@super-app/shared/ui";
import {
  useGetAuditLogsQuery,
  type AuditLogListItem,
} from "../../../../store/api/adminResourcesApi";
import { getApiErrorMessage } from "@/lib/api-error";
import {
  PAGE_SIZE,
  PageTitle,
  ServerTable,
  LoadingBox,
  ErrorBox,
} from "../shared/AdminResourcePrimitives";
import { AdminSearchBar } from "../../../../components/admin/AdminSearchBar";

const EVENT_TYPES = [
  "Registration",
  "LoginSucceeded",
  "LoginFailed",
  "Logout",
  "UserCreated",
  "UserUpdated",
  "UserLocked",
  "UserUnlocked",
  "UserRolesUpdated",
  "RoleCreated",
  "RoleUpdated",
  "RoleDeleted",
  "ClientCreated",
  "ClientUpdated",
  "ClientDeleted",
  "ClientSecretRotated",
  "ClientRevoked",
  "ScopeCreated",
  "ScopeUpdated",
  "ScopeDeleted",
  "AuthorizationRevoked",
  "TokenRevoked",
  "TenantCreated",
  "TenantUpdated",
];

export function AuditLogsPage() {
  const [page, setPage] = useState(1),
    [search, setSearch] = useState(""),
    [eventType, setEventType] = useState("");
  const q = useGetAuditLogsQuery({
    page,
    pageSize: PAGE_SIZE,
    search: search || undefined,
    eventType: eventType || undefined,
  });
  const auditColumns = useMemo<DataTableColumn<AuditLogListItem>[]>(
    () => [
      {
        id: "eventType",
        accessorKey: "eventType",
        header: "رویداد",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.eventType}</Badge>
        ),
      },
      {
        id: "user",
        header: "کاربر",
        cell: ({ row }) =>
          row.original.normalizedEmail ?? row.original.userId ?? "—",
      },
      {
        id: "clientId",
        accessorKey: "clientId",
        header: "کلاینت",
        cell: ({ row }) => row.original.clientId ?? "—",
      },
      {
        id: "occurredAtUtc",
        accessorKey: "occurredAtUtc",
        header: "زمان",
        cell: ({ row }) =>
          new Date(row.original.occurredAtUtc).toLocaleString("fa-IR"),
      },
      {
        id: "details",
        accessorKey: "details",
        header: "جزئیات",
        cell: ({ row }) => (
          <OverflowTooltip
            content={row.original.details ?? "—"}
            className="block max-w-sm"
            contentClassName="max-w-[min(42rem,calc(100vw-2rem))]"
            dir="auto"
          >
            {row.original.details ?? "—"}
          </OverflowTooltip>
        ),
      },
    ],
    [],
  );
  return (
    <section className="space-y-5">
      <PageTitle
        title="گزارش‌های امنیتی"
        description="ردیابی رویدادهای امنیتی و عملیاتی سامانه."
      />
      <div className="space-y-3">
        <AdminSearchBar
          value={search}
          onApply={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3 text-sm text-text-secondary">
            <span>تعداد کل:</span>
            <strong className="text-text">
              {(q.data?.totalCount ?? 0).toLocaleString("fa-IR")}
            </strong>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={eventType}
              onChange={(e) => {
                setEventType(e.target.value);
                setPage(1);
              }}
              className="h-10 rounded-xl border border-border bg-surface px-3 text-sm outline-none transition focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
            >
              <option value="">همه رویدادها</option>
              {EVENT_TYPES.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              onClick={() => void q.refetch()}
              disabled={q.isFetching}
              className="inline-flex h-10 items-center gap-2 rounded-xl px-3 text-sm font-medium text-text-secondary transition hover:bg-surface hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
            >
              بروزرسانی
            </Button>
          </div>
        </div>
      </div>
      {q.isLoading ? (
        <LoadingBox />
      ) : q.isError ? (
        <ErrorBox
          message={getApiErrorMessage(q.error, "دریافت گزارش‌ها ناموفق بود.")}
          retry={() => void q.refetch()}
        />
      ) : (
        <ServerTable
          columns={auditColumns}
          data={q.data?.items ?? []}
          page={page}
          totalRows={q.data?.totalCount ?? 0}
          onPageChange={setPage}
          loading={false}
          emptyMessage="گزارشی برای نمایش وجود ندارد."
        />
      )}
    </section>
  );
}
