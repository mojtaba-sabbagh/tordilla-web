// app/admin/backup/page.tsx
"use client";

import { useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Database,
  Download,
  Images,
  Loader2,
  RotateCcw,
  ShieldAlert,
  Upload,
} from "lucide-react";

type RestoreMode = "merge" | "replace";

type RestoreReport = {
  mode: RestoreMode;
  blogPosts: { created: number; updated: number };
  comments: { created: number; updated: number; skipped: number };
  sitePageContent: { created: number; updated: number };
  contactMessages: { created: number; updated: number };
  warnings: string[];
};

type BackupPreview = {
  createdAt: string;
  counts: Record<string, number>;
};

const SECTION_LABELS: Record<string, string> = {
  blogPosts: "مطالب وبلاگ",
  comments: "نظرات",
  sitePageContent: "محتوای صفحات",
  contactMessages: "پیام‌های تماس",
};

type MediaReport = {
  restored: number;
  overwritten: number;
  skipped: { name: string; reason: string }[];
};

export default function BackupPage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const mediaFileRef = useRef<HTMLInputElement>(null);
  const [mediaBusy, setMediaBusy] = useState<"backup" | "restore" | null>(null);
  const [mediaOverwrite, setMediaOverwrite] = useState(false);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const [mediaReport, setMediaReport] = useState<MediaReport | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [restoring, setRestoring] = useState(false);
  const [mode, setMode] = useState<RestoreMode>("merge");
  const [confirmText, setConfirmText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [backupJson, setBackupJson] = useState<Record<string, unknown> | null>(null);
  const [preview, setPreview] = useState<BackupPreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<RestoreReport | null>(null);

  const resetRestoreState = () => {
    setError(null);
    setReport(null);
  };

  const handleDownload = async () => {
    setDownloading(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/backup");

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setError(data.error || "خطا در دریافت فایل پشتیبان.");
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") || "";
      const suggested = disposition.match(/filename="?([^"]+)"?/)?.[1];

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = suggested || "tordilla-backup.json";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("خطا در ارتباط با سرور هنگام تهیه پشتیبان.");
    } finally {
      setDownloading(false);
    }
  };

  const handleMediaBackup = async () => {
    setMediaBusy("backup");
    setMediaError(null);
    setMediaReport(null);

    try {
      const response = await fetch("/api/admin/media/backup");

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        setMediaError(data.error || "خطا در دریافت پشتیبان تصاویر.");
        return;
      }

      const blob = await response.blob();
      const disposition = response.headers.get("Content-Disposition") || "";
      const suggested = disposition.match(/filename="?([^"]+)"?/)?.[1];

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = suggested || "tordilla-media.zip";
      link.click();
      URL.revokeObjectURL(url);
    } catch {
      setMediaError("خطا در ارتباط با سرور هنگام تهیه پشتیبان تصاویر.");
    } finally {
      setMediaBusy(null);
    }
  };

  const handleMediaRestore = async (file: File) => {
    setMediaBusy("restore");
    setMediaError(null);
    setMediaReport(null);

    try {
      const body = new FormData();
      body.append("file", file);
      body.append("overwrite", String(mediaOverwrite));

      const response = await fetch("/api/admin/media/restore", { method: "POST", body });
      const data = await response.json();

      if (!response.ok) {
        setMediaError(data.error || "خطا در بازگردانی تصاویر.");
        return;
      }

      setMediaReport(data.report);
    } catch {
      setMediaError("خطا در ارتباط با سرور هنگام بازگردانی تصاویر.");
    } finally {
      setMediaBusy(null);
      if (mediaFileRef.current) mediaFileRef.current.value = "";
    }
  };

  const handleFile = async (file: File) => {
    resetRestoreState();
    setFileName(file.name);
    setBackupJson(null);
    setPreview(null);

    try {
      const parsed = JSON.parse(await file.text());

      if (parsed?.format !== "tordilla-backup") {
        setError("این فایل، پشتیبان ترددیلا نیست.");
        return;
      }

      setBackupJson(parsed);
      setPreview({
        createdAt: parsed.createdAt ?? "",
        counts: parsed.counts ?? {},
      });
    } catch {
      setError("فایل انتخاب‌شده یک JSON معتبر نیست.");
    } finally {
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRestore = async () => {
    if (!backupJson) return;

    setRestoring(true);
    resetRestoreState();

    try {
      const response = await fetch("/api/admin/restore", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode,
          confirm: mode === "replace" ? confirmText.trim() : undefined,
          backup: backupJson,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "خطا در بازگردانی پشتیبان.");
        return;
      }

      setReport(data.report);
      setConfirmText("");
    } catch {
      setError("خطا در ارتباط با سرور هنگام بازگردانی.");
    } finally {
      setRestoring(false);
    }
  };

  const replaceBlocked = mode === "replace" && confirmText.trim() !== "REPLACE";

  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-3">
          <Database className="h-6 w-6 text-[#8f1d1d]" />
          <h1 className="text-xl font-bold text-[#8f1d1d]">پشتیبان‌گیری و بازگردانی</h1>
        </div>

        {/* ── Backup ── */}
        <section className="mb-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-neutral-800">
            <Download className="h-5 w-5 text-[#8f1d1d]" />
            تهیه نسخه پشتیبان
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-neutral-600">
            یک فایل JSON شامل مطالب وبلاگ، نظرات، محتوای صفحات و پیام‌های تماس دریافت می‌کنید.
            نام کاربری و رمز مدیر در فایل پشتیبان قرار نمی‌گیرد.
          </p>

          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex items-center gap-2 rounded-lg bg-[#8f1d1d] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6b1616] disabled:opacity-50"
          >
            {downloading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {downloading ? "در حال آماده‌سازی..." : "دانلود فایل پشتیبان"}
          </button>

          <p className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-relaxed text-amber-700">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
            تصاویر آپلودشده در این فایل نیستند؛ برای آن‌ها از بخش «تصاویر آپلودشده» در پایین همین
            صفحه، پشتیبان جداگانه تهیه کنید.
          </p>
        </section>

        {/* ── Restore ── */}
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-neutral-800">
            <Upload className="h-5 w-5 text-[#8f1d1d]" />
            بازگردانی از فایل پشتیبان
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-neutral-600">
            فایل پشتیبان را انتخاب کنید، حالت بازگردانی را مشخص کنید و سپس بازگردانی را آغاز کنید.
          </p>

          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-gray-50"
          >
            <Upload className="h-4 w-4" />
            {fileName ? "انتخاب فایل دیگر" : "انتخاب فایل پشتیبان"}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void handleFile(file);
            }}
          />

          {fileName && (
            <p dir="ltr" className="mt-3 break-all text-left font-mono text-xs text-neutral-500">
              {fileName}
            </p>
          )}

          {preview && (
            <div className="mt-4 rounded-lg border border-neutral-200 bg-gray-50 p-4">
              <p className="mb-3 text-xs text-neutral-500">
                تاریخ ساخت:{" "}
                <span dir="ltr" className="font-mono">
                  {preview.createdAt.slice(0, 19).replace("T", " ")}
                </span>
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {Object.entries(SECTION_LABELS).map(([key, label]) => (
                  <div key={key} className="rounded-lg bg-white p-3 text-center shadow-sm">
                    <div className="text-lg font-bold text-[#8f1d1d]">{preview.counts[key] ?? 0}</div>
                    <div className="text-xs text-neutral-600">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {backupJson && (
            <>
              <div className="mt-5 space-y-3">
                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-neutral-200 p-4 transition hover:bg-gray-50">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "merge"}
                    onChange={() => {
                      setMode("merge");
                      resetRestoreState();
                    }}
                    className="mt-1"
                  />
                  <span>
                    <span className="block text-sm font-bold text-neutral-800">
                      ادغام با داده‌های فعلی (پیشنهاد می‌شود)
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-neutral-600">
                      رکوردهای موجود به‌روزرسانی و رکوردهای جدید اضافه می‌شوند. هیچ داده‌ای حذف
                      نمی‌شود.
                    </span>
                  </span>
                </label>

                <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-red-200 bg-red-50/40 p-4 transition hover:bg-red-50">
                  <input
                    type="radio"
                    name="mode"
                    checked={mode === "replace"}
                    onChange={() => {
                      setMode("replace");
                      resetRestoreState();
                    }}
                    className="mt-1"
                  />
                  <span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-red-700">
                      <ShieldAlert className="h-4 w-4" />
                      جایگزینی کامل (خطرناک)
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-red-600">
                      تمام مطالب، نظرات، محتوای صفحات و پیام‌های فعلی حذف و با محتوای فایل پشتیبان
                      جایگزین می‌شوند. این عمل قابل بازگشت نیست.
                    </span>
                  </span>
                </label>
              </div>

              {mode === "replace" && (
                <div className="mt-4">
                  <label className="mb-1 block text-xs font-medium text-neutral-700">
                    برای تأیید، عبارت <span dir="ltr" className="font-mono font-bold">REPLACE</span> را
                    وارد کنید
                  </label>
                  <input
                    type="text"
                    dir="ltr"
                    value={confirmText}
                    onChange={(e) => setConfirmText(e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-red-300 px-4 py-2 text-left font-mono text-sm focus:border-red-500 focus:outline-none"
                    placeholder="REPLACE"
                  />
                </div>
              )}

              <button
                type="button"
                onClick={handleRestore}
                disabled={restoring || replaceBlocked}
                className={`mt-5 inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  mode === "replace" ? "bg-red-600 hover:bg-red-700" : "bg-[#8f1d1d] hover:bg-[#6b1616]"
                }`}
              >
                {restoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
                {restoring ? "در حال بازگردانی..." : "شروع بازگردانی"}
              </button>
            </>
          )}

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {error}
            </p>
          )}

          {report && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="mb-3 flex items-center gap-2 text-sm font-bold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                بازگردانی با موفقیت انجام شد.
              </p>
              <ul className="space-y-1.5 text-xs text-green-800">
                <li>
                  {SECTION_LABELS.blogPosts}: {report.blogPosts.created} جدید، {report.blogPosts.updated}{" "}
                  به‌روزرسانی
                </li>
                <li>
                  {SECTION_LABELS.comments}: {report.comments.created} جدید، {report.comments.updated}{" "}
                  به‌روزرسانی
                  {report.comments.skipped > 0 && `، ${report.comments.skipped} نادیده گرفته‌شده`}
                </li>
                <li>
                  {SECTION_LABELS.sitePageContent}: {report.sitePageContent.created} جدید،{" "}
                  {report.sitePageContent.updated} به‌روزرسانی
                </li>
                <li>
                  {SECTION_LABELS.contactMessages}: {report.contactMessages.created} جدید،{" "}
                  {report.contactMessages.updated} به‌روزرسانی
                </li>
              </ul>
              {report.warnings.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-green-200 pt-3 text-xs text-amber-700">
                  {report.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>

        {/* ── Uploaded media ── */}
        <section className="mt-6 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="mb-2 flex items-center gap-2 text-base font-bold text-neutral-800">
            <Images className="h-5 w-5 text-[#8f1d1d]" />
            تصاویر آپلودشده
          </h2>
          <p className="mb-5 text-sm leading-relaxed text-neutral-600">
            تصاویر پوشه public/home/blog/ در قالب یک فایل ZIP استاندارد دانلود می‌شوند و از همان
            فایل قابل بازگردانی هستند.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleMediaBackup}
              disabled={mediaBusy !== null}
              className="inline-flex items-center gap-2 rounded-lg bg-[#8f1d1d] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#6b1616] disabled:opacity-50"
            >
              {mediaBusy === "backup" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {mediaBusy === "backup" ? "در حال آماده‌سازی..." : "پشتیبان‌گیری تصاویر"}
            </button>

            <button
              type="button"
              onClick={() => mediaFileRef.current?.click()}
              disabled={mediaBusy !== null}
              className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition hover:bg-gray-50 disabled:opacity-50"
            >
              {mediaBusy === "restore" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              {mediaBusy === "restore" ? "در حال بازگردانی..." : "بازگردانی تصاویر"}
            </button>

            <input
              ref={mediaFileRef}
              type="file"
              accept="application/zip,.zip"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleMediaRestore(file);
              }}
            />
          </div>

          <label className="mt-4 flex w-fit cursor-pointer items-center gap-2 text-xs text-neutral-600">
            <input
              type="checkbox"
              checked={mediaOverwrite}
              onChange={(e) => setMediaOverwrite(e.target.checked)}
            />
            فایل‌های هم‌نام موجود جایگزین شوند
          </label>

          {mediaError && (
            <p className="mt-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
              {mediaError}
            </p>
          )}

          {mediaReport && (
            <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-4">
              <p className="mb-2 flex items-center gap-2 text-sm font-bold text-green-700">
                <CheckCircle2 className="h-4 w-4" />
                {mediaReport.restored} تصویر بازگردانی شد
                {mediaReport.overwritten > 0 && `، ${mediaReport.overwritten} تصویر جایگزین شد`}.
              </p>
              {mediaReport.skipped.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-green-200 pt-3 text-xs text-amber-700">
                  {mediaReport.skipped.map((item) => (
                    <li key={item.name} className="flex flex-wrap items-center gap-1">
                      <span dir="ltr" className="font-mono">
                        {item.name}
                      </span>
                      <span>— {item.reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
