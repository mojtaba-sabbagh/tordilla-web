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
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-100 px-4 text-neutral-700 transition hover:bg-[#ce4a28] hover:text-white"
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
            className={`inline-flex h-10 w-10 items-center justify-center rounded-full transition ${
              isActive
                ? "bg-[#ce4a28] text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-[#ce4a28] hover:text-white"
            }`}
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}/page/${currentPage + 1}${localeQuery}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-100 px-4 text-neutral-700 transition hover:bg-[#ce4a28] hover:text-white"
        >
          {t.next}
        </Link>
      )}
    </div>
  );
}