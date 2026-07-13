import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { products, getLocalizedProduct, siteMeta } from "@/lib/seed-content";
import { getSiteTranslations } from "@/lib/site-content";
import { SectionBadge } from "@/components/ui/section-badge";
import { CtaLink } from "@/components/ui/cta-link";

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
    <div dir={isFa ? "rtl" : "ltr"} lang={locale} className="min-h-screen bg-[#fdf8f3]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <nav className="mx-auto flex max-w-5xl items-center gap-2 px-4 pt-6 text-[13px] text-[#a07060] md:px-6">
        <Link href={`/?lang=${locale}`} className="font-semibold text-[#8f2e18] hover:underline">
          {t.breadcrumbHome}
        </Link>
        <span className="text-[#cbb0a0]">›</span>
        <Link href={`/products${localeQuery}`} className="font-semibold text-[#8f2e18] hover:underline">
          {t.breadcrumbProducts}
        </Link>
        <span className="text-[#cbb0a0]">›</span>
        <span>{localized.title}</span>
      </nav>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-4 pt-10 md:grid-cols-2 md:gap-12 md:px-6">
        <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] bg-[#f0e6dc] shadow-[0_24px_64px_rgba(206,74,40,0.16)]">
          <Image
            src={product.image}
            alt={localized.title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <span className="absolute top-4.5 right-4.5 rounded-full bg-[rgba(206,74,40,0.9)] px-4 py-1.5 text-[13px] font-bold text-white backdrop-blur">
            {isFa ? "ترددیلا" : "Tordilla"}
          </span>
        </div>

        <div className="pt-2">
          <SectionBadge className="mb-4">{t.heroBadge}</SectionBadge>
          <h1 className="mb-4 text-[clamp(1.7rem,4vw,2.9rem)] font-black leading-[1.25] text-[#2c1810]">
            {localized.title}
          </h1>
          <p className="mb-7 text-base leading-[2] text-[#7a5040]">{localized.shortDescription}</p>

          <div className="mb-8 flex flex-wrap gap-2">
            {localized.features.map((f) => (
              <span
                key={f}
                className="rounded-full bg-[rgba(206,74,40,0.08)] px-4 py-1.5 text-[13px] font-semibold text-[#8f2e18]"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="mb-9 flex flex-wrap gap-3">
            <div className="flex min-w-[100px] flex-col rounded-2xl bg-white px-5 py-3 shadow-[0_4px_16px_rgba(206,74,40,0.08)]">
              <span className="mb-1 text-[11px] font-semibold text-[#a07060]">{t.packagingLabel}</span>
              <span className="text-sm font-extrabold text-[#2c1810]">{localized.packaging}</span>
            </div>
            <div className="flex min-w-[100px] flex-col rounded-2xl bg-white px-5 py-3 shadow-[0_4px_16px_rgba(206,74,40,0.08)]">
              <span className="mb-1 text-[11px] font-semibold text-[#a07060]">{t.audienceLabel}</span>
              <span className="text-sm font-extrabold text-[#2c1810]">{localized.audience}</span>
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

      <div className="mx-auto mt-14 flex max-w-5xl flex-col gap-7 px-4 pb-20 md:px-6">
        <div className="rounded-[26px] bg-white p-7 shadow-[0_8px_32px_rgba(206,74,40,0.07)] md:p-9">
          <h3 className="mb-5 flex items-center gap-2.5 text-xl font-black text-[#2c1810]">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(206,74,40,0.1)] text-lg">
              📖
            </span>
            {t.descriptionHeading}
          </h3>
          <p className="text-[15px] leading-[2] text-[#5a3728]">{localized.description}</p>
        </div>

        <div className="grid grid-cols-1 gap-7 md:grid-cols-2">
          <div className="rounded-[26px] bg-white p-7 shadow-[0_8px_32px_rgba(206,74,40,0.07)] md:p-9">
            <h3 className="mb-5 flex items-center gap-2.5 text-xl font-black text-[#2c1810]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(206,74,40,0.1)] text-lg">
                🥗
              </span>
              {t.nutritionHeading}
            </h3>
            <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
              {nutritionRows.map(({ label, value, icon }) => (
                <div
                  key={label}
                  className="flex flex-col items-start gap-1 rounded-2xl border-[1.5px] border-[rgba(206,74,40,0.09)] bg-[#fdf8f3] px-4.5 py-4 transition-colors hover:border-[rgba(206,74,40,0.22)] hover:bg-[#fdf0e8]"
                >
                  <span className="text-xl">{icon}</span>
                  <span className="text-xs font-semibold text-[#a07060]">{label}</span>
                  <span className="text-base font-extrabold text-[#2c1810]">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[26px] bg-white p-7 shadow-[0_8px_32px_rgba(206,74,40,0.07)] md:p-9">
            <h3 className="mb-5 flex items-center gap-2.5 text-xl font-black text-[#2c1810]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(206,74,40,0.1)] text-lg">
                🌽
              </span>
              {t.relatedHeading}
            </h3>
            <div className="flex flex-col gap-3">
              {related.map((item) => {
                const relatedLocalized = getLocalizedProduct(item, locale);
                return (
                  <Link
                    key={item.slug}
                    href={`/products/${item.slug}${localeQuery}`}
                    className="group flex items-center gap-3.5 rounded-2xl border-[1.5px] border-[rgba(206,74,40,0.09)] bg-[#fdf8f3] px-4 py-3 font-bold text-[#2c1810] transition-all hover:-translate-x-1 hover:border-[rgba(206,74,40,0.22)] hover:bg-[#fdf0e8] rtl:hover:translate-x-1"
                  >
                    <span className="relative h-13 w-13 flex-shrink-0 overflow-hidden rounded-xl">
                      <Image src={item.image} alt={relatedLocalized.title} fill sizes="52px" className="object-cover" />
                    </span>
                    <span className="flex-1 text-sm">{relatedLocalized.title}</span>
                    <span className="text-lg text-[#8f2e18]">‹</span>
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
