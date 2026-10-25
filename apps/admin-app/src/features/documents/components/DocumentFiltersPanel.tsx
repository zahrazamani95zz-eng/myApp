"use client";

import {
  Badge,
  Button,
  Input,
  PersianDateRangePicker,
} from "@super-app/shared/ui";
import { Search, X } from "lucide-react";
import type { DocumentFilters } from "../types";
import { formatFilterDate, toApiDate, toDate } from "./document-utils";

export function DocumentFiltersPanel({
  filters,
  draftFilters,
  onDraftFiltersChange,
  onApply,
  onClear,
}: {
  filters: DocumentFilters;
  draftFilters: DocumentFilters;
  onDraftFiltersChange: (filters: DocumentFilters) => void;
  onApply: () => void;
  onClear: () => void;
}) {
  return (
    <div className="documents-filter-card relative z-30 overflow-visible rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(260px,1fr)_auto] lg:items-end">
        <label className="space-y-2">
          <span className="text-sm font-medium">جستجوی عنوان</span>
          <div className="relative">
            <Search
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-text-muted"
              size={17}
            />
            <Input
              className="documents-filter-input pr-9"
              value={draftFilters.search}
              onChange={(e) =>
                onDraftFiltersChange({
                  ...draftFilters,
                  search: e.target.value,
                })
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") onApply();
              }}
              placeholder="عنوان مستند را وارد کنید..."
            />
          </div>
        </label>

        <div className="documents-filter-date relative z-50 space-y-2">
          <span className="text-sm font-medium">بازه تاریخ</span>
          <PersianDateRangePicker
            value={{
              from: toDate(draftFilters.fromDate),
              to: toDate(draftFilters.toDate),
            }}
            onChange={({ from, to }) =>
              onDraftFiltersChange({
                ...draftFilters,
                fromDate: toApiDate(from),
                toDate: toApiDate(to),
              })
            }
            placeholder="از تاریخ تا تاریخ"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onApply}>
            <Search size={17} /> جستجو
          </Button>
          <Button
            variant="outline"
            onClick={onClear}
            aria-label="پاک کردن فیلترها"
          >
            <X size={17} />
          </Button>
        </div>
      </div>

      {filters.search || filters.fromDate || filters.toDate ? (
        <div className="flex flex-wrap items-center gap-2 p-2">
          <span className="text-sm font-medium text-text-secondary">
            فیلترهای اعمال‌شده:
          </span>
          {filters.search ? (
            <Badge variant="secondary">عنوان: {filters.search}</Badge>
          ) : null}
          {filters.fromDate || filters.toDate ? (
            <Badge variant="secondary">
              تاریخ:{" "}
              {filters.fromDate ? formatFilterDate(filters.fromDate) : "ابتدا"}{" "}
              تا {filters.toDate ? formatFilterDate(filters.toDate) : "انتها"}
            </Badge>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
