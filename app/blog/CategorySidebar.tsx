// app/blog/CategorySidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Category } from "@/lib/blog-data";

interface CategorySidebarProps {
  categories: Category[];
  horizontal?: boolean;
}

export function CategorySidebar({ categories, horizontal = false }: CategorySidebarProps) {
  const pathname = usePathname();
  
  const isCategoryActive = (categorySlug: string) => {
    return pathname === `/blog/category/${categorySlug}`;
  };

  // Calculate total posts count
  const totalPosts = categories.reduce((sum, cat) => sum + cat.count, 0);

  // Horizontal layout (flex row)
  if (horizontal) {
    return (
      <div className="w-full">
        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
          <Link
            href="/blog"
            className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
              pathname === "/blog"
                ? "bg-[#8f1d1d] !text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-[#8f1d1d]/10 hover:text-[#8f1d1d]"
            }`}
          >
            همه مطالب
            <span className="mr-1 text-xs opacity-75">({totalPosts})</span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/blog/category/${cat.slug}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition whitespace-nowrap ${
                isCategoryActive(cat.slug)
                  ? "bg-[#8f1d1d] !text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-[#8f1d1d]/10 hover:text-[#8f1d1d]"
              }`}
            >
              {cat.name}
              <span className="mr-1 text-xs opacity-75">({cat.count})</span>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Vertical layout (original sidebar style - used in category pages)
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
                ? "bg-[#8f1d1d]/10 !text-[#8f1d1d] font-medium"
                : "text-neutral-700 hover:bg-[#8f1d1d]/5 hover:text-[#8f1d1d]"
            }`}
          >
            <span>همه مطالب</span>
            <span className="text-sm text-neutral-400">({totalPosts})</span>
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/blog/category/${cat.slug}`}
              className={`flex items-center justify-between rounded-lg p-2 transition ${
                isCategoryActive(cat.slug)
                  ? "bg-[#8f1d1d]/10 !text-[#8f1d1d] font-medium"
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