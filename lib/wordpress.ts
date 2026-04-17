import { posts as seedPosts } from "@/lib/seed-content";
import { Post } from "@/lib/types";

type WordpressRendered = {
  rendered: string;
};

type WordpressPost = {
  slug: string;
  date: string;
  title: WordpressRendered;
  excerpt: WordpressRendered;
  content: WordpressRendered;
};

const baseUrl = process.env.WORDPRESS_API_URL?.replace(/\/$/, "");

function normalizeHtml(html: string) {
  return html.replaceAll("src=\"//", "src=\"https://");
}

async function fetchWordpress<T>(path: string): Promise<T | null> {
  if (!baseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, {
      next: { revalidate: 300 },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

function mapPost(item: WordpressPost): Post {
  return {
    slug: item.slug,
    title: item.title.rendered,
    excerpt: item.excerpt.rendered.replace(/<[^>]+>/g, ""),
    content: normalizeHtml(item.content.rendered),
    publishedAt: item.date,
  };
}

export async function getPosts(): Promise<Post[]> {
  const wordpressPosts = await fetchWordpress<WordpressPost[]>(
    "/wp-json/wp/v2/posts?per_page=12&_fields=slug,date,title,excerpt,content",
  );

  if (!wordpressPosts?.length) {
    return seedPosts;
  }

  return wordpressPosts.map(mapPost);
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const wordpressPosts = await fetchWordpress<WordpressPost[]>(
    `/wp-json/wp/v2/posts?slug=${encodeURIComponent(
      slug,
    )}&_fields=slug,date,title,excerpt,content`,
  );

  if (wordpressPosts?.[0]) {
    return mapPost(wordpressPosts[0]);
  }

  return seedPosts.find((post) => post.slug === slug) ?? null;
}
