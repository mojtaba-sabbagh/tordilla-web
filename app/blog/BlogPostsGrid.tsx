// app/blog/BlogPostsGrid.tsx
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog-data";
import { Locale } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";

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

export async function BlogPostsGrid({ posts, locale }: BlogPostsGridProps) {
  const content = await getSiteTranslations(locale);
  const t = content.blog as Record<string, any>;
  const noPostsText = locale === "fa" ? "هیچ مطلبی یافت نشد." : "No posts found.";

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-ink-mute">{noPostsText}</p>
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
          <article key={post.id} className="surface surface-hover group overflow-hidden p-2.5">
            <Link href={`/blog/${post.slug}?lang=${locale}`} className="flex h-full flex-col">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tile bg-cream-warm">
                <Image
                  src={post.image}
                  alt={altText}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
              </div>
              <div className="flex flex-1 flex-col px-3 pb-2.5 pt-4">
                <span className="inline-flex w-fit rounded-full bg-leaf-50 px-3 py-1 text-[11px] font-bold text-leaf-600">
                  {category}
                </span>
                <h2 className="mt-3 line-clamp-2 text-[16px] font-black leading-[1.7] text-ink transition-colors group-hover:text-leaf-600">
                  {title}
                </h2>
                <p className="mt-2 line-clamp-3 flex-1 text-[13px] leading-[1.9] text-ink-mute">
                  {excerpt}
                </p>
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11.5px] text-ink-mute">
                  <span>
                    {new Date(post.date).toLocaleDateString(
                      locale === "fa" ? "fa-IR" : "en-US"
                    )}
                  </span>
                  <span className="font-bold text-leaf-600">{t.readMore}</span>
                </div>
              </div>
            </Link>
          </article>
        );
      })}
    </div>
  );
}