"use client";

import { useMemo, useState } from "react";
import { Ban } from "lucide-react";
import {
  OverflowTooltip,
  Badge,
  Button,
  toast,
  type DataTableColumn,
} from "@super-app/shared/ui";
import {
  useGetAuthorizationsQuery,
  useGetTokensQuery,
  useRevokeAuthorizationMutation,
  useRevokeTokenMutation,
  type AuthorizationListItem,
  type TokenListItem,
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

export function AuthorizationsPage() {
  return <RevocablePage kind="authorization" />;
}

export function TokensPage() {
  return <RevocablePage kind="token" />;
}

type RevocableRow = AuthorizationListItem | TokenListItem;

export function RevocablePage({ kind }: { kind: "authorization" | "token" }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [revokeTarget, setRevokeTarget] = useState<RevocableRow | null>(null);
  const { hasPermission } = usePermissions();
  const revokePermission =
    kind === "authorization" ? "authorizations.revoke" : "tokens.revoke";

  const aq = useGetAuthorizationsQuery(
    { page, pageSize: PAGE_SIZE, search: search || undefined },
    { skip: kind !== "authorization" },
  );
  const tq = useGetTokensQuery(
    { page, pageSize: PAGE_SIZE, search: search || undefined },
    { skip: kind !== "token" },
  );

  const [revokeAuth] = useRevokeAuthorizationMutation();
  const [revokeToken] = useRevokeTokenMutation();

  const data = kind === "authorization" ? aq.data : tq.data;
  const revocableRows: RevocableRow[] = data?.items ?? [];

  const revocableColumns = useMemo<DataTableColumn<RevocableRow>[]>(
    () => [
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
        id: "subject",
        accessorKey: "subject",
        header: "کاربر",
        cell: ({ row }) => row.original.subject ?? "—",
      },
      {
        id: "clientId",
        accessorKey: "clientId",
        header: "کلاینت",
        meta: { className: "font-mono text-xs" },
        cell: ({ row }) => row.original.clientId ?? "—",
      },
      {
        id: "type",
        accessorKey: "type",
        header: "نوع",
        cell: ({ row }) => row.original.type ?? "—",
      },
      {
        id: "status",
        accessorKey: "status",
        header: "وضعیت",
        cell: ({ row }) => (
          <Badge variant="outline">{row.original.status ?? "—"}</Badge>
        ),
      },
      {
        id: "date",
        header: "زمان",
        cell: ({ row }) => {
          const value =
            kind === "authorization"
              ? (row.original as AuthorizationListItem).creationDate
              : ((row.original as TokenListItem).expirationDate ??
                (row.original as TokenListItem).creationDate);
          return value ? new Date(value).toLocaleString("fa-IR") : "—";
        },
      },
      {
        id: "actions",
        header: "عملیات",
        enableSorting: false,
        cell: ({ row }) =>
          hasPermission(revokePermission) ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => setRevokeTarget(row.original)}
            >
              <Ban size={14} /> لغو
            </Button>
          ) : null,
      },
    ],
    [hasPermission, kind, revokePermission],
  );

  const loading = kind === "authorization" ? aq.isLoading : tq.isLoading;
  const error = kind === "authorization" ? aq.error : tq.error;
  const retry = kind === "authorization" ? aq.refetch : tq.refetch;
  const title = kind === "authorization" ? "دسترسی‌های صادرشده" : "توکن‌ها";

  async function confirmRevoke() {
    if (!revokeTarget) return;

    try {
      if (kind === "authorization") {
        await revokeAuth(revokeTarget.id).unwrap();
      } else {
        await revokeToken(revokeTarget.id).unwrap();
      }
      setRevokeTarget(null);
    } catch (error) {
      toast.error({
        title: "خطا در لغو ",
        description: getApiErrorMessage(error, "لغو ناموفق بود."),
      });
    }
  }

  return (
    <section className="space-y-5">
      <PageTitle
        title={title}
        description={
          kind === "authorization"
            ? "مشاهده و لغو Authorizationهای صادرشده برای کاربران و کلاینت‌ها."
            : "مشاهده و لغو توکن‌های صادرشده."
        }
      />
      <Toolbar
        search={search}
        setSearch={(value) => {
          setSearch(value);
          setPage(1);
        }}
        total={data?.totalCount ?? 0}
        onRefresh={() => void retry()}
        refreshing={loading}
      />
      {loading ? (
        <LoadingBox />
      ) : error ? (
        <ErrorBox
          message={getApiErrorMessage(error, "دریافت اطلاعات ناموفق بود.")}
          retry={() => void retry()}
        />
      ) : (
        <ServerTable
          columns={revocableColumns}
          data={revocableRows}
          page={page}
          totalRows={data?.totalCount ?? 0}
          onPageChange={setPage}
          loading={false}
          emptyMessage="رکوردی برای نمایش وجود ندارد."
        />
      )}
      {hasPermission(revokePermission) ? (
        <AdminConfirmDialog
          open={revokeTarget !== null}
          title="لغو"
          description={
            kind === "authorization"
              ? "این Authorization لغو می‌شود."
              : "این Token لغو می‌شود."
          }
          onOpenChange={(open) => !open && setRevokeTarget(null)}
          loading={false}
          variant="danger"
          confirmLabel="لغو"
          onConfirm={confirmRevoke}
        />
      ) : null}
    </section>
  );
}
