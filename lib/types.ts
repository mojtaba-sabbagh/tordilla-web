// lib/types.ts

// lib/types.ts
export interface Product {
  slug: string;
  title: { fa: string; en: string };
  image: string;
  shortDescription: { fa: string; en: string };
  description: { fa: string; en: string };
  features: { fa: string[]; en: string[] };
  packaging: { fa: string; en: string };
  audience: { fa: string; en: string };
  nutrition: {
    serving: { fa: string; en: string };
    energy: { fa: string; en: string };
    sugar: { fa: string; en: string };
    fat: { fa: string; en: string };
    salt: { fa: string; en: string };
    transFat: { fa: string; en: string };
  };
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  content: string;
}

export interface CinemaPartner {
  city: string;
  venue: string;
  note: string;
}

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