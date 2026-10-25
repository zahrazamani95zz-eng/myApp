"use client";

import { AvanDateRangePicker } from "@avan-persian/react/client";

export interface PersianDateRange {
  from: Date | null;
  to: Date | null;
}

export type PersianDateRangePickerNumberOfMonths = 1 | 2 | 3 | 4;

export interface PersianDateRangePickerProps {
  value: PersianDateRange;
  onChange: (value: PersianDateRange) => void;
  placeholder?: string;
  numberOfMonths?: PersianDateRangePickerNumberOfMonths;
}

export function PersianDateRangePicker({
  value,
  onChange,
  placeholder = "انتخاب بازه تاریخ",
  numberOfMonths = 1,
}: PersianDateRangePickerProps) {
  return (
    <AvanDateRangePicker
      value={value}
      onChange={onChange}
      display="popover"
      numberOfMonths={numberOfMonths}
      placeholder={placeholder}
    />
  );
}
