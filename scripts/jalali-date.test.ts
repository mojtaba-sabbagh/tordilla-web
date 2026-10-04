import assert from "node:assert/strict";
import { test } from "node:test";
import { isoToJalaliDate, jalaliDateToIso } from "../lib/jalali-date";

test("Jalali display and Gregorian API dates agree at Nowruz and leap-day boundaries", () => {
  const cases = [
    ["2024-03-19", "۱۴۰۲/۱۲/۲۹"],
    ["2024-03-20", "۱۴۰۳/۰۱/۰۱"],
    ["2025-03-20", "۱۴۰۳/۱۲/۳۰"],
    ["2025-03-21", "۱۴۰۴/۰۱/۰۱"],
    ["2026-03-20", "۱۴۰۴/۱۲/۲۹"],
    ["2026-03-21", "۱۴۰۵/۰۱/۰۱"],
    ["2026-10-04", "۱۴۰۵/۰۷/۱۲"],
  ];

  for (const [iso, jalali] of cases) {
    const date = isoToJalaliDate(iso);
    assert.ok(date);
    assert.equal(date.format("YYYY/MM/DD"), jalali);
    assert.equal(jalaliDateToIso(date), iso);
    assert.equal(date.calendar.name, "persian", "conversion must not mutate the picker value");
    assert.equal(date.format("YYYY/MM/DD"), jalali);
  }
});

test("clearing either date leaves its API parameter empty", () => {
  assert.equal(isoToJalaliDate(""), null);
  assert.equal(jalaliDateToIso(null), "");
});

test("calendar days round-trip independently of the browser time zone", () => {
  const originalTimeZone = process.env.TZ;
  try {
    for (const timeZone of ["UTC", "Asia/Tehran", "America/Los_Angeles", "Pacific/Kiritimati"]) {
      process.env.TZ = timeZone;
      assert.equal(jalaliDateToIso(isoToJalaliDate("2025-03-20")), "2025-03-20", timeZone);
    }
  } finally {
    if (originalTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = originalTimeZone;
  }
});
