// app/admin/components/PostJsonImport.tsx
"use client";

import { useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Download, FileJson } from "lucide-react";

export type PostFormPatch = {
  titleFa: string;
  titleEn: string;
  slug: string;
  categoryFa: string;
  categoryEn: string;
  categorySlug: string;
  excerptFa: string;
  excerptEn: string;
  contentFa: string;
  contentEn: string;
  image: string;
  imageWidth: number;
  imageHeight: number;
  authorFa: string;
  authorEn: string;
  published: boolean;
};

export type CategoryOption = { nameFa: string; nameEn: string; slug: string };

type PostJsonImportProps = {
  categories: CategoryOption[];
  onImport: (patch: Partial<PostFormPatch>) => void;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function str(value: unknown): string {
  if (typeof value === "string") return value.trim();
  if (typeof value === "number") return String(value);
  return "";
}

function num(value: unknown): number | null {
  const parsed = typeof value === "string" ? parseInt(value, 10) : value;
  return typeof parsed === "number" && Number.isFinite(parsed) ? parsed : null;
}

function bool(value: unknown): boolean | null {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

/** Accepts { fa, en } objects, a bare string (treated as Persian), or flat fa/en keys. */
function pair(nested: unknown, flatFa: unknown, flatEn: unknown) {
  if (typeof nested === "string") {
    return { fa: nested.trim(), en: str(flatEn) };
  }
  const obj = isRecord(nested) ? nested : {};
  return {
    fa: str(obj.fa) || str(flatFa),
    en: str(obj.en) || str(flatEn),
  };
}

function slugify(value: string) {
  return value
    // hyphens are kept so an explicit slug like "why-we-use-corn" survives intact
    .replace(/[^\w؀-ۿ\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

export function mapJsonToForm(raw: unknown, categories: CategoryOption[]) {
  const warnings: string[] = [];

  if (!isRecord(raw)) {
    return { patch: null as Partial<PostFormPatch> | null, warnings: ["ساختار فایل JSON معتبر نیست."] };
  }

  const patch: Partial<PostFormPatch> = {};

  const title = pair(raw.title, raw.titleFa, raw.titleEn);
  if (title.fa) patch.titleFa = title.fa;
  if (title.en) patch.titleEn = title.en;
  if (!title.fa) warnings.push("عنوان فارسی در فایل نبود.");
  if (!title.en) warnings.push("عنوان انگلیسی در فایل نبود.");

  const excerpt = pair(raw.excerpt, raw.excerptFa, raw.excerptEn);
  if (excerpt.fa) patch.excerptFa = excerpt.fa;
  if (excerpt.en) patch.excerptEn = excerpt.en;

  const content = pair(raw.content, raw.contentFa, raw.contentEn);
  if (content.fa) patch.contentFa = content.fa;
  if (content.en) patch.contentEn = content.en;
  if (!content.fa) warnings.push("محتوای فارسی در فایل نبود.");

  const author = pair(raw.author, raw.authorFa, raw.authorEn);
  if (author.fa) patch.authorFa = author.fa;
  if (author.en) patch.authorEn = author.en;

  // Slug: explicit value wins, otherwise it is generated from the Persian title.
  const slug = str(raw.slug);
  if (slug) {
    patch.slug = slugify(slug);
  } else if (title.fa) {
    patch.slug = slugify(title.fa);
    warnings.push("slug در فایل نبود و از روی عنوان فارسی ساخته شد.");
  }

  // Category must line up with the dropdown, so it is matched by slug → fa → en.
  const categoryRaw = isRecord(raw.category) ? raw.category : {};
  const categorySlug = str(categoryRaw.slug) || str(raw.categorySlug);
  const categoryFa = typeof raw.category === "string" ? str(raw.category) : str(categoryRaw.fa) || str(raw.categoryFa);
  const categoryEn = str(categoryRaw.en) || str(raw.categoryEn);

  const match =
    categories.find((c) => c.slug === categorySlug) ??
    categories.find((c) => c.nameFa === categoryFa) ??
    categories.find((c) => c.nameEn.toLowerCase() === categoryEn.toLowerCase());

  if (match) {
    patch.categoryFa = match.nameFa;
    patch.categoryEn = match.nameEn;
    patch.categorySlug = match.slug;
  } else if (categorySlug || categoryFa || categoryEn) {
    warnings.push(
      `دسته‌بندی «${categoryFa || categoryEn || categorySlug}» در فهرست موجود نیست؛ لطفاً دستی انتخاب کنید.`,
    );
  } else {
    warnings.push("دسته‌بندی در فایل نبود؛ لطفاً دستی انتخاب کنید.");
  }

  // Image: either a plain path or { url, width, height }.
  const imageRaw = raw.image;
  const imageObj = isRecord(imageRaw) ? imageRaw : {};
  const imageUrl = typeof imageRaw === "string" ? str(imageRaw) : str(imageObj.url) || str(imageObj.src);
  if (imageUrl) patch.image = imageUrl;

  const width = num(imageObj.width) ?? num(raw.imageWidth);
  const height = num(imageObj.height) ?? num(raw.imageHeight);
  if (width) patch.imageWidth = width;
  if (height) patch.imageHeight = height;

  const published = bool(raw.published);
  if (published !== null) patch.published = published;

  return { patch, warnings };
}

// Invisible characters that RTL editors, Word and Notepad like to put around
// copied text. They are only stripped from the edges — ZWNJ (نیم‌فاصله) inside
// the Persian strings must survive untouched.
const EDGE_JUNK =
  /^[\uFEFF\u200E\u200F\u202A-\u202E\u2066-\u2069\s]+|[\uFEFF\u200E\u200F\u202A-\u202E\u2066-\u2069\s]+$/g;

/** Makes a pasted payload parseable: drops BOM/bidi marks and ```json fences. */
export function normalizeJsonText(input: string) {
  let text = input.replace(EDGE_JUNK, "");

  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  if (fenced) {
    text = fenced[1].replace(EDGE_JUNK, "");
  }

  return text;
}

const TEMPLATE = {
  title: { fa: "", en: "" },
  slug: "",
  category: { slug: "badanim", fa: "بدانیم", en: "Know" },
  author: { fa: "", en: "" },
  excerpt: { fa: "", en: "" },
  content: { fa: "<p></p>", en: "<p></p>" },
  image: { url: "/home/blog/example.jpg", width: 800, height: 600 },
  published: true,
};

export function PostJsonImport({ categories, onImport }: PostJsonImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"file" | "paste">("file");
  const [pasted, setPasted] = useState("");
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [filledCount, setFilledCount] = useState<number | null>(null);

  const applyText = (rawText: string) => {
    setError(null);
    setWarnings([]);
    setFilledCount(null);

    const text = normalizeJsonText(rawText);

    if (!text) {
      setError("متنی وارد نشده است.");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(text);
    } catch (parseError) {
      // Bad paste is expected input, not a bug — show it inline and stay quiet in
      // the console, otherwise Next's dev overlay treats it as a crash.
      const hint = text.startsWith("{")
        ? ""
        : ` متن باید با { شروع شود، اما با «${text.slice(0, 12)}…» شروع شده است.`;
      setError(
        (parseError instanceof Error
          ? `JSON معتبر نیست: ${parseError.message}`
          : "JSON معتبر نیست. لطفاً ساختار آن را بررسی کنید.") + hint,
      );
      return;
    }

    const { patch, warnings: issues } = mapJsonToForm(parsed, categories);

    if (!patch || Object.keys(patch).length === 0) {
      setError("هیچ فیلد قابل استفاده‌ای پیدا نشد.");
      setWarnings(issues);
      return;
    }

    onImport(patch);
    setFilledCount(Object.keys(patch).length);
    setWarnings(issues);
  };

  const handleFile = async (file: File) => {
    const text = await file.text();
    applyText(text);

    if (inputRef.current) inputRef.current.value = "";
  };

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "blog-post-template.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileJson className="h-5 w-5 text-[#8f1d1d]" />
          <h2 className="text-sm font-bold text-neutral-800">پر کردن فرم از روی JSON</h2>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-gray-50"
        >
          <Download className="h-3.5 w-3.5" />
          دریافت فایل نمونه
        </button>
      </div>

      {/* Mode switcher: upload a file or paste the JSON directly */}
      <div className="mb-3 inline-flex rounded-lg border border-neutral-200 bg-gray-50 p-1">
        {(
          [
            { key: "file", label: "آپلود فایل" },
            { key: "paste", label: "چسباندن متن" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setMode(tab.key)}
            className={`rounded-md px-4 py-1.5 text-xs font-bold transition ${
              mode === tab.key
                ? "bg-white text-[#8f1d1d] shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === "paste" ? (
        <div className="space-y-3">
          <textarea
            dir="ltr"
            rows={10}
            value={pasted}
            onChange={(e) => setPasted(e.target.value)}
            onPaste={(e) => {
              // Fill immediately when the whole payload is pasted into an empty box.
              const text = e.clipboardData.getData("text");
              if (text && !pasted.trim()) {
                e.preventDefault();
                setPasted(text);
                applyText(text);
              }
            }}
            className="w-full rounded-lg border border-neutral-300 bg-gray-50 px-4 py-3 text-left font-mono text-xs leading-relaxed focus:border-[#8f1d1d] focus:outline-none"
            placeholder='{ "title": { "fa": "...", "en": "..." }, ... }'
          />
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => applyText(pasted)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#8f1d1d] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6b1616]"
            >
              <FileJson className="h-4 w-4" />
              پر کردن فرم
            </button>
            <button
              type="button"
              onClick={() => {
                setPasted("");
                setError(null);
                setWarnings([]);
                setFilledCount(null);
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-gray-300"
            >
              پاک کردن
            </button>
            <button
              type="button"
              onClick={() => setPasted(JSON.stringify(TEMPLATE, null, 2))}
              className="text-xs font-medium text-neutral-500 underline-offset-2 hover:text-neutral-700 hover:underline"
            >
              قرار دادن ساختار نمونه
            </button>
          </div>
        </div>
      ) : (
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          const file = e.dataTransfer.files?.[0];
          if (file) void handleFile(file);
        }}
        className={`flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-5 text-center transition ${
          dragging ? "border-[#8f1d1d] bg-[#8f1d1d]/5" : "border-neutral-300 bg-gray-50"
        }`}
      >
        <p className="text-sm text-neutral-600">
          فایل JSON را اینجا رها کنید یا از دکمه زیر انتخاب کنید
        </p>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg bg-[#8f1d1d] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#6b1616]"
        >
          <FileJson className="h-4 w-4" />
          انتخاب فایل JSON
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
          }}
        />
      </div>
      )}

      {filledCount !== null && (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
          <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
          {filledCount} فیلد پر شد. لطفاً بررسی و سپس ذخیره کنید.
        </p>
      )}

      {error && (
        <p className="mt-3 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600">
          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}

      {warnings.length > 0 && (
        <ul className="mt-3 space-y-1 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
          {warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
              {warning}
            </li>
          ))}
        </ul>
      )}

      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-medium text-neutral-600 hover:text-neutral-800">
          ساختار فایل JSON
        </summary>
        <pre
          dir="ltr"
          className="mt-2 overflow-x-auto rounded-lg bg-neutral-900 p-4 text-left font-mono text-[11px] leading-relaxed text-neutral-100"
        >
{JSON.stringify(TEMPLATE, null, 2)}
        </pre>
        <p className="mt-2 text-xs text-neutral-500">
          مقدارهای <span dir="ltr" className="font-mono">content</span> می‌توانند شامل تگ‌های HTML باشند. اگر{" "}
          <span dir="ltr" className="font-mono">slug</span> خالی باشد از روی عنوان فارسی ساخته می‌شود. تصویر باید
          از قبل آپلود شده باشد و مسیر آن مثل{" "}
          <span dir="ltr" className="font-mono">/home/blog/name.jpg</span> وارد شود.
        </p>
      </details>
    </div>
  );
}
