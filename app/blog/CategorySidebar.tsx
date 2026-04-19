// app/blog/CategorySidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/blog-data";

interface CategorySidebarProps {
  categories: Category[];
}

export function CategorySidebar({ categories }: CategorySidebarProps) {
  const pathname = usePathname();
  
  // Check if we're on a category page
  const isCategoryActive = (categorySlug: string) => {
    return pathname === `/blog/category/${categorySlug}`;
  };

  return (
    <div className="mb-8 rounded-2xl border border-neutral-200 bg-white p-6 shadow-md">
      <h3 className="mb-4 text-xl font-bold text-[#8f1d1d] border-r-4 border-[#8f1d1d] pr-3">
        دسته بندی
      </h3>
      <ul className="space-y-2">
        <li>
          <Link
            href="/blog"
            className={`flex items-center justify-between rounded-lg p-2 transition ${
              pathname === "/blog"
                ? "bg-[#8f1d1d]/10 text-[#8f1d1d] font-medium"
                : "text-neutral-700 hover:bg-[#8f1d1d]/5 hover:text-[#8f1d1d]"
            }`}
          >
            <span>همه مطالب</span>
            <span className="text-sm text-neutral-400">({categories.reduce((sum, cat) => sum + cat.count, 0)})</span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/blog/category/${cat.slug}`}
              className={`flex items-center justify-between rounded-lg p-2 transition ${
                isCategoryActive(cat.slug)
                  ? "bg-[#8f1d1d]/10 text-[#8f1d1d] font-medium"
                  : "text-neutral-700 hover:bg-[#8f1d1d]/5 hover:text-[#8f1d1d]"
              }`}
            >
              <span>{cat.name}</span>
              <span className="text-sm text-neutral-400">({cat.count})</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}