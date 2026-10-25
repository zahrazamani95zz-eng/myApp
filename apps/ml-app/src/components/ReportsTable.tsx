"use client";

import { Badge, DataTable, type DataTableColumn } from "@super-app/shared/ui";
import { mlReports } from "../config/navigation";

export function ReportsTable() {
  const columns: DataTableColumn<(typeof mlReports)[number]>[] = [
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
          ML REPORTS
        </span>
        <h2 className="mt-1 text-lg font-semibold">گزارش‌های اخیر ML</h2>
        <p className="mt-1 text-sm text-text-secondary">
          وضعیت عملکرد، ارزیابی و مصرف سرویس‌های هوش مصنوعی
        </p>
      </div>
      <DataTable
        columns={columns}
        data={mlReports}
        getRowId={(row) => row.id}
        search
        getSearchText={(row) =>
          `${row.id} ${row.title} ${row.status} ${row.date} ${row.value}`
        }
        searchPlaceholder="جستجو در گزارش‌های ML..."
        pageSize={5}
        pageSizeOptions={[5, 10, 25]}
        emptyMessage="گزارشی پیدا نشد."
      />
    </section>
  );
}
