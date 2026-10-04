"use client";

import { useMemo } from "react";
import { X } from "lucide-react";
import DatePicker from "react-multi-date-picker";
import persian from "react-date-object/calendars/persian";
import persianFa from "react-date-object/locales/persian_fa";
import { isoToJalaliDate, jalaliDateToIso } from "@/lib/jalali-date";
import styles from "./JalaliDatePicker.module.css";

type JalaliDatePickerProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export default function JalaliDatePicker({ id, label, value, onChange }: JalaliDatePickerProps) {
  const selectedDate = useMemo(() => isoToJalaliDate(value), [value]);

  return (
    <div className="inline-flex items-center gap-1" dir="rtl">
      <DatePicker
        id={id}
        title={`${label} (شمسی)`}
        value={selectedDate}
        onChange={(date) => onChange(jalaliDateToIso(date))}
        calendar={persian}
        locale={persianFa}
        format="YYYY/MM/DD"
        calendarPosition="bottom-right"
        onOpenPickNewDate={false}
        editable={false}
        inputMode="none"
        placeholder="انتخاب تاریخ"
        inputClass="w-32 cursor-pointer border border-gray-200 rounded-lg px-2 py-1 text-center text-sm text-neutral-700"
        className={styles.calendar}
        portal
        zIndex={50}
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          aria-label={`پاک کردن ${label}`}
          title={`پاک کردن ${label}`}
          className="rounded p-1 text-neutral-400 hover:bg-gray-100 hover:text-neutral-700"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
