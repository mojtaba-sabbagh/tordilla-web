// app/blog/BlogPostsGrid.tsx
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/lib/blog-data";

interface BlogPostsGridProps {
  posts: BlogPost[];
}

export function BlogPostsGrid({ posts }: BlogPostsGridProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500">هیچ مطلبی یافت نشد.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {posts.map((post) => (
        <article
          key={post.id}
          className="group overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
        >
          <Link href={`/blog/${post.slug}`} className="block">
            <div className="w-full overflow-hidden bg-neutral-100">
              <Image
                src={post.image}
                alt={post.title}
                width={post.imageWidth || 400}
                height={post.imageHeight || 300}
                className="w-full h-auto object-cover transition duration-500 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
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
                <span>{new Date(post.date).toLocaleDateString('fa-IR')}</span>
                <span className="text-[#8f1d1d] font-medium">خواندن ادامه ›</span>
              </div>
            </div>
          </Link>
        </article>
      ))}
    </div>
  );
}