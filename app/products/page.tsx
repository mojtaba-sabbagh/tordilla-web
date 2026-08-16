import type { Metadata } from "next";
import { ProductCard } from "@/components/product-card";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { products, getLocalizedProduct, siteMeta } from "@/lib/seed-content";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";

type ProductsPageProps = {
  searchParams?: Promise<{ lang?: string }>;
};

export async function generateMetadata({ searchParams }: ProductsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: params?.lang ?? "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.products as Record<string, any>;
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
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: params?.lang ?? "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.products as Record<string, any>;
  const commonT = content.common as Record<string, any>;
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
    <div dir={isFa ? "rtl" : "ltr"} lang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PageHero badge={t.heroBadge} title={t.heroTitle} text={t.heroText} showLogo={false} />

      <BreadcrumbNav
        items={[
          { label: commonT.home, href: `/?lang=${locale}` },
          { label: t.heroTitle },
        ]}
      />

      <div className="mx-auto max-w-6xl px-4 pb-20 pt-8 md:px-6 md:pb-24">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
