export type Product = {
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  packaging: string;
  audience: string;
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
