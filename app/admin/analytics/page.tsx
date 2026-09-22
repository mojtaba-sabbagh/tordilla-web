// app/admin/analytics/page.tsx
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Activity,
  AppWindow,
  BarChart3,
  Download,
  Eye,
  Globe,
  Laptop,
  MapPin,
  Network,
  RefreshCw,
  Search,
  Users,
  X,
} from "lucide-react";
import AdminNav from "../components/AdminNav";

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type Granularity = "hour" | "day" | "week" | "month";
type Preset = "today" | "yesterday" | "7d" | "30d" | "90d" | "365d" | "custom";

type SeriesPoint = { bucket: string; views: number; visitors: number; sessions: number };
type Totals = { views: number; visitors: number; sessions: number; ips: number; countries: number };
type BreakdownRow = { label: string | null; extra?: string | null; count: number };

type Summary = {
  range: { from: string; to: string; preset: Preset; granularity: Granularity; timeZone: string };
  totals: Totals;
  previousTotals: Totals;
  series: SeriesPoint[];
  breakdowns: {
    pages: BreakdownRow[];
    countries: BreakdownRow[];
    cities: BreakdownRow[];
    referrers: BreakdownRow[];
    devices: BreakdownRow[];
    browsers: BreakdownRow[];
    operatingSystems: BreakdownRow[];
    topIps: BreakdownRow[];
  };
  trackingSince: string | null;
};

type Visit = {
  id: string;
  path: string;
  query: string | null;
  referrer: string | null;
  referrerHost: string | null;
  userAgent: string | null;
  ip: string;
  sessionId: string | null;
  deviceType: string | null;
  browser: string | null;
  os: string | null;
  isBot: boolean;
  locale: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  createdAt: string;
};

/* -------------------------------------------------------------------------- */
/* Labels & formatting                                                        */
/* -------------------------------------------------------------------------- */

const PRESETS: { value: Preset; label: string }[] = [
  { value: "today", label: "امروز" },
  { value: "yesterday", label: "دیروز" },
  { value: "7d", label: "۷ روز اخیر" },
  { value: "30d", label: "۳۰ روز اخیر" },
  { value: "90d", label: "۹۰ روز اخیر" },
  { value: "365d", label: "یک سال اخیر" },
];

const GRANULARITIES: { value: Granularity | "auto"; label: string }[] = [
  { value: "auto", label: "خودکار" },
  { value: "hour", label: "ساعتی" },
  { value: "day", label: "روزانه" },
  { value: "week", label: "هفتگی" },
  { value: "month", label: "ماهانه" },
];

const DEVICE_LABELS: Record<string, string> = {
  mobile: "موبایل",
  tablet: "تبلت",
  desktop: "دسکتاپ",
  unknown: "نامشخص",
};

const UNKNOWN = "نامشخص";

function fa(value: number): string {
  return value.toLocaleString("fa-IR");
}

/** Series buckets arrive as local wall-clock strings, so they are read as UTC. */
function parseBucket(bucket: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/.exec(bucket);
  if (!match) return null;
  return new Date(
    Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3]), Number(match[4]), Number(match[5])),
  );
}

function bucketLabel(bucket: string, granularity: Granularity): string {
  const date = parseBucket(bucket);
  if (!date) return bucket;

  switch (granularity) {
    case "hour":
      return date.toLocaleTimeString("fa-IR", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
    case "month":
      return date.toLocaleDateString("fa-IR", { timeZone: "UTC", year: "numeric", month: "long" });
    default:
      return date.toLocaleDateString("fa-IR", { timeZone: "UTC", month: "short", day: "numeric" });
  }
}

function bucketTooltip(bucket: string, granularity: Granularity): string {
  const date = parseBucket(bucket);
  if (!date) return bucket;

  const day = date.toLocaleDateString("fa-IR", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (granularity === "hour") {
    const time = date.toLocaleTimeString("fa-IR", { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
    return `${day} ساعت ${time}`;
  }
  if (granularity === "week") return `هفتهٔ منتهی به ${day}`;
  return day;
}

function formatDateTime(value: string): string {
  const date = new Date(value);
  return (
    date.toLocaleDateString("fa-IR", { year: "numeric", month: "short", day: "numeric" }) +
    " — " +
    date.toLocaleTimeString("fa-IR", { hour: "2-digit", minute: "2-digit" })
  );
}

function deltaPercent(current: number, previous: number): number | null {
  if (previous === 0) return current === 0 ? 0 : null;
  return ((current - previous) / previous) * 100;
}

/* -------------------------------------------------------------------------- */
/* Small presentational pieces                                                */
/* -------------------------------------------------------------------------- */

function StatCard({
  title,
  value,
  previous,
  icon: Icon,
  hint,
}: {
  title: string;
  value: number;
  previous: number;
  icon: typeof Eye;
  hint: string;
}) {
  const delta = deltaPercent(value, previous);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-[#8f1d1d]">{fa(value)}</p>
        </div>
        <div className="bg-[#8f1d1d]/10 p-3 rounded-full">
          <Icon className="h-7 w-7 text-[#8f1d1d]" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2 text-xs">
        {delta === null ? (
          <span className="text-gray-400">بازهٔ قبلی داده‌ای ندارد</span>
        ) : (
          <span
            className={`px-2 py-0.5 rounded-full ${
              delta > 0
                ? "bg-green-100 text-green-700"
                : delta < 0
                  ? "bg-red-100 text-red-700"
                  : "bg-gray-100 text-gray-600"
            }`}
          >
            {delta > 0 ? "▲" : delta < 0 ? "▼" : "•"} {fa(Math.abs(Math.round(delta)))}٪
          </span>
        )}
        <span className="text-gray-400">{hint}</span>
      </div>
    </div>
  );
}

function BreakdownCard({
  title,
  icon: Icon,
  rows,
  emptyText = "داده‌ای ثبت نشده است.",
  renderLabel,
  onRowClick,
}: {
  title: string;
  icon: typeof Globe;
  rows: BreakdownRow[];
  emptyText?: string;
  renderLabel?: (row: BreakdownRow) => string;
  onRowClick?: (row: BreakdownRow) => void;
}) {
  const max = rows.reduce((peak, row) => Math.max(peak, row.count), 0);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-[#8f1d1d]" />
        <h3 className="font-bold text-neutral-800">{title}</h3>
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-neutral-400 py-4">{emptyText}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((row, index) => {
            const label = renderLabel ? renderLabel(row) : row.label || UNKNOWN;
            const width = max > 0 ? Math.max((row.count / max) * 100, 2) : 0;

            return (
              <li key={`${row.label ?? "null"}-${index}`}>
                <button
                  type="button"
                  disabled={!onRowClick}
                  onClick={() => onRowClick?.(row)}
                  className={`relative w-full text-right rounded px-2 py-1.5 overflow-hidden ${
                    onRowClick ? "hover:bg-gray-50 cursor-pointer" : "cursor-default"
                  }`}
                >
                  <span
                    className="absolute inset-y-0 right-0 bg-[#8f1d1d]/10 rounded"
                    style={{ width: `${width}%` }}
                    aria-hidden
                  />
                  <span className="relative flex items-center justify-between gap-3">
                    <span className="text-sm text-neutral-700 truncate" title={label}>
                      {label}
                      {row.extra ? (
                        <span className="text-xs text-neutral-400"> — {row.extra}</span>
                      ) : null}
                    </span>
                    <span className="text-sm font-medium text-neutral-900 shrink-0">
                      {fa(row.count)}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function TrafficChart({ series, granularity }: { series: SeriesPoint[]; granularity: Granularity }) {
  const max = series.reduce((peak, point) => Math.max(peak, point.views), 0);
  // Keep the axis readable when a long range produces many columns.
  const labelEvery = Math.max(1, Math.ceil(series.length / 14));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-[#8f1d1d]" />
          <h3 className="font-bold text-neutral-800">روند بازدید</h3>
        </div>
        <div className="flex items-center gap-4 text-xs text-neutral-600">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#8f1d1d]/30" />
            بازدید صفحه
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-3 w-3 rounded-sm bg-[#8f1d1d]" />
            بازدیدکنندهٔ یکتا
          </span>
        </div>
      </div>

      {series.length === 0 || max === 0 ? (
        <p className="text-sm text-neutral-400 py-16 text-center">
          در این بازه بازدیدی ثبت نشده است.
        </p>
      ) : (
        <div className="overflow-x-auto" dir="ltr">
          <div className="flex items-stretch gap-1 h-64 min-w-full" style={{ minWidth: series.length * 14 }}>
            {series.map((point) => {
              const heightPercent = (point.views / max) * 100;
              const visitorPercent = point.views > 0 ? (point.visitors / point.views) * 100 : 0;

              return (
                <div
                  key={point.bucket}
                  className="flex-1 min-w-[8px] flex flex-col justify-end group"
                  title={`${bucketTooltip(point.bucket, granularity)}\nبازدید صفحه: ${fa(point.views)}\nبازدیدکنندهٔ یکتا: ${fa(point.visitors)}\nنشست: ${fa(point.sessions)}`}
                >
                  <span className="text-[10px] text-neutral-500 text-center opacity-0 group-hover:opacity-100 transition mb-1">
                    {fa(point.views)}
                  </span>
                  <div
                    className="relative w-full rounded-t bg-[#8f1d1d]/25 group-hover:bg-[#8f1d1d]/40 transition-colors"
                    style={{ height: `${Math.max(heightPercent, point.views > 0 ? 2 : 0)}%` }}
                  >
                    <div
                      className="absolute inset-x-0 bottom-0 rounded-t bg-[#8f1d1d]"
                      style={{ height: `${visitorPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-1 mt-2 min-w-full" style={{ minWidth: series.length * 14 }}>
            {series.map((point, index) => (
              <div key={point.bucket} className="flex-1 min-w-[8px] text-center">
                <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                  {index % labelEvery === 0 ? bucketLabel(point.bucket, granularity) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page                                                                       */
/* -------------------------------------------------------------------------- */

export default function AnalyticsPage() {
  const router = useRouter();

  const [preset, setPreset] = useState<Preset>("30d");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [granularity, setGranularity] = useState<Granularity | "auto">("auto");
  const [includeBots, setIncludeBots] = useState(false);

  const [pathFilter, setPathFilter] = useState<string | null>(null);
  const [countryFilter, setCountryFilter] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [visitsPage, setVisitsPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);

  const [summary, setSummary] = useState<Summary | null>(null);
  const [visits, setVisits] = useState<Visit[]>([]);
  const [visitsTotal, setVisitsTotal] = useState(0);
  const [visitsTotalPages, setVisitsTotalPages] = useState(1);

  const [loading, setLoading] = useState(true);
  const [visitsLoading, setVisitsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [unseenMessagesCount, setUnseenMessagesCount] = useState(0);
  const [pendingCommentsCount, setPendingCommentsCount] = useState(0);

  /** Every request shares the same range/filter parameters. */
  const baseParams = useCallback(() => {
    const params = new URLSearchParams();

    if (preset === "custom") {
      if (customFrom) params.set("from", customFrom);
      if (customTo) params.set("to", customTo);
    } else {
      params.set("range", preset);
    }

    if (granularity !== "auto") params.set("granularity", granularity);
    if (includeBots) params.set("includeBots", "1");
    if (pathFilter) params.set("path", pathFilter);
    if (countryFilter) params.set("country", countryFilter);

    return params;
  }, [preset, customFrom, customTo, granularity, includeBots, pathFilter, countryFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput.trim());
      setVisitsPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/admin/analytics?${baseParams().toString()}`);
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!response.ok) throw new Error("failed");

        const data = (await response.json()) as Summary;
        if (!cancelled) setSummary(data);
      } catch {
        if (!cancelled) setError("خطا در دریافت آمار بازدید.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [baseParams, router, reloadToken]);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setVisitsLoading(true);

      try {
        const params = baseParams();
        params.set("page", String(visitsPage));
        params.set("limit", "25");
        if (search) params.set("q", search);

        const response = await fetch(`/api/admin/analytics/visits?${params.toString()}`);
        if (response.status === 401) {
          router.push("/admin/login");
          return;
        }
        if (!response.ok) throw new Error("failed");

        const data = await response.json();
        if (cancelled) return;

        setVisits(data.visits || []);
        setVisitsTotal(data.total || 0);
        setVisitsTotalPages(data.totalPages || 1);
      } catch {
        if (!cancelled) setVisits([]);
      } finally {
        if (!cancelled) setVisitsLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [baseParams, visitsPage, search, router, reloadToken]);

  useEffect(() => {
    const loadBadges = async () => {
      const [messages, comments] = await Promise.all([
        fetch("/api/admin/messages/unseen-count")
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null),
        fetch("/api/admin/comments/pending/count")
          .then((response) => (response.ok ? response.json() : null))
          .catch(() => null),
      ]);

      setUnseenMessagesCount(messages?.count || 0);
      setPendingCommentsCount(comments?.count || 0);
    };

    loadBadges();
  }, []);

  const effectiveGranularity = summary?.range.granularity ?? "day";

  const rangeLabel = useMemo(() => {
    if (!summary) return "";
    const from = new Date(summary.range.from);
    // `to` is exclusive, so step back into the last covered day for the label.
    const to = new Date(new Date(summary.range.to).getTime() - 1);
    const format = (date: Date) =>
      date.toLocaleDateString("fa-IR", { year: "numeric", month: "long", day: "numeric" });
    return `${format(from)} تا ${format(to)}`;
  }, [summary]);

  const exportHref = useMemo(() => {
    const params = baseParams();
    params.set("format", "csv");
    if (search) params.set("q", search);
    return `/api/admin/analytics/visits?${params.toString()}`;
  }, [baseParams, search]);

  const applyPreset = (value: Preset) => {
    setPreset(value);
    setVisitsPage(1);
  };

  const clearFilters = () => {
    setPathFilter(null);
    setCountryFilter(null);
    setSearchInput("");
    setSearch("");
    setVisitsPage(1);
  };

  const hasFilters = Boolean(pathFilter || countryFilter || search);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav
        unseenMessagesCount={unseenMessagesCount}
        pendingCommentsCount={pendingCommentsCount}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-neutral-800">آمار بازدید سایت</h2>
            <p className="text-sm text-neutral-500 mt-1">
              {rangeLabel || "در حال بارگذاری..."}
              {summary?.trackingSince ? (
                <span className="text-neutral-400">
                  {" "}
                  · ثبت آمار از {formatDateTime(summary.trackingSince)}
                </span>
              ) : null}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={exportHref}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white border border-gray-200 rounded-lg text-neutral-700 hover:bg-gray-50 transition"
            >
              <Download className="h-4 w-4" />
              خروجی CSV
            </a>
            <button
              type="button"
              onClick={() => setReloadToken((current) => current + 1)}
              className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium bg-[#8f1d1d] !text-white rounded-lg hover:bg-[#6b1616] transition"
            >
              <RefreshCw className="h-4 w-4" />
              بروزرسانی
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {PRESETS.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => applyPreset(item.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  preset === item.value
                    ? "bg-[#8f1d1d] text-white"
                    : "bg-gray-100 text-neutral-700 hover:bg-gray-200"
                }`}
              >
                {item.label}
              </button>
            ))}

            <span className="mx-2 h-6 w-px bg-gray-200" />

            <label className="flex items-center gap-2 text-sm text-neutral-600">
              از
              <input
                type="date"
                value={customFrom}
                onChange={(event) => {
                  setCustomFrom(event.target.value);
                  setPreset("custom");
                  setVisitsPage(1);
                }}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm text-neutral-600">
              تا
              <input
                type="date"
                value={customTo}
                onChange={(event) => {
                  setCustomTo(event.target.value);
                  setPreset("custom");
                  setVisitsPage(1);
                }}
                className="border border-gray-200 rounded-lg px-2 py-1 text-sm"
              />
            </label>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-neutral-600">بازهٔ نمودار:</span>
            {GRANULARITIES.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setGranularity(item.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition ${
                  granularity === item.value
                    ? "bg-[#8f1d1d]/10 text-[#8f1d1d] font-medium"
                    : "bg-gray-100 text-neutral-700 hover:bg-gray-200"
                }`}
              >
                {item.label}
                {item.value === "auto" && summary
                  ? ` (${GRANULARITIES.find((entry) => entry.value === effectiveGranularity)?.label})`
                  : ""}
              </button>
            ))}

            <span className="mx-2 h-6 w-px bg-gray-200" />

            <label className="flex items-center gap-2 text-sm text-neutral-600 cursor-pointer">
              <input
                type="checkbox"
                checked={includeBots}
                onChange={(event) => {
                  setIncludeBots(event.target.checked);
                  setVisitsPage(1);
                }}
                className="rounded border-gray-300"
              />
              احتساب ربات‌ها و خزنده‌ها
            </label>
          </div>

          {hasFilters ? (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-sm text-neutral-600">فیلتر فعال:</span>
              {pathFilter ? (
                <button
                  type="button"
                  onClick={() => setPathFilter(null)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#8f1d1d]/10 text-[#8f1d1d] rounded-full"
                >
                  صفحه: {pathFilter} <X className="h-3 w-3" />
                </button>
              ) : null}
              {countryFilter ? (
                <button
                  type="button"
                  onClick={() => setCountryFilter(null)}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#8f1d1d]/10 text-[#8f1d1d] rounded-full"
                >
                  کشور: {countryFilter} <X className="h-3 w-3" />
                </button>
              ) : null}
              {search ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearch("");
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-[#8f1d1d]/10 text-[#8f1d1d] rounded-full"
                >
                  جستجو: {search} <X className="h-3 w-3" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-neutral-500 hover:text-[#8f1d1d]"
              >
                پاک کردن همه
              </button>
            </div>
          ) : null}
        </div>

        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6">{error}</div>
        ) : null}

        {loading && !summary ? (
          <div className="bg-white rounded-lg shadow p-16 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#8f1d1d] mx-auto" />
            <p className="mt-4 text-neutral-600">در حال بارگذاری آمار...</p>
          </div>
        ) : summary ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <StatCard
                title="بازدید صفحه"
                value={summary.totals.views}
                previous={summary.previousTotals.views}
                icon={Eye}
                hint="نسبت به بازهٔ قبل"
              />
              <StatCard
                title="بازدیدکنندهٔ یکتا"
                value={summary.totals.visitors}
                previous={summary.previousTotals.visitors}
                icon={Users}
                hint="نسبت به بازهٔ قبل"
              />
              <StatCard
                title="نشست‌ها"
                value={summary.totals.sessions}
                previous={summary.previousTotals.sessions}
                icon={Activity}
                hint="نسبت به بازهٔ قبل"
              />
              <StatCard
                title="IP یکتا"
                value={summary.totals.ips}
                previous={summary.previousTotals.ips}
                icon={Network}
                hint={`از ${fa(summary.totals.countries)} کشور`}
              />
            </div>

            <div className="mb-6">
              <TrafficChart series={summary.series} granularity={effectiveGranularity} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <BreakdownCard
                title="پربازدیدترین صفحات"
                icon={BarChart3}
                rows={summary.breakdowns.pages}
                onRowClick={(row) => {
                  setPathFilter(row.label);
                  setVisitsPage(1);
                }}
              />
              <BreakdownCard
                title="کشورها"
                icon={Globe}
                rows={summary.breakdowns.countries}
                onRowClick={(row) => {
                  setCountryFilter(row.label);
                  setVisitsPage(1);
                }}
              />
              <BreakdownCard title="شهرها" icon={MapPin} rows={summary.breakdowns.cities} />
              <BreakdownCard
                title="ارجاع‌دهنده‌ها"
                icon={Globe}
                rows={summary.breakdowns.referrers}
                renderLabel={(row) => row.label || "ورود مستقیم"}
              />
              <BreakdownCard
                title="دستگاه‌ها"
                icon={Laptop}
                rows={summary.breakdowns.devices}
                renderLabel={(row) => DEVICE_LABELS[row.label ?? ""] || row.label || UNKNOWN}
              />
              <BreakdownCard title="مرورگرها" icon={AppWindow} rows={summary.breakdowns.browsers} />
              <BreakdownCard
                title="سیستم‌عامل‌ها"
                icon={Laptop}
                rows={summary.breakdowns.operatingSystems}
              />
              <BreakdownCard
                title="پربازدیدترین IPها"
                icon={Network}
                rows={summary.breakdowns.topIps}
                onRowClick={(row) => {
                  setSearchInput(row.label ?? "");
                  setVisitsPage(1);
                }}
              />
            </div>
          </>
        ) : null}

        {/* Visit log */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 border-b border-gray-100">
            <h3 className="font-bold text-neutral-800">
              فهرست بازدیدها
              <span className="text-sm font-normal text-neutral-500"> ({fa(visitsTotal)} مورد)</span>
            </h3>

            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="جستجو در IP، صفحه، شهر، کشور..."
                className="border border-gray-200 rounded-lg ps-3 pe-9 py-2 text-sm w-72 max-w-full"
              />
            </div>
          </div>

          {visitsLoading ? (
            <div className="p-12 text-center text-neutral-500">در حال بارگذاری...</div>
          ) : visits.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">بازدیدی با این شرایط یافت نشد.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["زمان", "IP", "موقعیت", "صفحه", "ارجاع‌دهنده", "دستگاه"].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visits.map((visit) => (
                    <tr key={visit.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {formatDateTime(visit.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 font-mono whitespace-nowrap" dir="ltr">
                        {visit.ip}
                        {visit.isBot ? (
                          <span className="ms-2 px-1.5 py-0.5 text-[10px] rounded bg-yellow-100 text-yellow-800 font-sans">
                            ربات
                          </span>
                        ) : null}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {[visit.city, visit.region, visit.country].filter(Boolean).join("، ") || UNKNOWN}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate" title={visit.path}>
                        <span dir="ltr">
                          {visit.path}
                          {visit.query ? `?${visit.query}` : ""}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600" dir="ltr">
                        {visit.referrerHost || "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 whitespace-nowrap">
                        {DEVICE_LABELS[visit.deviceType ?? ""] || UNKNOWN}
                        <span className="text-xs text-neutral-400">
                          {" "}
                          {[visit.browser, visit.os].filter(Boolean).join(" / ")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {visitsTotalPages > 1 ? (
            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <button
                type="button"
                disabled={visitsPage <= 1}
                onClick={() => setVisitsPage((current) => Math.max(current - 1, 1))}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-neutral-700 disabled:opacity-40 hover:bg-gray-200 transition"
              >
                قبلی
              </button>
              <span className="text-sm text-neutral-600">
                صفحهٔ {fa(visitsPage)} از {fa(visitsTotalPages)}
              </span>
              <button
                type="button"
                disabled={visitsPage >= visitsTotalPages}
                onClick={() => setVisitsPage((current) => Math.min(current + 1, visitsTotalPages))}
                className="px-3 py-1.5 text-sm rounded-lg bg-gray-100 text-neutral-700 disabled:opacity-40 hover:bg-gray-200 transition"
              >
                بعدی
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
