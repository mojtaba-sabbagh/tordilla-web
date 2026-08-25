// lib/types.ts

// lib/types.ts
export interface PackSize {
  /** Net weight, e.g. "۱۰۰ گرمی" / "100 g" */
  weight: { fa: string; en: string };
  /** Sales channel this size is made for */
  channel: { fa: string; en: string };
  /** Pack shot. Omitted for sizes that ship without printed packaging. */
  image?: string;
  /** Extra clarification shown under the size, e.g. bulk bags for restaurants */
  note?: { fa: string; en: string };
}

export interface Product {
  slug: string;
  title: { fa: string; en: string };
  image: string;
  shortDescription: { fa: string; en: string };
  description: { fa: string; en: string };
  features: { fa: string[]; en: string[] };
  packaging: { fa: string; en: string };
  packSizes: PackSize[];
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