// app/blog/Pagination.tsx
import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath?: string;
}

export function Pagination({ currentPage, totalPages, basePath = "/blog" }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-12 flex justify-center gap-2">
      {currentPage > 1 && (
        <Link
          href={currentPage === 2 ? basePath : `${basePath}/page/${currentPage - 1}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-100 px-4 text-neutral-700 transition hover:bg-[#8f1d1d] hover:text-white"
        >
          &raquo; قبلی
        </Link>
      )}

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
        if (page === 1 && currentPage === 1) {
          return (
            <span
              key={page}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#8f1d1d] text-white"
            >
              {page}
            </span>
          );
        }

        if (page === currentPage) {
          return (
            <span
              key={page}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#8f1d1d] text-white"
            >
              {page}
            </span>
          );
        }

        return (
          <Link
            key={page}
            href={page === 1 ? basePath : `${basePath}/page/${page}`}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 transition hover:bg-[#8f1d1d] hover:text-white"
          >
            {page}
          </Link>
        );
      })}

      {currentPage < totalPages && (
        <Link
          href={`${basePath}/page/${currentPage + 1}`}
          className="inline-flex h-10 items-center justify-center rounded-full bg-neutral-100 px-4 text-neutral-700 transition hover:bg-[#8f1d1d] hover:text-white"
        >
          بعدی &laquo;
        </Link>
      )}
    </div>
  );
}