import { notFound } from "next/navigation";
import { getPaginatedBlogPosts, getCategories } from "@/lib/blog-data";
import { BlogPostsGrid } from "../../BlogPostsGrid";
import { Pagination } from "../../Pagination";
import { CategorySidebar } from "../../CategorySidebar";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SocialSection } from "@/components/social-icons";

const POSTS_PER_PAGE = 8;

interface PaginatedPageProps {
  params: Promise<{ pageNum: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: PaginatedPageProps) {
  const { pageNum } = await params;
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const title = locale === "fa" ? `وبلاگ ترددیلا - صفحه ${pageNum}` : `Tordilla Blog - Page ${pageNum}`;
  const description =
    locale === "fa" ? `مقالات آموزشی ترددیلا - صفحه ${pageNum}` : `Tordilla educational articles - Page ${pageNum}`;
  return { title, description };
}

export async function generateStaticParams() {
  const { totalPages } = await getPaginatedBlogPosts(1, POSTS_PER_PAGE);
  return Array.from({ length: totalPages - 1 }, (_, i) => ({
    pageNum: String(i + 2),
  }));
}

export default async function PaginatedBlogPage({ params, searchParams }: PaginatedPageProps) {
  const { pageNum } = await params;
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const currentPage = parseInt(pageNum, 10);

  const { posts: currentPosts, totalPages } = await getPaginatedBlogPosts(currentPage, POSTS_PER_PAGE);
  const categories = await getCategories();

  if (isNaN(currentPage) || currentPage < 2 || currentPage > totalPages) {
    notFound();
  }

  const content = await getSiteTranslations(locale);
  const blogT = content.blog as Record<string, any>;
  const commonT = content.common as Record<string, any>;
  const contactT = content.contact as Record<string, any>;

  return (
    <main className="min-h-screen bg-[#fdf8f3]" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero badge={blogT.heroBadge} title={blogT.heroTitle} text={blogT.heroText} />

      <BreadcrumbNav
        items={[
          { label: commonT.home, href: `/?lang=${locale}` },
          { label: commonT.blog, href: `/blog?lang=${locale}` },
          { label: `${commonT.page} ${currentPage}` },
        ]}
      />

      <div className="mx-auto max-w-[1080px] px-6 py-16 md:py-20">
        <div className="mb-12">
          <CategorySidebar categories={categories} horizontal locale={locale} commonContent={commonT} />
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
