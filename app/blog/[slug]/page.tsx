// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, FolderOpen, MessageCircle } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { siteMeta } from "@/lib/seed-content";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

function getLocalizedText(value: unknown, locale: string): string {
  if (!value) return "";
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (parsed && typeof parsed === "object") {
        return parsed[locale] || parsed.fa || Object.values(parsed)[0] || "";
      }
    } catch {
      return value;
    }
    return value;
  }
  if (typeof value === "object") {
    const obj = value as Record<string, string>;
    return obj[locale] || obj.fa || Object.values(obj)[0] || "";
  }
  return String(value);
}

export async function generateMetadata({ params, searchParams }: BlogPostPageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return { title: locale === "fa" ? "پست یافت نشد" : "Post not found" };
  const title = getLocalizedText(post.title, locale);
  const description = getLocalizedText(post.excerpt, locale);
  return {
    title,
    description,
    openGraph: { title, description, images: [{ url: post.image }] },
  };
}

export default async function BlogPostPage({ params, searchParams }: BlogPostPageProps) {
  const { slug } = await params;
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { comments: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } } },
  });
  if (!post) notFound();

  const title = getLocalizedText(post.title, locale);
  const category = getLocalizedText(post.category, locale);
  const author = getLocalizedText(post.author, locale);
  const contentHtml = getLocalizedText(post.content, locale);
  const excerpt = getLocalizedText(post.excerpt, locale);

  const relatedPosts = await prisma.blogPost.findMany({
    where: { categorySlug: post.categorySlug, id: { not: post.id }, published: true },
    take: 3,
    orderBy: { date: "desc" },
  });

  const t = translations[locale];
  const blogT = t.blog;
  const commonT = t.common;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description: excerpt,
    image: `${siteMeta.url}${post.image}`,
    datePublished: post.date.toISOString(),
    author: { "@type": "Organization", name: author || siteMeta.name },
    publisher: { "@type": "Organization", name: siteMeta.name, logo: `${siteMeta.url}/home/logo.png` },
    mainEntityOfPage: `${siteMeta.url}/blog/${post.slug}`,
  };

  return (
    <main className="min-h-screen bg-[#fdf8f3]" dir={locale === "fa" ? "rtl" : "ltr"}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <PageHero badge={blogT.articleBadge} title={title} />

      <BreadcrumbNav
        items={[
          { label: commonT.home, href: `/?lang=${locale}` },
          { label: commonT.blog, href: `/blog?lang=${locale}` },
          { label: category, href: `/blog/category/${post.categorySlug}?lang=${locale}` },
          { label: title },
        ]}
      />

      <div className="mx-auto max-w-[800px] px-6 py-10">
        <div className="mb-8 flex flex-wrap gap-4 border-b-2 border-[rgba(206,74,40,0.15)] pb-5 text-sm text-[#5a3728]">
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={16} /> {new Date(post.date).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <User size={16} /> {author}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FolderOpen size={16} />
            <Link href={`/blog/category/${post.categorySlug}?lang=${locale}`} className="hover:text-[#ce4a28]">
              {category}
            </Link>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageCircle size={16} /> {post.comments.length}{" "}
            {post.comments.length === 1 ? blogT.commentsCount : blogT.commentsCount + "s"}
          </span>
        </div>

        <div className="mb-8 overflow-hidden rounded-3xl shadow-[0_12px_40px_rgba(0,0,0,0.1)]">
          <Image src={post.image} alt={title} width={800} height={450} className="h-auto w-full" />
        </div>

        <div
          className="prose-content text-base leading-[1.9] text-[#2c1810] [&_h2]:mt-8 [&_h2]:text-[#8f2e18]"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />

        <div className="mt-12 border-t-2 border-[rgba(206,74,40,0.15)] pt-8">
          <h3 className="mb-6 text-2xl font-bold text-[#8f2e18]">
            {blogT.commentsHeading} ({post.comments.length})
          </h3>
          <CommentForm blogPostId={post.id} locale={locale} />
          {post.comments.length > 0 && (
            <div className="mt-8 space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="rounded-[20px] bg-white p-5 shadow-[0_4px_12px_rgba(0,0,0,0.05)]">
                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[rgba(206,74,40,0.1)] font-bold text-[#ce4a28]">
                      {comment.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{comment.name}</div>
                      <div className="text-xs text-neutral-500">
                        {new Date(comment.createdAt).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}
                      </div>
                    </div>
                  </div>
                  <p className="text-neutral-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {relatedPosts.length > 0 && (
        <section className="bg-[#fdf1e6] px-6 py-12">
          <h3 className="mb-8 text-center text-2xl font-bold text-[#8f2e18]">{commonT.relatedPosts}</h3>
          <div className="mx-auto grid max-w-[1080px] grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-6">
            {relatedPosts.map((p) => {
              const relatedTitle = getLocalizedText(p.title, locale);
              return (
                <Link
                  key={p.id}
                  href={`/blog/${p.slug}?lang=${locale}`}
                  className="overflow-hidden rounded-[20px] bg-white transition-transform duration-250 hover:-translate-y-1.5"
                >
                  <div className="relative aspect-[16/9] w-full">
                    <Image src={p.image} alt={relatedTitle} fill sizes="280px" className="object-cover" />
                  </div>
                  <h4 className="p-4 font-extrabold text-[#2c1810]">{relatedTitle}</h4>
                </Link>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
