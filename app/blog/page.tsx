// app/blog/page.tsx
import { getPaginatedBlogPosts, getCategories } from "@/lib/blog-data";
import { BlogPostsGrid } from "./BlogPostsGrid";
import { Pagination } from "./Pagination";
import { CategorySidebar } from "./CategorySidebar";
import { POSTS_PER_PAGE } from "@/lib/constants";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SocialSection } from "@/components/social-icons";

interface BlogPageProps {
  searchParams: Promise<{ page?: string; lang?: string }>;
}

export async function generateMetadata({ searchParams }: BlogPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content as Record<string, Record<string, any>>;
  return {
    title: locale === "fa" ? "وبلاگ | چیپس ذرت ترددیلا" : "Blog | Tordilla Corn Chips",
    description: t.blog.heroText,
  };
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: params.lang || "fa" }));

  const { posts: currentPosts, totalPages } = await getPaginatedBlogPosts(currentPage, POSTS_PER_PAGE);
  const categories = await getCategories();

  const content = await getSiteTranslations(locale);
  const blogT = content.blog as Record<string, any>;
  const commonT = content.common as Record<string, any>;
  const contactT = content.contact as Record<string, any>;

  return (
    <main className="min-h-screen bg-[#fdf8f3]" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero badge={blogT.heroBadge} title={blogT.heroTitle} text={blogT.heroText} />

      <BreadcrumbNav items={[{ label: commonT.home, href: `/?lang=${locale}` }, { label: commonT.blog }]} />

      <div className="mx-auto max-w-[1080px] px-6 py-16 md:py-20">
        <div className="mb-12">
          <CategorySidebar categories={categories} horizontal locale={locale} />
        </div>

        <BlogPostsGrid posts={currentPosts} locale={locale} />
        <div className="mt-12">
          <Pagination currentPage={currentPage} totalPages={totalPages} locale={locale} />
        </div>

        <SocialSection
          className="mt-12"
          heading={commonT.socialHeading}
          labels={{
            instagram: contactT.instagramAria,
            twitter: contactT.twitterAria,
            facebook: contactT.facebookAria,
            aparat: contactT.aparatAria,
          }}
        />
      </div>
    </main>
  );
}
