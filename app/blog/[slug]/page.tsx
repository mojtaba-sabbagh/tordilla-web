import { notFound } from "next/navigation";
import { posts as seedPosts } from "@/lib/seed-content";
import { getPostBySlug } from "@/lib/wordpress";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return seedPosts.map((post) => ({ slug: post.slug }));
}

export const revalidate = 300;

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container section article">
      <div className="page-head">
        <div>
          <span className="tag">مقاله</span>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span>{new Date(post.publishedAt).toLocaleDateString("fa-IR")}</span>
            <span>دریافت از WordPress یا داده محلی</span>
          </div>
        </div>
      </div>

      <article
        className="card rich-text"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </div>
  );
}
