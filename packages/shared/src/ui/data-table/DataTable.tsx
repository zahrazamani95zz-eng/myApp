"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  useReactTable,
  type ColumnFiltersState,
  type ExpandedState,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
} from "@tanstack/react-table";
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ChevronRight,
  GripVertical,
  Search,
} from "lucide-react";

import { cn } from "../../lib";
import type { DataTableAlign, DataTableProps } from "./DataTable.types";

function getColumnId<T>(column: DataTableProps<T>["columns"][number]): string {
  if (column.id) return String(column.id);
  if ("accessorKey" in column && column.accessorKey)
    return String(column.accessorKey);
  return "";
}

function alignClass(align: DataTableAlign | undefined): string {
  if (align === "center") return "text-center";
  if (align === "end") return "text-left";
  return "text-right";
}

export function DataTable<T>({
  columns,
  data,
  getRowId,
  emptyMessage = "رکوردی برای نمایش وجود ندارد.",
  searchPlaceholder = "جستجو...",
  search = false,
  getSearchText,
  pagination = true,
  pageSize = 10,
  pageSizeOptions = [10, 25, 50],
  loading = false,
  toolbar,
  className,
  initialSorting = [],
  initialColumnOrder,
  manualPagination = false,
  pageIndex = 0,
  pageCount,
  totalRows,
  onPaginationChange,
  onPageChange,
  onPageSizeChange,
  manualSorting = false,
  sorting: controlledSorting,
  onSortingChange,
  enableColumnFilters = false,
  manualFiltering = false,
  columnFilters: controlledColumnFilters,
  onColumnFiltersChange,
  enableColumnReordering = false,
  onColumnOrderChange,
  enableExpanding = false,
  expanded: controlledExpanded,
  onExpandedChange,
  renderExpandedRow,
  getRowCanExpand,
  enableRowSelection = false,
  rowSelection,
  onRowSelectionChange,
}: DataTableProps<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  const [internalSorting, setInternalSorting] =
    useState<SortingState>(initialSorting);
  const [internalPagination, setInternalPagination] = useState<PaginationState>(
    {
      pageIndex,
      pageSize,
    },
  );
  const [internalColumnFilters, setInternalColumnFilters] =
    useState<ColumnFiltersState>([]);
  const [internalExpanded, setInternalExpanded] = useState<ExpandedState>({});
  const [draggedColumnId, setDraggedColumnId] = useState<string | null>(null);
  const [internalColumnOrder, setInternalColumnOrder] = useState<string[]>(
    () =>
      initialColumnOrder?.length
        ? initialColumnOrder
        : columns.map(getColumnId).filter(Boolean),
  );

  useEffect(() => {
    const currentIds = columns.map(getColumnId).filter(Boolean);
    setInternalColumnOrder((current) => {
      const validCurrent = current.filter((id) => currentIds.includes(id));
      const missing = currentIds.filter((id) => !validCurrent.includes(id));
      const next = [...validCurrent, ...missing];
      return next.join("|") === current.join("|") ? current : next;
    });
  }, [columns]);

  const paginationState = manualPagination
    ? { pageIndex, pageSize }
    : internalPagination;
  const sorting = manualSorting
    ? (controlledSorting ?? initialSorting)
    : internalSorting;
  const columnFilters = manualFiltering
    ? (controlledColumnFilters ?? [])
    : internalColumnFilters;
  const expanded = controlledExpanded ?? internalExpanded;
  const columnOrder = internalColumnOrder;

  const handlePaginationChange = (
    updater: PaginationState | ((old: PaginationState) => PaginationState),
  ) => {
    const current = paginationState;
    const next = typeof updater === "function" ? updater(current) : updater;

    if (
      next.pageIndex === current.pageIndex &&
      next.pageSize === current.pageSize
    )
      return;

    if (manualPagination) {
      onPaginationChange?.(next);
      onPageChange?.(next.pageIndex);
      onPageSizeChange?.(next.pageSize);
    } else {
      setInternalPagination(next);
      onPageChange?.(next.pageIndex);
      onPageSizeChange?.(next.pageSize);
    }
  };

  const handleSortingChange = (
    updater: SortingState | ((old: SortingState) => SortingState),
  ) => {
    const current = sorting;
    const next = typeof updater === "function" ? updater(current) : updater;
    if (manualSorting) onSortingChange?.(next);
    else setInternalSorting(next);
  };

  const handleColumnFiltersChange = (
    updater:
      | ColumnFiltersState
      | ((old: ColumnFiltersState) => ColumnFiltersState),
  ) => {
    const current = columnFilters;
    const next = typeof updater === "function" ? updater(current) : updater;
    if (manualFiltering) onColumnFiltersChange?.(next);
    else setInternalColumnFilters(next);
  };

  const handleExpandedChange = (
    updater: ExpandedState | ((old: ExpandedState) => ExpandedState),
  ) => {
    const current = expanded;
    const next = typeof updater === "function" ? updater(current) : updater;

    if (controlledExpanded !== undefined) {
      // DataTable's public API uses a row-id map. TanStack also allows the
      // special `true` value to mean "all rows expanded"; keep that value
      // internal and expose only the map through our callback.
      if (next === true) {
        const allExpanded = data.reduce<Record<string, boolean>>(
          (result, row, index) => {
            const id = getRowId ? getRowId(row, index) : String(index);
            result[id] = true;
            return result;
          },
          {},
        );
        onExpandedChange?.(allExpanded);
      } else {
        onExpandedChange?.(next);
      }
    } else {
      setInternalExpanded(next);
      if (next === true) {
        const allExpanded = data.reduce<Record<string, boolean>>(
          (result, row, index) => {
            const id = getRowId ? getRowId(row, index) : String(index);
            result[id] = true;
            return result;
          },
          {},
        );
        onExpandedChange?.(allExpanded);
      } else {
        onExpandedChange?.(next);
      }
    }
  };

  const searchableData = useMemo(() => data, [data]);

  const table = useReactTable({
    data: searchableData,
    columns,
    state: {
      globalFilter,
      sorting,
      pagination: paginationState,
      columnFilters,
      columnOrder,
      expanded,
      ...(enableRowSelection ? { rowSelection: rowSelection ?? {} } : {}),
    },
    onGlobalFilterChange: (value) => {
      setGlobalFilter(value ?? "");
      handlePaginationChange({ ...paginationState, pageIndex: 0 });
    },
    onSortingChange: handleSortingChange,
    onColumnFiltersChange: handleColumnFiltersChange,
    onPaginationChange: handlePaginationChange,
    onColumnOrderChange: (updater) => {
      const next =
        typeof updater === "function" ? updater(columnOrder) : updater;
      setInternalColumnOrder(next);
      onColumnOrderChange?.(next);
    },
    onExpandedChange: handleExpandedChange,
    ...(enableRowSelection
      ? {
          onRowSelectionChange: (
            updater:
              | ((current: RowSelectionState) => RowSelectionState)
              | RowSelectionState,
          ) => {
            const current = rowSelection ?? {};
            const next =
              typeof updater === "function" ? updater(current) : updater;
            onRowSelectionChange?.(next);
          },
        }
      : {}),
    getRowId: getRowId ? (row, index) => getRowId(row, index) : undefined,
    globalFilterFn: getSearchText
      ? (_row, _columnId, filterValue) => {
          const row = _row.original;
          return getSearchText(row)
            .toLocaleLowerCase("fa")
            .includes(String(filterValue).trim().toLocaleLowerCase("fa"));
        }
      : "includesString",
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    ...(pagination && !manualPagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),
    manualPagination,
    manualSorting,
    manualFiltering,
    ...(manualPagination ? { pageCount: pageCount ?? -1 } : {}),
    enableRowSelection,
    enableExpanding: enableExpanding || Boolean(renderExpandedRow),
    getRowCanExpand: (row) =>
      getRowCanExpand
        ? getRowCanExpand(row.original)
        : Boolean(renderExpandedRow),
  });

  const rows = pagination
    ? table.getRowModel().rows
    : table.getSortedRowModel().rows;
  const localTotalRows = table.getFilteredRowModel().rows.length;
  const effectiveTotalRows = totalRows ?? localTotalRows;
  const effectivePageCount = Math.max(1, pageCount ?? table.getPageCount());
  const currentPage = paginationState.pageIndex + 1;

  function changeRowsPerPage(value: number) {
    handlePaginationChange({ pageIndex: 0, pageSize: value });
  }

  function handleColumnDrop(targetColumnId: string) {
    if (!draggedColumnId || draggedColumnId === targetColumnId) return;
    const next = [...columnOrder];
    const fromIndex = next.indexOf(draggedColumnId);
    const toIndex = next.indexOf(targetColumnId);
    if (fromIndex < 0 || toIndex < 0) return;
    next.splice(fromIndex, 1);
    next.splice(toIndex, 0, draggedColumnId);
    setInternalColumnOrder(next);
    onColumnOrderChange?.(next);
    setDraggedColumnId(null);
  }

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-card",
        className,
      )}
    >
      {(search || toolbar) && (
        <div className="flex flex-col gap-3 border-b border-border p-4 sm:flex-row sm:items-center sm:justify-between">
          {search ? (
            <label className="relative block w-full sm:max-w-sm">
              <Search className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                value={globalFilter}
                onChange={(event) => {
                  const value = event.target.value;
                  setGlobalFilter(value);
                  handlePaginationChange({ ...paginationState, pageIndex: 0 });
                }}
                placeholder={searchPlaceholder}
                className="h-10 w-full rounded-lg border border-border bg-surface pr-9 pl-3 text-sm text-text outline-none transition placeholder:text-text-muted focus:border-primary focus:ring-2 focus:ring-primary/10"
              />
            </label>
          ) : (
            <span />
          )}
          {toolbar}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead className="bg-background">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {enableExpanding || renderExpandedRow ? (
                  <th
                    className="w-12 border-b border-border px-3"
                    scope="col"
                    aria-label="باز کردن ردیف"
                  />
                ) : null}
                {enableRowSelection ? (
                  <th className="w-12 border-b border-border px-4" scope="col">
                    <input
                      type="checkbox"
                      aria-label="انتخاب همه"
                      checked={table.getIsAllPageRowsSelected()}
                      ref={(element) => {
                        if (element)
                          element.indeterminate =
                            table.getIsSomePageRowsSelected();
                      }}
                      onChange={table.getToggleAllPageRowsSelectedHandler()}
                      className="h-4 w-4 rounded border-border accent-primary"
                    />
                  </th>
                ) : null}
                {headerGroup.headers.map((header) => {
                  const meta = header.column.columnDef.meta;
                  const sorted = header.column.getIsSorted();
                  return (
                    <th
                      key={header.id}
                      scope="col"
                      draggable={
                        enableColumnReordering && !header.isPlaceholder
                      }
                      onDragStart={() => setDraggedColumnId(header.column.id)}
                      onDragOver={(event) => {
                        if (enableColumnReordering) event.preventDefault();
                      }}
                      onDrop={() => {
                        if (enableColumnReordering)
                          handleColumnDrop(header.column.id);
                      }}
                      className={cn(
                        "h-12 border-b border-border px-4 font-medium text-text-secondary",
                        alignClass(meta?.align),
                        meta?.className,
                        enableColumnReordering && "cursor-grab select-none",
                      )}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center gap-1.5">
                          {enableColumnReordering ? (
                            <GripVertical className="h-4 w-4 shrink-0 text-text-muted" />
                          ) : null}
                          <button
                            type="button"
                            disabled={!header.column.getCanSort()}
                            onClick={header.column.getToggleSortingHandler()}
                            className={cn(
                              "inline-flex items-center gap-1.5 font-medium",
                              header.column.getCanSort() &&
                                "transition hover:text-text",
                            )}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                            {header.column.getCanSort() &&
                              (sorted === "asc" ? (
                                <ChevronUp className="h-4 w-4" />
                              ) : sorted === "desc" ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronsUpDown className="h-4 w-4 opacity-50" />
                              ))}
                          </button>
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
            {enableColumnFilters && (
              <tr>
                {enableExpanding || renderExpandedRow ? (
                  <th className="border-b border-border px-3" />
                ) : null}
                {enableRowSelection ? (
                  <th className="border-b border-border px-4" />
                ) : null}
                {table.getVisibleLeafColumns().map((column) => {
                  const meta = column.columnDef.meta;
                  if (!meta?.filterable) {
                    return (
                      <th
                        key={column.id}
                        className="border-b border-border px-4 py-2"
                      />
                    );
                  }
                  return (
                    <th
                      key={column.id}
                      className="border-b border-border px-4 py-2"
                    >
                      <input
                        value={String(column.getFilterValue() ?? "")}
                        onChange={(event) =>
                          column.setFilterValue(event.target.value)
                        }
                        placeholder={meta.filterPlaceholder ?? "فیلتر..."}
                        className="h-9 w-full min-w-24 rounded-lg border border-border bg-surface px-2.5 text-xs text-text outline-none placeholder:text-text-muted focus:border-primary"
                      />
                    </th>
                  );
                })}
              </tr>
            )}
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: Math.min(paginationState.pageSize, 5) }).map(
                (_, index) => (
                  <tr
                    key={`loading-${index}`}
                    className="border-b border-border last:border-b-0"
                  >
                    {(enableExpanding || renderExpandedRow) && (
                      <td className="px-3 py-4" />
                    )}
                    {enableRowSelection && <td className="px-4 py-4" />}
                    {columns.map((column, columnIndex) => (
                      <td key={column.id ?? columnIndex} className="px-4 py-4">
                        <div className="h-4 animate-pulse rounded bg-background" />
                      </td>
                    ))}
                  </tr>
                ),
              )
            ) : rows.length ? (
              rows.map((row) => {
                const canExpand = row.getCanExpand();
                return (
                  <Fragment key={row.id}>
                    <tr className="border-b border-border transition hover:bg-background">
                      {enableExpanding || renderExpandedRow ? (
                        <td className="w-12 border-b border-border px-3">
                          {canExpand ? (
                            <button
                              type="button"
                              aria-label={
                                row.getIsExpanded()
                                  ? "بستن ردیف"
                                  : "باز کردن ردیف"
                              }
                              aria-expanded={row.getIsExpanded()}
                              onClick={row.getToggleExpandedHandler()}
                              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface hover:text-text"
                            >
                              <ChevronRight
                                className={cn(
                                  "h-4 w-4 transition-transform",
                                  row.getIsExpanded() && "rotate-90",
                                )}
                              />
                            </button>
                          ) : null}
                        </td>
                      ) : null}
                      {enableRowSelection ? (
                        <td className="w-12 border-b border-border px-4">
                          <input
                            type="checkbox"
                            aria-label={`انتخاب ${row.id}`}
                            checked={row.getIsSelected()}
                            disabled={!row.getCanSelect()}
                            onChange={row.getToggleSelectedHandler()}
                            className="h-4 w-4 rounded border-border accent-primary"
                          />
                        </td>
                      ) : null}
                      {row.getVisibleCells().map((cell) => {
                        const meta = cell.column.columnDef.meta;
                        return (
                          <td
                            key={cell.id}
                            className={cn(
                              "px-4 py-4 text-text",
                              alignClass(meta?.align),
                              meta?.className,
                            )}
                          >
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </td>
                        );
                      })}
                    </tr>
                    {row.getIsExpanded() && renderExpandedRow ? (
                      <tr
                        key={`${row.id}-expanded`}
                        className="border-b border-border bg-background"
                      >
                        <td
                          colSpan={
                            row.getVisibleCells().length +
                            (enableRowSelection ? 1 : 0) +
                            1
                          }
                          className="p-4"
                        >
                          {renderExpandedRow(row.original)}
                        </td>
                      </tr>
                    ) : null}
                  </Fragment>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={
                    columns.length +
                    (enableRowSelection ? 1 : 0) +
                    (enableExpanding || renderExpandedRow ? 1 : 0)
                  }
                  className="px-4 py-12 text-center text-text-muted"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && effectiveTotalRows > 0 && (
        <div className="flex flex-col gap-3 border-t border-border p-4 text-sm text-text-secondary sm:flex-row sm:items-center sm:justify-between">
          <span>
            نمایش {paginationState.pageIndex * paginationState.pageSize + 1} تا{" "}
            {Math.min(
              (paginationState.pageIndex + 1) * paginationState.pageSize,
              effectiveTotalRows,
            )}{" "}
            از {effectiveTotalRows}
          </span>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2">
              <span>تعداد</span>
              <select
                value={paginationState.pageSize}
                onChange={(event) =>
                  changeRowsPerPage(Number(event.target.value))
                }
                className="h-9 rounded-lg border border-border bg-surface px-2 text-text outline-none focus:border-primary"
              >
                {pageSizeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={paginationState.pageIndex <= 0}
                onClick={() => table.previousPage()}
                className="h-9 rounded-lg border border-border px-3 transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                قبلی
              </button>
              <span className="min-w-16 text-center">
                {currentPage} / {effectivePageCount}
              </span>
              <button
                type="button"
                disabled={currentPage >= effectivePageCount}
                onClick={() => table.nextPage()}
                className="h-9 rounded-lg border border-border px-3 transition hover:bg-background disabled:cursor-not-allowed disabled:opacity-40"
              >
                بعدی
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
