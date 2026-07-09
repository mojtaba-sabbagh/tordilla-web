import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { SectionBadge } from "@/components/ui/section-badge";
import { products, getLocalizedProduct, siteMeta } from "@/lib/seed-content";
import { translations, getLocaleFromSearchParams } from "@/lib/i18n";

type ProductsPageProps = {
  searchParams?: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: params?.lang ?? "fa" }));
  const t = translations[locale].products;
  return {
    title: t.heroTitle,
    description: t.heroText,
    openGraph: {
      title: t.heroTitle,
      description: t.heroText,
    },
  };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const locale = params?.lang === "en" ? "en" : "fa";
  const t = translations[locale].products;
  const localeQuery = `?lang=${locale}`;
  const isFa = locale === "fa";

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((product, index) => {
      const localized = getLocalizedProduct(product, locale);
      return {
        "@type": "ListItem",
        position: index + 1,
        url: `${siteMeta.url}/products/${product.slug}`,
        name: localized.title,
      };
    }),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: isFa ? "خانه" : "Home", item: siteMeta.url },
      {
        "@type": "ListItem",
        position: 2,
        name: t.heroTitle,
        item: `${siteMeta.url}/products`,
      },
    ],
  };

  return (
    <div dir={isFa ? "rtl" : "ltr"} lang={locale} className="min-h-screen bg-[#fdf8f3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#ce4a28] to-[#7a2412] px-4 py-16 text-center md:px-6 md:py-20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-24 -right-14 h-96 w-96 rounded-full bg-white/[0.04]" />

        <div className="relative">
          <SectionBadge tone="invert" className="mb-5">
            {t.heroBadge}
          </SectionBadge>
          <h1 className="mb-4 text-[clamp(1.9rem,5vw,3.2rem)] font-black text-white">
            {t.heroTitle}
          </h1>
          <p className="mx-auto max-w-xl text-base leading-[2] text-white/80">{t.heroText}</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-20">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product, index) => {
            const localized = getLocalizedProduct(product, locale);
            return (
              <ProductCard
                key={product.slug}
                href={`/products/${product.slug}${localeQuery}`}
                image={product.image}
                title={localized.title}
                description={localized.shortDescription}
                features={localized.features}
                badgeLabel={t.tordillaLabel}
                ctaLabel={t.viewDetails}
                priority={index < 4}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
