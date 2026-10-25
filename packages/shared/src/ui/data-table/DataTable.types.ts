import type { ReactNode } from "react";
import type {
  ColumnDef,
  ColumnFiltersState,
  OnChangeFn,
  PaginationState,
  // RowData,
  RowSelectionState,
  SortingState,
  Table,
} from "@tanstack/react-table";

import "@tanstack/react-table";

export type DataTableAlign = "start" | "center" | "end";
export type DataTableRowSelectionState = RowSelectionState;

export interface DataTableColumnMeta {
  align?: DataTableAlign;
  className?: string;
  /** Enables the column filter control when column filtering is enabled. */
  filterable?: boolean;
  filterPlaceholder?: string;
}

declare module "@tanstack/react-table" {
  // interface ColumnMeta<
  //   TData extends RowData,
  //   TValue,
  // > extends DataTableColumnMeta {}
}

export type DataTableColumn<T> = ColumnDef<T, unknown>;

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  getRowId?: (row: T, index: number) => string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  search?: boolean;
  getSearchText?: (row: T) => string;
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  loading?: boolean;
  toolbar?: ReactNode;
  className?: string;
  initialSorting?: SortingState;
  initialColumnOrder?: string[];
  manualPagination?: boolean;
  pageIndex?: number;
  pageCount?: number;
  totalRows?: number;
  /** Preferred controlled pagination API. */
  onPaginationChange?: (pagination: PaginationState) => void;
  /** Backward-compatible pagination callbacks. */
  onPageChange?: (pageIndex: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  manualSorting?: boolean;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  enableColumnFilters?: boolean;
  manualFiltering?: boolean;
  columnFilters?: ColumnFiltersState;
  onColumnFiltersChange?: OnChangeFn<ColumnFiltersState>;
  enableColumnReordering?: boolean;
  onColumnOrderChange?: (columnOrder: string[]) => void;
  enableExpanding?: boolean;
  expanded?: Record<string, boolean>;
  onExpandedChange?: (expanded: Record<string, boolean>) => void;
  /** Render any React content below the parent row. It can itself be another DataTable. */
  renderExpandedRow?: (row: T) => ReactNode;
  getRowCanExpand?: (row: T) => boolean;
  enableRowSelection?: boolean;
  rowSelection?: RowSelectionState;
  onRowSelectionChange?: (selection: RowSelectionState) => void;
}

export type DataTableInstance<T> = Table<T>;
