import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getLocalizedProduct, siteMeta } from "@/lib/seed-content";
import { getSiteTranslations } from "@/lib/site-content";
import { SectionBadge } from "@/components/ui/section-badge";
import { CtaLink } from "@/components/ui/cta-link";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

type ProductPageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ lang?: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params, searchParams }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const search = await searchParams;
  const locale = search?.lang === "en" ? "en" : "fa";
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};

  const localized = getLocalizedProduct(product, locale);
  return {
    title: localized.title,
    description: localized.shortDescription,
    openGraph: {
      title: localized.title,
      description: localized.shortDescription,
      images: [{ url: product.image }],
    },
  };
}

export default async function ProductPage({ params, searchParams }: ProductPageProps) {
  const search = await searchParams;
  const locale = search?.lang === "en" ? "en" : "fa";
  const content = await getSiteTranslations(locale);
  const t = content.productDetail as Record<string, any>;
  const localeQuery = `?lang=${locale}`;
  const isFa = locale === "fa";

  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);

  if (!product) notFound();

  const localized = getLocalizedProduct(product, locale);
  const related = products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const nutritionRows = [
    { label: t.nutritionLabels.serving, value: localized.nutrition.serving, icon: "⚖️" },
    { label: t.nutritionLabels.energy, value: localized.nutrition.energy, icon: "⚡" },
    { label: t.nutritionLabels.sugar, value: localized.nutrition.sugar, icon: "🍬" },
    { label: t.nutritionLabels.fat, value: localized.nutrition.fat, icon: "🫧" },
    { label: t.nutritionLabels.salt, value: localized.nutrition.salt, icon: "🧂" },
    { label: t.nutritionLabels.transFat, value: localized.nutrition.transFat, icon: "🔬" },
  ];

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: localized.title,
    description: localized.description,
    image: `${siteMeta.url}${product.image}`,
    brand: { "@type": "Brand", name: "Tordilla" },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: t.breadcrumbHome, item: siteMeta.url },
      {
        "@type": "ListItem",
        position: 2,
        name: t.breadcrumbProducts,
        item: `${siteMeta.url}/products`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: localized.title,
        item: `${siteMeta.url}/products/${product.slug}`,
      },
    ],
  };

  return (
    <div dir={isFa ? "rtl" : "ltr"} lang={locale}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <BreadcrumbNav
        items={[
          { label: t.breadcrumbHome, href: `/?lang=${locale}` },
          { label: t.breadcrumbProducts, href: `/products${localeQuery}` },
          { label: localized.title },
        ]}
        className="max-w-5xl"
      />

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pt-6 md:grid-cols-2 md:gap-12 md:px-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-card-lg bg-cream-warm shadow-lift ring-1 ring-line">
          <Image
            src={product.image}
            alt={localized.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute end-4 top-4 rounded-full bg-white/90 px-4 py-1.5 text-[12.5px] font-black text-leaf-700 shadow-sm backdrop-blur">
            {isFa ? "ترددیلا" : "Tordilla"}
          </span>
        </div>

        <div className="pt-1">
          <SectionBadge className="mb-4">{t.heroBadge}</SectionBadge>
          <h1 className="display mb-4 text-[clamp(1.7rem,4vw,2.8rem)] text-ink">
            {localized.title}
          </h1>
          <p className="mb-7 text-[15.5px] leading-[2.05] text-ink-soft">
            {localized.shortDescription}
          </p>

          <div className="mb-8 flex flex-wrap gap-2">
            {localized.features.map((f) => (
              <span
                key={f}
                className="rounded-full bg-leaf-50 px-4 py-1.5 text-[12.5px] font-bold text-leaf-600"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="mb-9 flex flex-wrap gap-3">
            <div className="flex min-w-[110px] flex-col rounded-card border border-line bg-surface px-5 py-3.5 shadow-soft">
              <span className="mb-1 text-[11px] font-bold text-ink-mute">{t.packagingLabel}</span>
              <span className="text-sm font-black text-ink">{localized.packaging}</span>
            </div>
            <div className="flex min-w-[110px] flex-col rounded-card border border-line bg-surface px-5 py-3.5 shadow-soft">
              <span className="mb-1 text-[11px] font-bold text-ink-mute">{t.audienceLabel}</span>
              <span className="text-sm font-black text-ink">{localized.audience}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <CtaLink href={`/tordilla-finder${localeQuery}`} variant="primary">
              {t.whereToBuy}
            </CtaLink>
            <CtaLink href={`/products${localeQuery}`} variant="outline">
              {t.productsButton}
            </CtaLink>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-14 flex max-w-5xl flex-col gap-6 px-4 pb-20 md:px-6 md:pb-24">
        <div className="rounded-card-lg border border-line bg-surface p-7 shadow-soft md:p-9">
          <h3 className="mb-5 flex items-center gap-3 text-xl font-black text-ink">
            <span className="grid h-10 w-10 place-items-center rounded-tile bg-leaf-50 text-lg">
              📖
            </span>
            {t.descriptionHeading}
          </h3>
          <p className="text-[15px] leading-[2.15] text-ink-soft">{localized.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-card-lg border border-line bg-surface p-7 shadow-soft md:p-9">
            <h3 className="mb-5 flex items-center gap-3 text-xl font-black text-ink">
              <span className="grid h-10 w-10 place-items-center rounded-tile bg-leaf-50 text-lg">
                🥗
              </span>
              {t.nutritionHeading}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {nutritionRows.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-start gap-1 rounded-tile border border-line bg-cream px-4 py-4 transition-colors hover:border-leaf-200 hover:bg-leaf-50"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-[11.5px] font-bold text-ink-mute">{label}</span>
                  <span className="text-[15px] font-black text-ink">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-card-lg border border-line bg-surface p-7 shadow-soft md:p-9">
            <h3 className="mb-5 flex items-center gap-3 text-xl font-black text-ink">
              <span className="grid h-10 w-10 place-items-center rounded-tile bg-leaf-50 text-lg">
                🌽
              </span>
              {t.relatedHeading}
            </h3>
            <div className="flex flex-col gap-2.5">
              {related.map((item) => {
                const relatedLocalized = getLocalizedProduct(item, locale);
                return (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}${localeQuery}`}
                    className="group flex items-center gap-3.5 rounded-tile border border-line bg-cream px-3.5 py-3 font-bold text-ink transition-all hover:border-leaf-200 hover:bg-leaf-50"
                  >
                    <span className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.image} alt={relatedLocalized.title} fill sizes="48px" className="object-cover" />
                    </span>
                    <span className="flex-1 text-[13.5px]">{relatedLocalized.title}</span>
                    <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf-50 text-leaf-600 transition-all duration-300 group-hover:bg-corn-400 group-hover:text-leaf-900 rtl:rotate-180">
                      ›
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
