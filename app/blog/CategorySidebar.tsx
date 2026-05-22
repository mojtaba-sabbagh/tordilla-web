// app/blog/CategorySidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/blog-data";
import { Locale, translations } from "@/lib/i18n";

interface CategorySidebarProps {
  categories: Category[];
  horizontal?: boolean;
  locale: Locale;
}

function getCategoryName(category: Category, locale: Locale): string {
  const name = category.name;
  // If it's a string, try to parse as JSON
  if (typeof name === "string") {
    try {
      const parsed = JSON.parse(name);
      if (parsed && typeof parsed === "object") {
        return parsed[locale] || parsed.fa || Object.values(parsed)[0] || name;
      }
    } catch {
      return name;
    }
    return name;
  }
  // If it's an object
  if (name && typeof name === "object") {
    const obj = name as Record<string, string>;
    return obj[locale] || obj.fa || Object.values(obj)[0] || "";
  }
  return String(name);
}

export function CategorySidebar({ categories, horizontal = false, locale }: CategorySidebarProps) {
  const pathname = usePathname();
  const t = translations[locale].common;
  const localeQuery = `?lang=${locale}`;

  const isCategoryActive = (categorySlug: string) => {
    return pathname === `/blog/category/${categorySlug}`;
  };

  const totalPosts = categories.reduce((sum, cat) => sum + cat.count, 0);

  if (horizontal) {
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <Link
            href={`/blog${localeQuery}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              pathname === "/blog"
                ? "bg-[#8f1d1d] !text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-[#8f1d1d]/10 hover:text-[#8f1d1d]"
            }`}
          >
            {t.allPosts}
            <span className="mr-1 text-xs opacity-75">({totalPosts})</span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}${localeQuery}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                isCategoryActive(cat.slug)
                  ? "bg-[#8f1d1d] !text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-[#8f1d1d]/10 hover:text-[#8f1d1d]"
              }`}
            >
              {getCategoryName(cat, locale)}
              <span className="mr-1 text-xs opacity-75">({cat.count})</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Vertical sidebar (if used)
  return (
    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-[#8f1d1d] border-r-4 border-[#8f1d1d] pr-3">
        {t.category}
      </h3>
      <ul className="space-y-2">
        <li>
          <Link
            href={`/blog${localeQuery}`}
            className={`flex items-center justify-between rounded-lg p-2 transition ${
              pathname === "/blog"
                ? "bg-[#8f1d1d]/10 text-[#8f1d1d] font-medium"
                : "text-neutral-700 hover:bg-[#8f1d1d]/5 hover:text-[#8f1d1d]"
            }`}
          >
            <span>{t.allPosts}</span>
            <span className="text-sm text-neutral-400">({totalPosts})</span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/blog/category/${cat.slug}${localeQuery}`}
              className={`flex items-center justify-between rounded-lg p-2 transition ${
                isCategoryActive(cat.slug)
                  ? "bg-[#8f1d1d]/10 text-[#8f1d1d] font-medium"
                  : "text-neutral-700 hover:bg-[#8f1d1d]/5 hover:text-[#8f1d1d]"
              }`}
            >
              <span>{getCategoryName(cat, locale)}</span>
              <span className="text-sm text-neutral-400">({cat.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}