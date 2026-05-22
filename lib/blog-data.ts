// lib/blog-data.ts
import { prisma } from "./prisma";
import { Locale } from "./i18n";
import type { BlogPost as PrismaBlogPost } from "@prisma/client";

export type BlogPost = {
  id: string;
  slug: string;
  title: { fa: string; en: string };
  category: { fa: string; en: string };
  categorySlug: string;
  date: Date;
  image: string;
  imageWidth: number;
  imageHeight: number;
  excerpt: { fa: string; en: string };
  content: { fa: string; en: string };
  author: { fa: string; en: string };
  published: boolean;
  comments?: Comment[];
};

export type Category = {
  slug: string;
  name: { fa: string; en: string };
  count: number;
};

// Helper function to safely cast JSON fields to the expected type
function castBlogPost(post: PrismaBlogPost): BlogPost {
  return {
    ...post,
    title: post.title as { fa: string; en: string },
    category: post.category as { fa: string; en: string },
    excerpt: post.excerpt as { fa: string; en: string },
    content: post.content as { fa: string; en: string },
    author: post.author as { fa: string; en: string },
  };
}

export async function getPaginatedBlogPosts(page: number, postsPerPage: number) {
  const skip = (page - 1) * postsPerPage;
  const [posts, totalPosts] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      skip,
      take: postsPerPage,
      orderBy: { date: "desc" },
    }),
    prisma.blogPost.count({ where: { published: true } }),
  ]);
  
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  // Map through posts and cast each one
  const typedPosts = posts.map(castBlogPost);
  
  return { posts: typedPosts, totalPages };
}

export async function getPostsByCategory(categorySlug: string) {
  const posts = await prisma.blogPost.findMany({
    where: { categorySlug, published: true },
    orderBy: { date: "desc" },
  });
  // Map through posts and cast each one
  return posts.map(castBlogPost);
}

export async function getCategories(): Promise<Category[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    select: { categorySlug: true, category: true },
  });
  
  const categoryMap = new Map<string, { name: { fa: string; en: string }; count: number }>();
  for (const post of posts) {
    const slug = post.categorySlug;
    // Cast category to the expected type
    const name = post.category as { fa: string; en: string };
    if (categoryMap.has(slug)) {
      categoryMap.get(slug)!.count++;
    } else {
      categoryMap.set(slug, { name, count: 1 });
    }
  }
  
  return Array.from(categoryMap.entries()).map(([slug, { name, count }]) => ({
    slug,
    name,
    count,
  }));
}