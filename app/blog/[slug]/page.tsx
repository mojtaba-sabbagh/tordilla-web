// app/blog/[slug]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, FolderOpen, MessageCircle, Send } from "lucide-react";
import { CommentForm } from "./CommentForm";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
  });

  if (!post) {
    return {
      title: "پست یافت نشد",
    };
  }

  return {
    title: `${post.title} | وبلاگ ترددیلا`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  
  const post = await prisma.blogPost.findUnique({
    where: { slug, published: true },
    include: {
      comments: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!post) {
    notFound();
  }

  // Get related posts (same category, excluding current)
  const relatedPosts = await prisma.blogPost.findMany({
    where: {
      categorySlug: post.categorySlug,
      id: { not: post.id },
      published: true,
    },
    take: 3,
    orderBy: { date: "desc" },
  });

  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#8f1d1d]">
              {post.title}
            </h1>
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
          &gt;{" "}
          <Link
            href={`/blog/category/${post.categorySlug}`}
            className="hover:text-[#8f1d1d] transition"
          >
            {post.category}
          </Link>{" "}
          &gt; <span className="text-[#8f1d1d]">{post.title}</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 md:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Meta Info */}
          <div className="flex flex-wrap gap-4 text-sm text-neutral-500 border-b border-neutral-200 pb-4 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("fa-IR")}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
            <span className="flex items-center gap-1">
              <FolderOpen className="w-4 h-4" />
              <Link href={`/blog/category/${post.categorySlug}`} className="hover:text-[#8f1d1d]">
                {post.category}
              </Link>
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle className="w-4 h-4" />
              {post.comments.length} نظر
            </span>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-96 mb-8 rounded-2xl overflow-hidden">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none prose-headings:text-[#8f1d1d] prose-a:text-[#8f1d1d] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Comments Section */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <h3 className="text-2xl font-bold text-[#8f1d1d] mb-6">
              نظرات ({post.comments.length})
            </h3>

            {/* Comment Form */}
            <CommentForm blogPostId={post.id} />

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="mt-8 space-y-6">
                {post.comments.map((comment) => (
                  <div key={comment.id} className="bg-[#f6f1ec] rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center">
                        <span className="text-[#8f1d1d] font-bold">
                          {comment.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-bold text-neutral-800">{comment.name}</h4>
                        <p className="text-xs text-neutral-500">
                          {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                        </p>
                      </div>
                    </div>
                    <p className="text-neutral-700 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="bg-[#f6f1ec] py-12">
          <div className="container mx-auto px-4 md:px-6">
            <h3 className="text-2xl font-bold text-[#8f1d1d] mb-6 text-center">
              مطالب مرتبط
            </h3>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/blog/${relatedPost.slug}`}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      className="object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h4 className="font-bold text-neutral-800 line-clamp-2">
                      {relatedPost.title}
                    </h4>
                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                      {relatedPost.excerpt}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}