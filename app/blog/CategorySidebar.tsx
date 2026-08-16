// app/blog/CategorySidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/blog-data";
import { Locale } from "@/lib/i18n";

interface CategorySidebarProps {
  categories: Category[];
  horizontal?: boolean;
  locale: Locale;
  commonContent?: Record<string, any>;
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

export function CategorySidebar({ categories, horizontal = false, locale, commonContent }: CategorySidebarProps) {
  const pathname = usePathname();
  const t = commonContent ?? {};
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
            className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-300 hover:-translate-y-0.5 ${
              pathname === "/blog"
                ? "bg-leaf-600 !text-white shadow-glow"
                : "border border-line bg-surface text-ink-soft shadow-soft hover:border-leaf-300 hover:text-leaf-700"
            }`}
          >
            {t.allPosts}
            <span className="ms-1 text-[11px] opacity-70">({totalPosts})</span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}${localeQuery}`}
              className={`whitespace-nowrap rounded-full px-4 py-2.5 text-[13px] font-bold transition-all duration-300 hover:-translate-y-0.5 ${
                isCategoryActive(cat.slug)
                  ? "bg-leaf-600 !text-white shadow-glow"
                  : "border border-line bg-surface text-ink-soft shadow-soft hover:border-leaf-300 hover:text-leaf-700"
              }`}
            >
              {getCategoryName(cat, locale)}
              <span className="ms-1 text-[11px] opacity-70">({cat.count})</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Vertical sidebar (if used)
  return (
    <div className="mb-8 rounded-card-lg border border-line bg-surface p-6 shadow-soft">
      <h3 className="mb-4 border-s-4 border-corn-400 ps-3 text-xl font-black text-ink">
        {t.category}
      </h3>
      <ul className="space-y-2">
        <li>
          <Link
            href={`/blog${localeQuery}`}
            className={`flex items-center justify-between rounded-tile px-3 py-2.5 text-[13.5px] transition ${
              pathname === "/blog"
                ? "bg-leaf-50 font-bold text-leaf-700"
                : "text-ink-soft hover:bg-leaf-50 hover:text-leaf-700"
            }`}
          >
            <span>{t.allPosts}</span>
            <span className="text-sm text-ink-mute">({totalPosts})</span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/blog/category/${cat.slug}${localeQuery}`}
              className={`flex items-center justify-between rounded-tile px-3 py-2.5 text-[13.5px] transition ${
                isCategoryActive(cat.slug)
                  ? "bg-leaf-50 font-bold text-leaf-700"
                  : "text-ink-soft hover:bg-leaf-50 hover:text-leaf-700"
              }`}
            >
              <span>{getCategoryName(cat, locale)}</span>
              <span className="text-sm text-ink-mute">({cat.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}