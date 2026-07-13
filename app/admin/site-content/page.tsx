"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Save } from "lucide-react";
import AdminNav from "../components/AdminNav";

interface SitePageItem {
  pageKey: string;
  title: string;
  contentByLanguage: {
    fa: Record<string, unknown>;
    en: Record<string, unknown>;
  };
}

type LocaleOption = "fa" | "en";

type EditableValue = string | number | boolean | null | EditableValue[] | Record<string, EditableValue>;

const localeLabels: Record<LocaleOption, string> = {
  fa: "فارسی",
  en: "English",
};

const pageLabels: Record<string, string> = {
  common: "General UI",
  nav: "Navigation",
  footer: "Footer",
  about: "About Page",
  contact: "Contact Page",
  products: "Products Page",
  productDetail: "Product Detail Page",
  home: "Home Page",
  blog: "Blog Page",
  agency: "Agency Page",
  shop: "Shop Page",
  tordillaFinder: "Tordilla Finder Page",
  cinema: "Cinema Page",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function cloneValue(value: unknown): unknown {
  return JSON.parse(JSON.stringify(value));
}

function FieldEditor({
  value,
  path,
  onChange,
}: {
  value: EditableValue;
  path: string[];
  onChange: (path: string[], value: EditableValue) => void;
}) {
  if (typeof value === "string") {
    return (
      <textarea
        value={value ?? ""}
        onChange={(event) => onChange(path, event.target.value)}
        className="w-full min-h-[90px] rounded-xl border border-neutral-300 px-3 py-2 text-sm"
      />
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        value={value ?? ""}
        onChange={(event) => onChange(path, Number(event.target.value))}
        className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(path, event.target.checked)}
          className="h-4 w-4"
        />
        {path[path.length - 1]}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-3 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-3">
        {value.map((item, index) => (
          <div key={`${path.join(".")}-${index}`} className="space-y-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-500">{path.join(".")} [{index}]</div>
            <FieldEditor value={item as EditableValue} path={[...path, String(index)]} onChange={onChange} />
          </div>
        ))}
      </div>
    );
  }

  if (isRecord(value)) {
    return (
      <div className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-4">
        {Object.entries(value).map(([key, childValue]) => (
          <div key={key} className="space-y-2">
            <div className="text-sm font-semibold text-neutral-700">{key}</div>
            <FieldEditor value={childValue as EditableValue} path={[...path, key]} onChange={onChange} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <input
      type="text"
      value={String(value ?? "")}
      onChange={(event) => onChange(path, event.target.value)}
      className="w-full rounded-xl border border-neutral-300 px-3 py-2 text-sm"
    />
  );
}

export default function SiteContentAdminPage() {
  const router = useRouter();
  const [pages, setPages] = useState<SitePageItem[]>([]);
  const [selectedPageKey, setSelectedPageKey] = useState<string>("");
  const [activeLanguage, setActiveLanguage] = useState<LocaleOption>("fa");
  const [selectedContent, setSelectedContent] = useState<{ fa: Record<string, unknown>; en: Record<string, unknown> }>({
    fa: {},
    en: {},
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  useEffect(() => {
    if (!pages.length) {
      return;
    }

    if (!selectedPageKey || !pages.some((page) => page.pageKey === selectedPageKey)) {
      setSelectedPageKey(pages[0].pageKey);
    }
  }, [pages, selectedPageKey]);

  useEffect(() => {
    const selectedPage = pages.find((page) => page.pageKey === selectedPageKey);
    if (selectedPage) {
      setSelectedContent({
        fa: cloneValue(selectedPage.contentByLanguage.fa) as Record<string, unknown>,
        en: cloneValue(selectedPage.contentByLanguage.en) as Record<string, unknown>,
      });
    }
  }, [pages, selectedPageKey]);

  const currentPage = useMemo(
    () => pages.find((page) => page.pageKey === selectedPageKey),
    [pages, selectedPageKey],
  );

  const loadPages = async () => {
    try {
      const response = await fetch("/api/admin/site-content");
      if (response.status === 401) {
        router.push("/admin/login");
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to load page content");
      }

      const data = await response.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error(error);
      alert("خطا در بارگذاری محتوا");
    } finally {
      setLoading(false);
    }
  };

  const updateValue = (path: string[], value: EditableValue) => {
    const isNumeric = (segment: string) => /^\\d+$/.test(segment);

    setSelectedContent((prev) => {
      const next = {
        fa: cloneValue(prev.fa) as Record<string, unknown>,
        en: cloneValue(prev.en) as Record<string, unknown>,
      };

      const target = next[activeLanguage] as Record<string, unknown>;
      let current: unknown = target;
      const parentPath = path.slice(0, -1);

      for (const segment of parentPath) {
        if (Array.isArray(current)) {
          const index = Number(segment);
          if (!Number.isInteger(index)) {
            return prev;
          }

          if (current[index] === undefined) {
            current[index] = {};
          }

          current = current[index];
          continue;
        }

        if (!isRecord(current)) {
          return prev;
        }

        if (!(segment in current)) {
          current[segment] = isNumeric(segment) ? [] : {};
        }

        current = current[segment];
      }

      const lastSegment = path[path.length - 1];

      if (Array.isArray(current)) {
        const index = Number(lastSegment);
        if (!Number.isInteger(index)) {
          return prev;
        }

        current[index] = value;
        return next;
      }

      if (!isRecord(current)) {
        return prev;
      }

      current[lastSegment] = value;
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedPageKey) {
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/site-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageKey: selectedPageKey,
          language: activeLanguage,
          content: selectedContent[activeLanguage],
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save content");
      }

      await loadPages();
      alert("تغییرات با موفقیت ذخیره شد.");
    } catch (error) {
      console.error(error);
      alert("خطا در ذخیره‌ی محتوا");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNav />
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-[#8f1d1d]" />
            <p className="mt-4 text-neutral-600">در حال بارگذاری محتوا...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-[#8f1d1d]">مدیریت محتوا</h1>
              <p className="mt-1 text-sm text-neutral-600">برای هر صفحه و هر زبان، فیلدهای قابل ویرایش ایجاد شده‌اند.</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <select
                value={selectedPageKey}
                onChange={(event) => setSelectedPageKey(event.target.value)}
                className="rounded-xl border border-neutral-300 px-3 py-2 text-sm"
              >
                {pages.map((page) => (
                  <option key={page.pageKey} value={page.pageKey}>
                    {pageLabels[page.pageKey] ?? page.title}
                  </option>
                ))}
              </select>
              <div className="flex rounded-xl border border-neutral-300 bg-white p-1">
                {(["fa", "en"] as LocaleOption[]).map((locale) => (
                  <button
                    key={locale}
                    type="button"
                    onClick={() => setActiveLanguage(locale)}
                    className={`rounded-lg px-3 py-2 text-sm font-medium ${activeLanguage === locale ? "bg-[#8f1d1d] text-white" : "text-neutral-700"}`}
                  >
                    {localeLabels[locale]}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl bg-[#8f1d1d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#6f1717] disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)]">
          <aside className="rounded-2xl bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-semibold text-neutral-700">
              <FileText className="h-4 w-4 text-[#8f1d1d]" />
              صفحات
            </div>
            <div className="space-y-2">
              {pages.map((page) => (
                <button
                  key={page.pageKey}
                  type="button"
                  onClick={() => setSelectedPageKey(page.pageKey)}
                  className={`w-full rounded-xl px-3 py-2 text-right text-sm transition ${selectedPageKey === page.pageKey ? "bg-[#8f1d1d]/10 text-[#8f1d1d]" : "bg-neutral-50 text-neutral-700 hover:bg-neutral-100"}`}
                >
                  {pageLabels[page.pageKey] ?? page.title}
                </button>
              ))}
            </div>
          </aside>

          <section className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-6 border-b border-neutral-200 pb-4">
              <h2 className="text-xl font-bold text-[#2c1810]">{(pageLabels[currentPage?.pageKey ?? ''] ?? currentPage?.title) || "صفحه"}</h2>
              <p className="mt-1 text-sm text-neutral-600">در حال ویرایش محتوا برای {localeLabels[activeLanguage]}</p>
            </div>

            <div className="space-y-6">
              {selectedContent[activeLanguage] && typeof selectedContent[activeLanguage] === "object" ? (
                Object.entries(selectedContent[activeLanguage] as Record<string, unknown>).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="text-sm font-semibold text-neutral-700">{key}</div>
                    <FieldEditor value={value as EditableValue} path={[key]} onChange={updateValue} />
                  </div>
                ))
              ) : (
                <FieldEditor value={selectedContent[activeLanguage] as EditableValue} path={["content"]} onChange={updateValue} />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
