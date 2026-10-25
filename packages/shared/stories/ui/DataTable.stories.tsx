import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import type { PaginationState } from "@tanstack/react-table";

import { Badge } from "../../src/ui/badge";
import { Button } from "../../src/ui/button";
import { DataTable, type DataTableColumn } from "../../src/ui/data-table";

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: "مدیر" | "کاربر" | "مهمان";
  status: "active" | "inactive";
}

const roles: UserRow["role"][] = ["مدیر", "کاربر", "مهمان"];

const rows: UserRow[] = Array.from({ length: 47 }, (_, index) => ({
  id: index + 1,
  name: `کاربر نمونه ${index + 1}`,
  email: `user${index + 1}@example.com`,
  role: roles[index % roles.length],
  status: index % 4 === 0 ? "inactive" : "active",
}));

const columns: DataTableColumn<UserRow>[] = [
  { accessorKey: "id", header: "#", meta: { align: "center" } },
  { accessorKey: "name", header: "نام" },
  {
    accessorKey: "email",
    header: "ایمیل",
    meta: { className: "font-mono text-xs" },
  },
  { accessorKey: "role", header: "نقش" },
  {
    accessorKey: "status",
    header: "وضعیت",
    cell: ({ row }) => (
      <Badge variant={row.original.status === "active" ? "success" : "outline"}>
        {row.original.status === "active" ? "فعال" : "غیرفعال"}
      </Badge>
    ),
  },
];

const meta = {
  title: "UI/Data Display/DataTable",
  component: DataTable<UserRow>,
  parameters: { layout: "padded" },
  args: {
    columns,
    data: rows,
    getRowId: (row: UserRow) => String(row.id),
    pagination: true,
    pageSize: 10,
    search: true,
    searchPlaceholder: "جستجو در کاربران...",
    getSearchText: (row: UserRow) => `${row.name} ${row.email} ${row.role}`,
  },
} satisfies Meta<typeof DataTable<UserRow>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Loading: Story = {
  args: { loading: true },
};

export const Empty: Story = {
  args: { data: [], emptyMessage: "کاربری یافت نشد." },
};

export const WithToolbar: Story = {
  args: {
    toolbar: <Button size="sm">افزودن کاربر</Button>,
  },
};

export const RowSelection: Story = {
  args: { enableRowSelection: true },
};

export const ColumnFilters: Story = {
  args: {
    enableColumnFilters: true,
    columns: columns.map((column) =>
      "accessorKey" in column && column.accessorKey === "name"
        ? {
            ...column,
            meta: { filterable: true, filterPlaceholder: "فیلتر نام..." },
          }
        : column,
    ),
  },
};

export const ExpandableRows: Story = {
  args: {
    enableExpanding: true,
    renderExpandedRow: (row: UserRow) => (
      <div className="p-4 text-sm text-text-secondary">
        جزئیات {row.name} — {row.email}
      </div>
    ),
  },
};

function ServerSidePagination() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const start = pagination.pageIndex * pagination.pageSize;
  const pageRows = rows.slice(start, start + pagination.pageSize);

  return (
    <DataTable
      columns={columns}
      data={pageRows}
      pagination
      manualPagination
      pageIndex={pagination.pageIndex}
      pageSize={pagination.pageSize}
      pageCount={Math.max(1, Math.ceil(rows.length / pagination.pageSize))}
      totalRows={rows.length}
      onPaginationChange={setPagination}
    />
  );
}

/** الگوی پیشنهادی README برای دادهٔ API-backed (manualPagination). */
export const ServerSide: Story = {
  render: () => <ServerSidePagination />,
};
