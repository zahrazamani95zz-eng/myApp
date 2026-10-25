"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@super-app/shared/ui";
import { productOptions, type AdminProduct } from "../../config/navigation";

export function ProductSwitcher({
  value,
  onChange,
}: {
  value: AdminProduct;
  onChange: (value: AdminProduct) => void;
}) {
  return (
    <div className="shrink-0">
      <Select
        value={value}
        onValueChange={(next) => onChange(next as AdminProduct)}
      >
        <SelectTrigger className="h-10 w-auto min-w-[140px] rounded-xl border-border bg-surface px-3 text-sm">
          <SelectValue placeholder="انتخاب سامانه" />
        </SelectTrigger>

        <SelectContent>
          {productOptions.map((option) => (
            <SelectItem key={option.id} value={option.id}>
              {option.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
