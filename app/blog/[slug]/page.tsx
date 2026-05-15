// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, FolderOpen, MessageCircle } from "lucide-react";
import { CommentForm } from "./CommentForm";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug, published: true } });
  if (!post) return { title: "پست یافت نشد" };
  return { title: `${post.title} | وبلاگ ترددیلا`, description: post.excerpt };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: { comments: { where: { status: "APPROVED" }, orderBy: { createdAt: "desc" } } },
  });
  if (!post) notFound();

  const relatedPosts = await prisma.blogPost.findMany({
    where: { categorySlug: post.categorySlug, id: { not: post.id }, published: true },
    take: 3,
    orderBy: { date: "desc" },
  });

  return (
    <main className="single-post-page" dir="rtl">
      <style>{`
        .single-post-page {
          background: #fdf8f3;
          min-height: 100vh;
        }
        .post-hero {
          position: relative;
          background: linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%);
          padding: 80px 24px 100px;
          text-align: center;
          overflow: hidden;
        }
        .post-hero::before, .post-hero::after {
          content: '';
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
        }
        .post-hero::before {
          width: 360px; height: 360px;
          top: -120px; left: -80px;
          background: rgba(255,255,255,0.05);
        }
        .post-hero::after {
          width: 280px; height: 280px;
          bottom: -100px; right: -60px;
          background: rgba(255,255,255,0.04);
        }
        .post-hero-badge {
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
        .post-hero h1 {
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 900;
          color: #fff;
          margin-bottom: 16px;
          position: relative;
          z-index: 1;
        }
        .post-hero-logo-ring {
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
        .post-wave {
          display: block;
          width: 100%;
          overflow: hidden;
          line-height: 0;
          margin-top: -2px;
        }
        .post-wave svg { display: block; width: 100%; }
        .post-breadcrumb {
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
        .post-breadcrumb a {
          color: #8f1d1d;
          text-decoration: none;
          font-weight: 600;
        }
        .post-breadcrumb a:hover { text-decoration: underline; }
        .post-breadcrumb-sep { color: #cbb0a0; }
        .post-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 24px;
        }
        .post-meta-bar {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          padding-bottom: 20px;
          margin-bottom: 32px;
          border-bottom: 2px solid rgba(143,29,29,0.15);
          color: #5a3728;
          font-size: 14px;
        }
        .post-meta-bar span { display: inline-flex; align-items: center; gap: 6px; }
        .featured-image {
          border-radius: 24px;
          overflow: hidden;
          margin-bottom: 32px;
          box-shadow: 0 12px 40px rgba(0,0,0,0.1);
        }
        .post-content {
          font-size: 16px;
          line-height: 1.9;
          color: #2c1810;
        }
        .post-content h2 { color: #8f1d1d; margin-top: 32px; }
        .comments-section {
          margin-top: 48px;
          padding-top: 32px;
          border-top: 2px solid rgba(143,29,29,0.15);
        }
        .comment {
          background: #fff;
          border-radius: 20px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.05);
        }
        .related-section {
          background: #f6f1ec;
          padding: 48px 24px;
        }
        .related-grid {
          max-width: 1080px;
          margin: 0 auto;
          display: grid;
          gap: 24px;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        }
        .related-card {
          background: #fff;
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.25s;
        }
        .related-card:hover { transform: translateY(-5px); }
        .related-card img { width: 100%; height: 160px; object-fit: cover; }
        .related-card h4 { padding: 16px; font-weight: 800; color: #2c1810; }
      `}</style>

      <section className="post-hero">
        <div className="post-hero-badge">📖 مقاله</div>
        <h1>{post.title}</h1>
        <div className="post-hero-logo-ring">
          <Image src="/home/logo.png" alt="لوگو" width={108} height={108} />
        </div>
      </section>

      <div className="post-wave">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" style={{ height: 52 }}>
          <path d="M0,0 C300,60 900,60 1200,0 L1200,60 L0,60 Z" fill="#fdf8f3" />
        </svg>
      </div>

      <nav className="post-breadcrumb">
        <Link href="/">خانه</Link>
        <span className="post-breadcrumb-sep">›</span>
        <Link href="/blog">وبلاگ</Link>
        <span className="post-breadcrumb-sep">›</span>
        <Link href={`/blog/category/${post.categorySlug}`}>{post.category}</Link>
        <span className="post-breadcrumb-sep">›</span>
        <span>{post.title}</span>
      </nav>

      <div className="post-container">
        <div className="post-meta-bar">
          <span><Calendar size={16} /> {new Date(post.date).toLocaleDateString('fa-IR')}</span>
          <span><User size={16} /> {post.author}</span>
          <span><FolderOpen size={16} /> <Link href={`/blog/category/${post.categorySlug}`} style={{color:'#8f1d1d'}}>{post.category}</Link></span>
          <span><MessageCircle size={16} /> {post.comments.length} نظر</span>
        </div>

        <div className="featured-image">
          <Image src={post.image} alt={post.title} width={800} height={450} className="w-full h-auto" />
        </div>

        <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />

        <div className="comments-section">
          <h3 className="text-2xl font-bold text-[#8f1d1d] mb-6">نظرات ({post.comments.length})</h3>
          <CommentForm blogPostId={post.id} />
          {post.comments.length > 0 && (
            <div className="mt-8 space-y-4">
              {post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center font-bold text-[#8f1d1d]">
                      {comment.name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold">{comment.name}</div>
                      <div className="text-xs text-neutral-500">{new Date(comment.createdAt).toLocaleDateString('fa-IR')}</div>
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
        <section className="related-section">
          <h3 className="text-2xl font-bold text-[#8f1d1d] text-center mb-8">مطالب مرتبط</h3>
          <div className="related-grid">
            {relatedPosts.map(p => (
              <Link key={p.id} href={`/blog/${p.slug}`} className="related-card">
                <img src={p.image} alt={p.title} />
                <h4>{p.title}</h4>
              </Link>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}