// app/blog/BlogPostsGrid.tsx
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog-data";
import { Locale, translations } from "@/lib/i18n";

interface BlogPostsGridProps {
  posts: BlogPost[];
  locale: Locale;
}

// Safely extract localized text from string, JSON string, or object
function getLocalizedText(value: unknown, locale: Locale): string {
  // If it's a string, try to parse as JSON
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed[locale] || parsed.fa || Object.values(parsed)[0] || value;
      }
    } catch {
      // Not JSON, return as is
      return value;
    }
    return value;
  }
  // If it's an object
  if (value && typeof value === "object") {
    const obj = value as Record<string, string>;
    return obj[locale] || obj.fa || Object.values(obj)[0] || "";
  }
  return String(value);
}

export function BlogPostsGrid({ posts, locale }: BlogPostsGridProps) {
  const t = translations[locale].blog;
  const noPostsText = locale === "fa" ? "هیچ مطلبی یافت نشد." : "No posts found.";

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">{noPostsText}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post) => {
        const title = getLocalizedText(post.title, locale);
        const category = getLocalizedText(post.category, locale);
        const excerpt = getLocalizedText(post.excerpt, locale);
        const altText = title || (locale === "fa" ? "تصویر مطلب" : "Blog image");

        return (
          <article
            key={post.id}
            className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
          >
            <Link href={`/blog/${post.slug}?lang=${locale}`} className="block">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                <Image
                  src={post.image}
                  alt={altText}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
              <div className="p-4 md:p-5">
                <span className="inline-block rounded-full bg-[#8f1d1d]/10 px-2.5 py-1 text-xs font-medium text-[#8f1d1d]">
                  {category}
                </span>
                <h2 className="mt-3 line-clamp-2 text-lg md:text-xl font-bold text-neutral-800 group-hover:text-[#8f1d1d] transition">
                  {title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-neutral-600">
                  {excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                  <span>
                    {new Date(post.date).toLocaleDateString(
                      locale === "fa" ? "fa-IR" : "en-US"
                    )}
                  </span>
                  <span className="text-[#8f1d1d] font-medium">{t.readMore}</span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}