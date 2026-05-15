// app/blog/category/[categorySlug]/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostsByCategory, getCategories } from "@/lib/blog-data";
import { CategorySidebar } from "../../CategorySidebar";

interface CategoryPageProps {
  params: Promise<{ categorySlug: string }>;
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const posts = await getPostsByCategory(categorySlug);
  if (posts.length === 0) return { title: "دسته بندی یافت نشد" };
  const categoryName = posts[0].category;
  return {
    title: `${categoryName} | وبلاگ ترددیلا`,
    description: `مطالب دسته ${categoryName} در وبلاگ ترددیلا`,
  };
}

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({ categorySlug: category.slug }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categorySlug } = await params;
  const posts = await getPostsByCategory(categorySlug);
  const allCategories = await getCategories();

  if (posts.length === 0) notFound();
  const categoryName = posts[0].category;

  return (
    <main className="category-page" dir="rtl">
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
        .cat-hero::before, .cat-hero::after {
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
        <div className="cat-hero-badge">📂 دسته‌بندی</div>
        <h1>{categoryName}</h1>
        <p>{posts.length} مطلب در این دسته</p>
        <div className="cat-hero-logo-ring">
          <Image src="/home/logo.png" alt="لوگو" width={108} height={108} />
        </div>
      </section>

      <div className="cat-wave">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ height: 52 }}>
          <path d="M0,0 C300,60 900,60 1200,0 L1200,60 L0,60 Z" fill="#fdf8f3" />
        </svg>
      </div>

      <nav className="cat-breadcrumb">
        <Link href="/">خانه</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <Link href="/blog">وبلاگ</Link>
        <span className="cat-breadcrumb-sep">›</span>
        <span>{categoryName}</span>
      </nav>

      <div className="cat-container">
        <div className="category-bar-wrapper">
          <CategorySidebar categories={allCategories} horizontal />
        </div>

        <div className="posts-grid">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="post-card">
              <div style={{ overflow: 'hidden' }}>
                <img src={post.image} alt={post.title} />
              </div>
              <div className="post-content">
                <span className="post-category">{post.category}</span>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-meta">
                  <span>{new Date(post.date).toLocaleDateString('fa-IR')}</span>
                  <span className="text-[#8f1d1d] font-medium">خواندن ادامه ›</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="social-section">
          <h3>ترددیلا در شبکه‌های اجتماعی</h3>
          <div className="social-icons">
            <a aria-label="اینستاگرام" className="social-icon-link" href="https://instagram.com/tordillachips/" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 107.47 107.47" fill="white"><path d="M82.58,40.58A15.71,15.71,0,0,0,66.89,24.89H40.58a15.72,15.72,0,0,0-15.7,15.69V66.89a15.72,15.72,0,0,0,15.7,15.69H66.89A15.71,15.71,0,0,0,82.58,66.89ZM72.77,30.23A4.47,4.47,0,1,1,68.3,34.7,4.47,4.47,0,0,1,72.77,30.23Zm-19,40.67A17.17,17.17,0,1,1,70.9,53.73,17.18,17.18,0,0,1,53.73,70.9Z"/><path d="M53.73,41.77a12,12,0,1,0,12,12A12,12,0,0,0,53.73,41.77Z"/><path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM87.66,66.89A20.8,20.8,0,0,1,66.89,87.66H40.58A20.8,20.8,0,0,1,19.8,66.89V40.58A20.8,20.8,0,0,1,40.58,19.8H66.89A20.8,20.8,0,0,1,87.66,40.58Z"/></svg>
            </a>
            {/* Add other social icons similarly */}
          </div>
        </div>
      </div>
    </main>
  );
}