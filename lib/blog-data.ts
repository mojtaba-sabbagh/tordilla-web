// lib/blog-data.ts
import { prisma } from './prisma';

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  categorySlug: string;
  date: string | Date;
  image: string;
  imageWidth: number;
  imageHeight: number;
  excerpt: string;
  content: string;
  author: string;
  published: boolean;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string | Date;
}

export interface Category {
  name: string;
  slug: string;
  count: number;
}

// Fetch all blog posts from database
export async function getBlogPosts(): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { published: true },
    orderBy: { date: 'desc' },
    include: {
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  return posts as BlogPost[];
}

// Fetch paginated blog posts
export async function getPaginatedBlogPosts(page: number = 1, pageSize: number = 8): Promise<{
  posts: BlogPost[];
  total: number;
  totalPages: number;
}> {
  const skip = (page - 1) * pageSize;
  
  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where: { published: true },
      orderBy: { date: 'desc' },
      skip,
      take: pageSize,
      include: {
        comments: {
          where: { status: 'APPROVED' },
          orderBy: { createdAt: 'desc' },
        },
      },
    }),
    prisma.blogPost.count({
      where: { published: true },
    }),
  ]);
  
  return {
    posts: posts as BlogPost[],
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}

// Get categories from database
export async function getCategories(): Promise<Category[]> {
  const categories = await prisma.blogPost.groupBy({
    by: ['category', 'categorySlug'],
    where: { published: true },
    _count: {
      category: true,
    },
  });
  
  return categories
    .map(cat => ({
      name: cat.category,
      slug: cat.categorySlug,
      count: cat._count.category,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// Get posts by category from database
export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const posts = await prisma.blogPost.findMany({
    where: { 
      published: true,
      categorySlug: categorySlug,
    },
    orderBy: { date: 'desc' },
    include: {
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  return posts as BlogPost[];
}

// Get single post by slug
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const post = await prisma.blogPost.findUnique({
    where: { slug },
    include: {
      comments: {
        where: { status: 'APPROVED' },
        orderBy: { createdAt: 'desc' },
      },
    },
  });
  
  return post as BlogPost | null;
}

// Helper function to get categories from any posts array (for backward compatibility)
export function getCategoriesFromPosts(posts: BlogPost[]): Category[] {
  const categoryMap = new Map<string, { name: string; slug: string; count: number }>();
  
  posts.forEach((post) => {
    if (categoryMap.has(post.categorySlug)) {
      const existing = categoryMap.get(post.categorySlug)!;
      existing.count++;
    } else {
      categoryMap.set(post.categorySlug, {
        name: post.category,
        slug: post.categorySlug,
        count: 1,
      });
    }
  });
  
  return Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
}