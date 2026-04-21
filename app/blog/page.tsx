// app/blog/page.tsx
import Link from "next/link";
import { getPaginatedBlogPosts, getCategories } from "@/lib/blog-data";
import { BlogPostsGrid } from "./BlogPostsGrid";
import { Pagination } from "./Pagination";
import { CategorySidebar } from "./CategorySidebar";
import { POSTS_PER_PAGE } from "@/lib/constants";

export const metadata = {
  title: "وبلاگ | چیپس ذرت ترددیلا",
  description:
    "مقالات آموزشی، طرز تهیه غذاهای مکزیکی، دیپ‌ها و سس‌های خوشمزه با ترددیلا",
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  
  // Await the searchParams before accessing its properties
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
    
  // Fetch data from database
  const { posts: currentPosts, totalPages } = await getPaginatedBlogPosts(
    currentPage,
    POSTS_PER_PAGE
  );
  const categories = await getCategories();

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py- md:py-8 lg:py-8">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#8f1d1d]">
              وبلاگ ترددیلا
            </h1>
            <p className="mt-4 text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              دنیای هیجان‌انگیز ناچوها، آموزش غذاهای مکزیکی و دیپ‌های خوشمزه
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#8f1d1d] transition">
            چیپس ذرت ترددیلا
          </Link>{" "}
          &gt; <span className="text-[#8f1d1d]">وبلاگ</span>
        </div>
      </div>

      {/* Horizontal Category Bar */}
      <section className="container mx-auto px-4 md:px-6 pb-8">
        <CategorySidebar categories={categories} horizontal />
      </section>

      {/* Main Content - Full Width Posts */}
      <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12">
        <div className="max-w-full">
          <BlogPostsGrid posts={currentPosts} />
          <div className="mt-12">
            <Pagination currentPage={currentPage} totalPages={totalPages} />
          </div>
        </div>
      </div>

      {/* Social Networks Section */}
      <section className="bg-[#8f1d1d] py-10 md:py-12 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h4 className="text-xl md:text-2xl lg:text-3xl font-black">
            ترددیلا در شبکه های اجتماعی
          </h4>
          <div className="mt-6 md:mt-8 flex flex-wrap items-center justify-center gap-4 md:gap-5 lg:gap-7">
            <a
              key="instagram"
              aria-label="اینستاگرام ترددیلا"
              className="group inline-flex h-12 w-12 md:h-14 md:w-14 lg:h-[72px] lg:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://instagram.com/tordillachips/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
                <path
                  d="M82.58,40.58A15.71,15.71,0,0,0,66.89,24.89H40.58a15.72,15.72,0,0,0-15.7,15.69V66.89a15.72,15.72,0,0,0,15.7,15.69H66.89A15.71,15.71,0,0,0,82.58,66.89ZM72.77,30.23A4.47,4.47,0,1,1,68.3,34.7,4.47,4.47,0,0,1,72.77,30.23Zm-19,40.67A17.17,17.17,0,1,1,70.9,53.73,17.18,17.18,0,0,1,53.73,70.9Z"
                  fill="#fff"
                />
                <path
                  d="M53.73,41.77a12,12,0,1,0,12,12A12,12,0,0,0,53.73,41.77Z"
                  fill="#fff"
                />
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM87.66,66.89A20.8,20.8,0,0,1,66.89,87.66H40.58A20.8,20.8,0,0,1,19.8,66.89V40.58A20.8,20.8,0,0,1,40.58,19.8H66.89A20.8,20.8,0,0,1,87.66,40.58Z"
                  fill="#fff"
                />
              </svg>
            </a>
            {/* Add other social media links with keys */}
          </div>
        </div>
      </section>
    </div>
  );
}