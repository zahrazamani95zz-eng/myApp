"use client";

import { Badge, DataTable, type DataTableColumn } from "@super-app/shared/ui";
import { reportRows, type AdminProduct } from "../../config/navigation";

type ReportRow = (typeof reportRows)[number];

export function ReportsTable({ product }: { product: AdminProduct }) {
  const rows = reportRows.filter((row) => row.product === product);

  const columns: DataTableColumn<ReportRow>[] = [
    {
      accessorKey: "id",
      header: "شناسه",
      enableSorting: true,
      meta: { className: "font-mono" },
    },
    {
      accessorKey: "title",
      header: "گزارش",
      enableSorting: true,
      meta: { className: "font-medium" },
    },
    {
      accessorKey: "status",
      header: "وضعیت",
      enableSorting: true,
      cell: ({ row }) => (
        <Badge
          variant={row.original.status === "تکمیل شده" ? "success" : "warning"}
        >
          {row.original.status}
        </Badge>
      ),
    },
    { accessorKey: "date", header: "تاریخ", enableSorting: true },
    {
      accessorKey: "value",
      header: "مقدار",
      enableSorting: true,
      meta: { align: "end", className: "font-semibold" },
    },
  ];

  return (
    <section className="rounded-[22px] border border-border/80 bg-card p-5 shadow-[0_8px_30px_rgba(18,43,35,0.055)]">
      <div className="mb-4">
        <span className="text-xs font-medium tracking-widest text-primary">
          REPORTS
        </span>
        <h2 className="mt-1 text-lg font-semibold">گزارش‌های اخیر</h2>
        <p className="mt-1 text-sm text-text-secondary">
          گزارش‌های ثبت‌شده در سامانه {product === "ml" ? "ML" : "تاک"}
        </p>
      </div>
      <DataTable
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        search
        getSearchText={(row) =>
          `${row.id} ${row.title} ${row.status} ${row.date} ${row.value}`
        }
        searchPlaceholder="جستجو در گزارش‌ها..."
        pageSize={5}
        pageSizeOptions={[5, 10, 25]}
        emptyMessage="گزارشی برای این سامانه پیدا نشد."
      />
    </section>
  );
}
