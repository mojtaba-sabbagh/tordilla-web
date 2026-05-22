// app/blog/category/[categorySlug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostsByCategory, getCategories } from "@/lib/blog-data";
import { CategorySidebar } from "../../CategorySidebar";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";

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
  const description = locale === "fa" ? `مطالب دسته ${categoryName} در وبلاگ ترددیلا` : `Posts about ${categoryName} on Tordilla Blog`;
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

  // Extract localized category name from the first post
  const categoryNameObj = posts[0].category as { fa: string; en: string };
  const categoryName = categoryNameObj[locale];

  const t = translations[locale];
  const blogT = t.blog;
  const commonT = t.common;

  return (
    <main className="category-page" dir={locale === "fa" ? "rtl" : "ltr"}>
      <style>{`
        .category-page {
          background: #fdf8f3;
          min-height: 100vh;
        }
        .cat-hero {
          position: relative;
          background: linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%);
          padding: 80px 24px 100px;
          text-align: center;
          overflow: hidden;
        }
        .cat-hero::before,
        .cat-hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .cat-hero::before {
          width: 360px; height: 360px;
          top: -120px; left: -80px;
          background: rgba(255,255,255,0.05);
        }
        .cat-hero::after {
          width: 280px; height: 280px;
          bottom: -100px; right: -60px;
          background: rgba(255,255,255,0.04);
        }
        .cat-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 18px;
          border-radius: 9999px;
          border: 1.5px solid rgba(255,255,255,0.28);
          background: rgba(255,255,255,0.1);
          color: #fff;
          font-size: 13px;
          font-weight: 700;
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        .cat-hero h1 {
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .cat-hero p {
          max-width: 560px;
          margin: 0 auto 32px;
          color: rgba(255,255,255,0.78);
          font-size: 16px;
          line-height: 2;
          position: relative;
          z-index: 1;
        }
        .cat-hero-logo-ring {
          width: 148px;
          height: 148px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          border: 2px solid rgba(255,255,255,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(8px);
          margin: 0 auto;
        }
        .cat-wave {
          display: block;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          margin-top: -2px;
        }
        .cat-wave svg { display: block; width: 100%; }
        .cat-breadcrumb {
          max-width: 1080px;
          margin: 0 auto;
          padding: 20px 24px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #a07060;
          border-bottom: 1.5px solid rgba(143,29,29,0.08);
        }
        .cat-breadcrumb a {
          color: #8f1d1d;
          text-decoration: none;
          font-weight: 600;
        }
        .cat-breadcrumb a:hover { text-decoration: underline; }
        .cat-breadcrumb-sep { color: #cbb0a0; }
        .cat-container {
          max-width: 1080px;
          margin: 0 auto;
          padding: 40px 24px 80px;
        }
        .category-bar-wrapper { margin-bottom: 48px; }
        .posts-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        .post-card {
          background: #fff;
          border-radius: 26px;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(143,29,29,0.07);
          transition: transform 0.28s, box-shadow 0.28s;
        }
        .post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 20px 48px rgba(143,29,29,0.14);
        }
        .post-card img {
          width: 100%;
          height: 200px;
          object-fit: cover;
          transition: transform 0.5s;
        }
        .post-card:hover img { transform: scale(1.05); }
        .post-content { padding: 20px; }
        .post-category {
          display: inline-block;
          background: rgba(143,29,29,0.1);
          color: #8f1d1d;
          font-size: 12px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 999px;
          margin-bottom: 12px;
        }
        .post-title {
          font-size: 18px;
          font-weight: 800;
          color: #2c1810;
          margin-bottom: 8px;
          line-height: 1.4;
        }
        .post-excerpt {
          font-size: 13px;
          color: #5a3728;
          line-height: 1.7;
          margin-bottom: 12px;
        }
        .post-meta {
          font-size: 12px;
          color: #a07060;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .social-section {
          background: #8f1d1d;
          border-radius: 28px;
          padding: 48px 32px;
          text-align: center;
          margin-top: 48px;
        }
        .social-section h3 {
          font-size: 24px;
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
        }
        .social-icons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 24px;
          margin-top: 24px;
        }
        .social-icon-link {
          display: inline-flex;
          width: 72px;
          height: 72px;
          background: rgba(255,255,255,0.15);
          border-radius: 9999px;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, background 0.2s;
        }
        .social-icon-link:hover {
          transform: scale(1.05);
          background: rgba(255,255,255,0.25);
        }
        .social-icon-link svg { width: 48px; height: 48px; }
      `}</style>

      <section className="cat-hero">
        <div className="cat-hero-badge">{blogT.categoryBadge}</div>
        <h1>{categoryName}</h1>
        <p>{blogT.categoryPosts(posts.length)}</p>
        <div className="cat-hero-logo-ring">
          <Image src="/home/logo.png" alt="Logo" width={108} height={108} />
        </div>
      </section>

      <div className="cat-wave">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ height: 52 }}>
          <path d="M0,0 C300,60 900,60 1200,0 L1200,60 L0,60 Z" fill="#fdf8f3" />
        </svg>
      </div>

      <nav className="cat-breadcrumb">
        <Link href={`/?lang=${locale}`}>{commonT.home}</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <Link href={`/blog?lang=${locale}`}>{commonT.blog}</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <span>{categoryName}</span>
      </nav>

      <div className="cat-container">
        <div className="category-bar-wrapper">
          <CategorySidebar categories={allCategories} horizontal locale={locale} />
        </div>

        <div className="posts-grid">
          {posts.map((post) => {
            const titleObj = post.title as { fa: string; en: string };
            const categoryObj = post.category as { fa: string; en: string };
            const excerptObj = post.excerpt as { fa: string; en: string };
            return (
              <Link key={post.id} href={`/blog/${post.slug}?lang=${locale}`} className="post-card">
                <div style={{ overflow: 'hidden' }}>
                  <img src={post.image} alt={titleObj[locale]} />
                </div>
                <div className="post-content">
                  <span className="post-category">{categoryObj[locale]}</span>
                  <h2 className="post-title">{titleObj[locale]}</h2>
                  <p className="post-excerpt">{excerptObj[locale]}</p>
                  <div className="post-meta">
                    <span>{new Date(post.date).toLocaleDateString(locale === "fa" ? "fa-IR" : "en-US")}</span>
                    <span className="text-[#8f1d1d] font-medium">{blogT.readMore}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="social-section">
          <h3>{commonT.socialHeading}</h3>
          <div className="social-icons">
            <a aria-label="Instagram" className="social-icon-link" href="https://instagram.com/tordillachips/" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 107.47 107.47" fill="white"><path d="M82.58,40.58A15.71,15.71,0,0,0,66.89,24.89H40.58a15.72,15.72,0,0,0-15.7,15.69V66.89a15.72,15.72,0,0,0,15.7,15.69H66.89A15.71,15.71,0,0,0,82.58,66.89ZM72.77,30.23A4.47,4.47,0,1,1,68.3,34.7,4.47,4.47,0,0,1,72.77,30.23Zm-19,40.67A17.17,17.17,0,1,1,70.9,53.73,17.18,17.18,0,0,1,53.73,70.9Z"/><path d="M53.73,41.77a12,12,0,1,0,12,12A12,12,0,0,0,53.73,41.77Z"/><path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM87.66,66.89A20.8,20.8,0,0,1,66.89,87.66H40.58A20.8,20.8,0,0,1,19.8,66.89V40.58A20.8,20.8,0,0,1,40.58,19.8H66.89A20.8,20.8,0,0,1,87.66,40.58Z"/></svg>
            </a>
            <a aria-label="Twitter" className="social-icon-link" href="https://twitter.com/tordillachips" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 107.47 107.47" fill="white"><path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM82.37,40.55a15.28,15.28,0,0,1-3.16,2.65l0,0C78.6,61.32,66.46,79.8,45,80.93c-8.1.43-15.56-2.87-21.36-7.65a23,23,0,0,0,6.57,1,19.66,19.66,0,0,0,12-4.37s-12-3.32-11.72-8.9l5.75-.17a18.12,18.12,0,0,1-5.69-2.95c-3.46-3.12-5.46-7.46-4.47-9.89a7.41,7.41,0,0,0,2.32,1.13,10.73,10.73,0,0,0,3.27.54S28.06,47.09,27,44.25c-1.62-4.42-.8-10.06.81-11.76,0,0,.64,3.58,10.85,8.75,5.18,2.63,11,4.49,15.53,4.61a16.67,16.67,0,0,1-.52-4.2c0-6.16,5.71-11.15,12.76-11.15a13.54,13.54,0,0,1,9.84,4L79.68,33l4-1.72h0s.21.24,0,.85c-.41,1.45-3.59,4.54-4.84,5.54l0,.26a8.19,8.19,0,0,0,2.42-.32c1.35-.37,4.57-1.77,4.57-1.77A22.44,22.44,0,0,1,82.37,40.55Z"/></svg>
            </a>
            <a aria-label="Facebook" className="social-icon-link" href="https://www.facebook.com/tordillachips" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 107.47 107.47" fill="white"><path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM71.82,30.46H65.27c-5.15,0-6.14,2.44-6.14,6V44.4H71.39l-1.6,12.39H59.13V88.57H46.34V56.79H35.64V44.4h10.7V35.27c0-10.6,6.47-16.37,15.93-16.37a88.45,88.45,0,0,1,9.55.48Z"/></svg>
            </a>
            <a aria-label="Aparat" className="social-icon-link" href="https://www.aparat.com/tordilla.chips" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 107.47 107.47" fill="white"><circle cx="45.33" cy="41.28" fill="#fff" r="8.18" transform="translate(-15.92 44.14) rotate(-45)"/><path d="M57.46,54a3.82,3.82,0,1,0-3.81,3.82A3.82,3.82,0,0,0,57.46,54Z"/><circle cx="61.68" cy="66.91" fill="#fff" r="8.18" transform="translate(-29.25 63.21) rotate(-45)"/><circle cx="41.05" cy="62.95" fill="#fff" r="8.18" transform="translate(-32.49 47.47) rotate(-45)"/><circle cx="65.74" cy="45.03" fill="#fff" r="8.18" transform="translate(-8.59 16.31) rotate(-13.28)"/><path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0Zm-25,29.55A13.55,13.55,0,0,1,45.4,20.1l5.43,1.5A32.27,32.27,0,0,0,27,35.65Zm.56,48.72a13.59,13.59,0,0,1-9.45-16.71l1.7-6.12A32.23,32.23,0,0,0,34.68,79.77Zm49.51-.35a13.59,13.59,0,0,1-16.71,9.45l-5.42-1.51a32.21,32.21,0,0,0,23.82-14Zm-25,4.67A28.86,28.86,0,1,1,82.59,53.73,28.86,28.86,0,0,1,53.73,82.59ZM87.65,45.91,86,52A32.26,32.26,0,0,0,72.79,27.69L78.2,29.2A13.56,13.56,0,0,1,87.65,45.91Z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}