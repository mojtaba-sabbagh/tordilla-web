// app/blog/category/[categorySlug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getCategories, getPostsByCategory, blogPosts } from "@/lib/blog-data";
import { CategorySidebar } from "../../CategorySidebar";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const posts = getPostsByCategory(categorySlug);
  
  if (posts.length === 0) {
    return {
      title: "دسته بندی یافت نشد",
    };
  }
  
  const categoryName = posts[0].category;
  
  return {
    title: `${categoryName} | وبلاگ ترددیلا`,
    description: `مطالب دسته ${categoryName} در وبلاگ ترددیلا`,
  };
}

export async function generateStaticParams() {
  const categories = getCategories();
  return categories.map((category) => ({
    categorySlug: category.slug,
  }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const posts = getPostsByCategory(categorySlug);
  const categories = getCategories();
  
  if (posts.length === 0) {
    notFound();
  }
  
  const categoryName = posts[0].category;

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#8f1d1d]">
              {categoryName}
            </h1>
            <p className="mt-4 text-base md:text-lg text-neutral-600">
              {posts.length} مطلب در این دسته
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
          &gt;{" "}
          <Link href="/blog" className="hover:text-[#8f1d1d] transition">
            وبلاگ
          </Link>{" "}
          &gt; <span className="text-[#8f1d1d]">{categoryName}</span>
        </div>
      </div>

      {/* Main Content - Sidebar now takes 1/4 width */}
      <div className="container mx-auto px-4 md:px-6 py-8 lg:py-12">
        <div className="flex flex-col gap-8 lg:flex-row">
          {/* Main Content - Posts Grid - takes 3/4 width */}
          <div className="lg:w-3/4">
            {posts.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.slug}
                    className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    <Link href={`/blog/${post.slug}`} className="block">
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          className="object-cover transition duration-500 group-hover:scale-105"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-4 md:p-5">
                        <span className="inline-block rounded-full bg-[#8f1d1d]/10 px-2.5 py-1 text-xs font-medium text-[#8f1d1d]">
                          {post.category}
                        </span>
                        <h2 className="mt-3 line-clamp-2 text-lg md:text-xl font-bold text-neutral-800 group-hover:text-[#8f1d1d] transition">
                          {post.title}
                        </h2>
                        <p className="mt-2 line-clamp-3 text-sm text-neutral-600">
                          {post.excerpt}
                        </p>
                        <div className="mt-4 flex items-center justify-between text-xs text-neutral-400">
                          <span>{post.date}</span>
                          <span className="text-[#8f1d1d] font-medium">خواندن ادامه ›</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-neutral-500">مطلبی در این دسته یافت نشد.</p>
                <Link
                  href="/blog"
                  className="mt-4 inline-block rounded-full bg-[#8f1d1d] px-6 py-2 text-white transition hover:bg-[#6b1616]"
                >
                  بازگشت به همه مطالب
                </Link>
              </div>
            )}
          </div>

          {/* Sidebar - takes 1/4 width */}
          <aside className="lg:w-1/4">
            <CategorySidebar categories={categories} />
            
            {/* Instagram Card */}
            <div className="overflow-hidden rounded-2xl shadow-md mt-6">
              <div className="relative h-48 w-full">
                <Image
                   src="/home/blog/insta.jpg"
                   alt="اینستاگرام ترددیلا"
                  fill
                   sizes="(max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
              <div className="bg-[#8f1d1d] p-4 text-center text-white">
                <p className="mb-3 text-sm">اینستاگرام ترددیلا را دنبال کنید!</p>
                <a
                  href="https://instagram.com/tordillachips/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block rounded-full bg-[#39a845] px-4 py-2 text-xs font-bold transition hover:bg-[#2f8d39]"
                >
                  دنبال کردن
                </a>
              </div>
            </div>
          </aside>
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
            <a
              aria-label="توییتر ترددیلا"
              className="group inline-flex h-12 w-12 md:h-14 md:w-14 lg:h-[72px] lg:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://twitter.com/tordillachips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM82.37,40.55a15.28,15.28,0,0,1-3.16,2.65l0,0C78.6,61.32,66.46,79.8,45,80.93c-8.1.43-15.56-2.87-21.36-7.65a23,23,0,0,0,6.57,1,19.66,19.66,0,0,0,12-4.37s-12-3.32-11.72-8.9l5.75-.17a18.12,18.12,0,0,1-5.69-2.95c-3.46-3.12-5.46-7.46-4.47-9.89a7.41,7.41,0,0,0,2.32,1.13,10.73,10.73,0,0,0,3.27.54S28.06,47.09,27,44.25c-1.62-4.42-.8-10.06.81-11.76,0,0,.64,3.58,10.85,8.75,5.18,2.63,11,4.49,15.53,4.61a16.67,16.67,0,0,1-.52-4.2c0-6.16,5.71-11.15,12.76-11.15a13.54,13.54,0,0,1,9.84,4L79.68,33l4-1.72h0s.21.24,0,.85c-.41,1.45-3.59,4.54-4.84,5.54l0,.26a8.19,8.19,0,0,0,2.42-.32c1.35-.37,4.57-1.77,4.57-1.77A22.44,22.44,0,0,1,82.37,40.55Z"
                  fill="#fff"
                />
              </svg>
            </a>
            <a
              aria-label="فیسبوک ترددیلا"
              className="group inline-flex h-12 w-12 md:h-14 md:w-14 lg:h-[72px] lg:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://www.facebook.com/tordillachips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM71.82,30.46H65.27c-5.15,0-6.14,2.44-6.14,6V44.4H71.39l-1.6,12.39H59.13V88.57H46.34V56.79H35.64V44.4h10.7V35.27c0-10.6,6.47-16.37,15.93-16.37a88.45,88.45,0,0,1,9.55.48Z"
                  fill="#fff"
                />
              </svg>
            </a>
            <a
              aria-label="آپارات ترددیلا"
              className="group inline-flex h-12 w-12 md:h-14 md:w-14 lg:h-[72px] lg:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://www.aparat.com/tordilla.chips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
                <circle cx="45.33" cy="41.28" fill="#fff" r="8.18" transform="translate(-15.92 44.14) rotate(-45)" />
                <path d="M57.46,54a3.82,3.82,0,1,0-3.81,3.82A3.82,3.82,0,0,0,57.46,54Z" fill="#fff" />
                <circle cx="61.68" cy="66.91" fill="#fff" r="8.18" transform="translate(-29.25 63.21) rotate(-45)" />
                <circle cx="41.05" cy="62.95" fill="#fff" r="8.18" transform="translate(-32.49 47.47) rotate(-45)" />
                <circle cx="65.74" cy="45.03" fill="#fff" r="8.18" transform="translate(-8.59 16.31) rotate(-13.28)" />
                <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0Zm-25,29.55A13.55,13.55,0,0,1,45.4,20.1l5.43,1.5A32.27,32.27,0,0,0,27,35.65Zm.56,48.72a13.59,13.59,0,0,1-9.45-16.71l1.7-6.12A32.23,32.23,0,0,0,34.68,79.77Zm49.51-.35a13.59,13.59,0,0,1-16.71,9.45l-5.42-1.51a32.21,32.21,0,0,0,23.82-14Zm-25,4.67A28.86,28.86,0,1,1,82.59,53.73,28.86,28.86,0,0,1,53.73,82.59ZM87.65,45.91,86,52A32.26,32.26,0,0,0,72.79,27.69L78.2,29.2A13.56,13.56,0,0,1,87.65,45.91Z" fill="#fff" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}