import DateObject from "react-date-object";
import gregorian from "react-date-object/calendars/gregorian";
import persian from "react-date-object/calendars/persian";
import gregorianEn from "react-date-object/locales/gregorian_en";
import persianFa from "react-date-object/locales/persian_fa";

/** Parse a Gregorian API date as a calendar day, without a UTC/local-time shift. */
export function isoToJalaliDate(value: string): DateObject | null {
  if (!value) return null;

  return new DateObject({
    date: value,
    format: "YYYY-MM-DD",
    calendar: gregorian,
    locale: gregorianEn,
  }).convert(persian, persianFa);
}

/** Keep the picker object Persian and send an ASCII Gregorian day to the API. */
export function jalaliDateToIso(date: DateObject | null): string {
  if (!date?.isValid) return "";

  return new DateObject(date).convert(gregorian, gregorianEn).format("YYYY-MM-DD");
}
