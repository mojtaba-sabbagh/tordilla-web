// app/blog/Pagination.tsx
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
  locale: Locale;
}

export async function Pagination({ currentPage, totalPages, basePath = "/blog", locale }: PaginationProps) {
  if (totalPages <= 1) return null;

  const content = await getSiteTranslations(locale);
  const t = content.common as Record<string, any>;
  const localeQuery = `?lang=${locale}`;

  return (
    <div className="flex justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={`${currentPage === 2 ? basePath : `${basePath}/page/${currentPage - 1}`}${localeQuery}`}
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-[13px] font-bold text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:border-leaf-300 hover:text-leaf-700"
        >
          {t.previous}
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        const isActive = page === currentPage;
        return (
          <Link
            key={page}
            href={`${page === 1 ? basePath : `${basePath}/page/${page}`}${localeQuery}`}
            className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-[13px] font-bold transition-all ${
              isActive
                ? "bg-leaf-600 text-white shadow-glow"
                : "border border-line bg-surface text-ink-soft shadow-soft hover:-translate-y-0.5 hover:border-leaf-300 hover:text-leaf-700"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}/page/${currentPage + 1}${localeQuery}`}
          className="inline-flex h-11 items-center justify-center rounded-full border border-line bg-surface px-5 text-[13px] font-bold text-ink-soft shadow-soft transition-all hover:-translate-y-0.5 hover:border-leaf-300 hover:text-leaf-700"
        >
          {t.next}
        </Link>
      )}
    </div>
  );
}