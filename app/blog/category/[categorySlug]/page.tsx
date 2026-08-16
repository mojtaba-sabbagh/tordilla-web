// app/blog/category/[categorySlug]/page.tsx
import { notFound } from "next/navigation";
import { getPostsByCategory, getCategories } from "@/lib/blog-data";
import { BlogPostsGrid } from "../../BlogPostsGrid";
import { CategorySidebar } from "../../CategorySidebar";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SocialSection } from "@/components/social-icons";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ params, searchParams }: CategoryPageProps) {
  const { categorySlug } = await params;
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const posts = await getPostsByCategory(categorySlug);
  if (posts.length === 0) {
    return { title: locale === "fa" ? "دسته بندی یافت نشد" : "Category not found" };
  }
  const categoryNameObj = posts[0].category as { fa: string; en: string };
  const categoryName = categoryNameObj[locale];
  const title = locale === "fa" ? `${categoryName} | وبلاگ ترددیلا` : `${categoryName} | Tordilla Blog`;
  const description =
    locale === "fa" ? `مطالب دسته ${categoryName} در وبلاگ ترددیلا` : `Posts about ${categoryName} on Tordilla Blog`;
  return { title, description };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ categorySlug: category.slug }));
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { categorySlug } = await params;
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const posts = await getPostsByCategory(categorySlug);
  const allCategories = await getCategories();

  if (posts.length === 0) notFound();

  const categoryNameObj = posts[0].category as { fa: string; en: string };
  const categoryName = categoryNameObj[locale];

  const content = await getSiteTranslations(locale);
  const blogT = content.blog as Record<string, any>;
  const commonT = content.common as Record<string, any>;
  const contactT = content.contact as Record<string, any>;
  const categoryPostsText =
    typeof blogT.categoryPosts === "string"
      ? blogT.categoryPosts.replace("{count}", String(posts.length))
      : blogT.categoryPosts;

  return (
    <main className="min-h-screen" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero badge={blogT.categoryBadge} title={categoryName} text={categoryPostsText} />

      <BreadcrumbNav
        items={[
          { label: commonT.home, href: `/?lang=${locale}` },
          { label: commonT.blog, href: `/blog?lang=${locale}` },
          { label: categoryName },
        ]}
      />

      <div className="mx-auto max-w-[1120px] px-6 pb-20 pt-8 md:pb-24">
        <div className="mb-12">
          <CategorySidebar categories={allCategories} horizontal locale={locale} commonContent={commonT} />
        </div>

        <BlogPostsGrid posts={posts} locale={locale} />

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
