"use client";

import { useMemo, useState } from "react";
import { Download, FileText, Plus, RefreshCw, Trash2 } from "lucide-react";

import {
  DeleteConfirmDialog,
  Badge,
  OverflowTooltip,
  Button,
  DataTable,
  type DataTableColumn,
  type DataTableRowSelectionState,
  toast,
} from "@super-app/shared/ui";
import {
  useDeleteDocumentMutation,
  useDeleteDocumentsMutation,
  useGetDocumentsQuery,
  useDownloadDocumentMutation,
  type DocumentItem,
} from "../../../store/api/documentsApi";
import { DocumentUploadDialog } from "./DocumentUploadDialog";
import { DocumentFiltersPanel } from "./DocumentFiltersPanel";
import { formatDocumentDate } from "./document-utils";
import type { DocumentFilters } from "../types";
import { getApiErrorMessage } from "@/lib/api-error";

export function DocumentsPage() {
  const [filters, setFilters] = useState<DocumentFilters>({
    search: "",
    fromDate: "",
    toDate: "",
  });
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [draftFilters, setDraftFilters] = useState(filters);
  const [selection, setSelection] = useState<DataTableRowSelectionState>({});
  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleteBatchOpen, setDeleteBatchOpen] = useState(false);
  const [downloadId, setDownloadId] = useState<number | null>(null);

  const query = useGetDocumentsQuery({
    pageIndex: pageIndex + 1,
    pageSize,
    search: filters.search || undefined,
    fromDate: filters.fromDate || undefined,
    toDate: filters.toDate || undefined,
  });
  const [deleteDocument, deleteState] = useDeleteDocumentMutation();
  const [deleteDocuments, deleteBatchState] = useDeleteDocumentsMutation();
  const [downloadDocument, downloadState] = useDownloadDocumentMutation();

  const selectedIds = useMemo(
    () =>
      Object.keys(selection)
        .map(Number)
        .filter((id) => Number.isFinite(id)),
    [selection],
  );

  const columns = useMemo<DataTableColumn<DocumentItem>[]>(
    () => [
      {
        accessorKey: "title",
        header: "عنوان مستند",
        enableSorting: true,
        cell: ({ row }) => (
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-danger/10 text-danger">
              <FileText size={17} />
            </span>
            <OverflowTooltip
              content={row.original.title}
              className="max-w-[24rem] font-medium"
            >
              {row.original.title}
            </OverflowTooltip>
          </div>
        ),
      },
      {
        accessorKey: "created_at",
        header: "تاریخ ایجاد",
        enableSorting: true,
        cell: ({ row }) => (
          <span className="text-text-secondary">
            {formatDocumentDate(row.original.created_at)}
          </span>
        ),
      },
      {
        id: "type",
        header: "نوع",
        cell: () => <Badge variant="secondary">PDF</Badge>,
        // meta: { align: "" },
      },
      {
        id: "actions",
        header: "عملیات",
        enableSorting: false,
        cell: ({ row }) => (
          <div className="flex items-center  gap-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={downloadState.isLoading}
              aria-label="دریافت فایل"
              onClick={() => void handleDownload(row.original)}
            >
              {downloadId === row.original.id && downloadState.isLoading ? (
                <RefreshCw className="animate-spin" size={16} />
              ) : (
                <Download size={16} />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              aria-label="حذف فایل"
              onClick={() => setDeleteId(row.original.id)}
            >
              <Trash2 size={16} className="text-danger" />
            </Button>
          </div>
        ),
        //  meta: { align: "end" },
      },
    ],
    [downloadId, downloadState.isLoading],
  );

  async function handleDownload(item: DocumentItem) {
    setDownloadId(item.id);
    try {
      const { objectUrl } = await downloadDocument(item.id).unwrap();
      const anchor = window.document.createElement("a");
      anchor.href = objectUrl;
      anchor.download = item.title.toLowerCase().endsWith(".pdf")
        ? item.title
        : `${item.title}.pdf`;
      anchor.style.display = "none";
      window.document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
      toast.success({
        title: "دریافت فایل",
        description: `فایل «${item.title}» با موفقیت دریافت شد.`,
      });
    } catch (error) {
      toast.error({
        title: "خطا در دریافت فایل",
        description: getApiErrorMessage(error, "دریافت فایل انجام نشد."),
      });
    } finally {
      setDownloadId(null);
    }
  }

  async function confirmDelete() {
    if (deleteId === null) return;
    try {
      const response = await deleteDocument(deleteId).unwrap();
      if (!response.success) throw new Error(response.message);
      toast.success({ title: "حذف شد", description: response.message });
      setDeleteId(null);
      setSelection({});
      await query.refetch();
    } catch (error) {
      toast.error({
        title: "خطا در حذف",
        description: getApiErrorMessage(error, "حذف فایل انجام نشد."),
      });
    }
  }

  async function confirmBatchDelete() {
    if (!selectedIds.length) return;
    try {
      const response = await deleteDocuments(selectedIds).unwrap();

      if (response.failed === 0) {
        toast.success({
          title: "حذف گروهی موفق",
          description: `${response.successful} فایل با موفقیت حذف شد.`,
        });
      } else {
        const failedMessages = response.results
          .filter((result) => !result.success)
          .map((result) => result.error)
          .filter(Boolean);
        toast.error({
          title: "حذف گروهی با خطا",
          description:
            failedMessages[0] ??
            `از ${response.total} فایل، ${response.successful} فایل حذف شد و ${response.failed} فایل حذف نشد.`,
        });
      }

      setSelection({});
      setDeleteBatchOpen(false);
      await query.refetch();
    } catch (error) {
      toast.error({
        title: "خطا در حذف گروهی",
        description: getApiErrorMessage(error, "حذف گروهی انجام نشد."),
      });
    }
  }

  function applyFilters() {
    setPageIndex(0);
    setFilters({ ...draftFilters });
    setSelection({});
  }

  function clearFilters() {
    const empty = { search: "", fromDate: "", toDate: "" };
    setDraftFilters(empty);
    setFilters(empty);
    setPageIndex(0);
    setSelection({});
  }

  return (
    <section className="space-y-5">
      <DocumentFiltersPanel
        filters={filters}
        draftFilters={draftFilters}
        onDraftFiltersChange={setDraftFilters}
        onApply={applyFilters}
        onClear={clearFilters}
      />

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-sm text-text-secondary">
          <span>تعداد کل:</span>
          <strong className="text-text">
            {(query.data?.total ?? 0).toLocaleString("fa-IR")}
          </strong>
          {selectedIds.length ? (
            <Badge variant="secondary">{selectedIds.length} انتخاب شده</Badge>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length ? (
            <Button
              variant="danger"
              onClick={() => setDeleteBatchOpen(true)}
              disabled={deleteBatchState.isLoading}
            >
              <Trash2 size={17} /> حذف انتخاب‌شده‌ها
            </Button>
          ) : null}
          <Button onClick={() => setUploadOpen(true)}>
            <Plus size={18} /> افزودن مستند
          </Button>
          <Button
            variant="ghost"
            onClick={() => void query.refetch()}
            disabled={query.isLoading}
          >
            <RefreshCw
              size={17}
              className={query.isLoading ? "animate-spin" : ""}
            />{" "}
            بروزرسانی
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={query.data?.files ?? []}
        getRowId={(row) => String(row.id)}
        loading={query.isLoading}
        pagination
        manualPagination
        pageIndex={pageIndex}
        pageSize={pageSize}
        pageCount={Math.max(1, Math.ceil((query.data?.total ?? 0) / pageSize))}
        totalRows={query.data?.total ?? 0}
        onPaginationChange={({
          pageIndex: nextPageIndex,
          pageSize: nextPageSize,
        }) => {
          setPageIndex(nextPageIndex);
          setPageSize(nextPageSize);
          setSelection({});
        }}
        // enableColumnReordering
        enableRowSelection
        rowSelection={selection}
        onRowSelectionChange={setSelection}
        pageSizeOptions={[10, 20, 50]}
        emptyMessage={
          query.isError
            ? "دریافت مستندات با خطا مواجه شد."
            : "مستندی برای نمایش وجود ندارد."
        }
      />

      <DocumentUploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onUploadSuccess={() => void query.refetch()}
      />

      <DeleteConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="حذف مستند"
        description="این مستند برای همیشه حذف خواهد شد و امکان بازگردانی آن وجود ندارد. آیا از ادامه عملیات مطمئن هستید؟"
        confirmLabel="حذف مستند"
        loading={deleteState.isLoading}
        onConfirm={confirmDelete}
      />

      <DeleteConfirmDialog
        open={deleteBatchOpen}
        onOpenChange={setDeleteBatchOpen}
        title="حذف گروهی مستندات"
        description={
          <>
            {selectedIds.length} مستند انتخاب شده است. این عملیات قابل بازگشت
            نیست و تمام مستندات انتخاب‌شده حذف خواهند شد.
          </>
        }
        confirmLabel="حذف همه"
        loading={deleteBatchState.isLoading}
        onConfirm={confirmBatchDelete}
      />
    </section>
  );
}
