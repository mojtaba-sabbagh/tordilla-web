import type { MetadataRoute } from "next";
import { posts, products, siteMeta } from "@/lib/seed-content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteMeta.url;

  return [
    "",
    "/about",
    "/contact",
    "/cinema",
    "/blog",
    "/products",
    ...posts.map((post) => `/blog/${post.slug}`),
    ...products.map((product) => `/products/${product.slug}`),
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
  }));
}
