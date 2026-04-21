// lib/types.ts

export type Product = {
  slug: string;
  title: string;
  image: string;
  shortDescription: string;
  description: string;
  features: string[];
  packaging: string;
  audience: string;
  nutrition: {
    serving: string;
    energy: string;
    sugar: string;
    fat: string;
    salt: string;
    transFat: string;
  };
};

export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
};

export type CinemaPartner = {
  city: string;
  venue: string;
  note: string;
};

// Add category types and function
export type Category = {
  name: string;
  slug: string;
  count: number;
};

export function getCategoriesFromPosts(posts: { category: string; categorySlug: string }[]): Category[] {
  const categoryMap = new Map<string, Category>();
  
  posts.forEach(post => {
    if (!categoryMap.has(post.categorySlug)) {
      categoryMap.set(post.categorySlug, {
        name: post.category,
        slug: post.categorySlug,
        count: 1
      });
    } else {
      const existing = categoryMap.get(post.categorySlug)!;
      existing.count++;
    }
  });
  
  return Array.from(categoryMap.values());
}