import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export const revalidate = 300;

export default async function BlogPage() {
  const posts = await getPosts();

  return (
    <div className="container section">
      <div className="page-head">
        <div>
          <span className="tag">بلاگ</span>
          <h1>بلاگ ترددیلا</h1>
          <p>
            اگر `WORDPRESS_API_URL` تنظیم شود، این صفحه پست‌های وردپرس را از REST
            API می‌خواند؛ در غیر این صورت از داده‌های محلی استفاده می‌کند.
          </p>
        </div>
      </div>

      <div className="grid grid-2">
        {posts.map((post) => (
          <article className="card" key={post.slug}>
            <h3>{post.title}</h3>
            <p>{post.excerpt}</p>
            <div className="actions">
              <Link className="button-secondary" href={`/blog/${post.slug}`}>
                مطالعه مطلب
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
