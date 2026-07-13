import Link from "next/link";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SectionCard, SectionHeading } from "@/components/ui/section-card";

export const metadata = {
  title: "درباره ترددیلا | چیپس ذرت ترددیلا",
  description:
    "آشنایی با ترددیلا، محصولات، نام تجاری و شرکت کوثر کویر رفسنجان - تولید کننده چیپس ذرت با کیفیت",
};

interface AboutPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.about as Record<string, any>;

  return (
    <main className="min-h-screen bg-[#fdf8f3]" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero badge={t.heroBadge} title={t.heroTitle} text={t.heroSubtitle} />

      <BreadcrumbNav items={[{ label: t.breadcrumbHome, href: `/?lang=${locale}` }, { label: t.heroTitle }]} />

      <div className="mx-auto flex max-w-[1080px] flex-col gap-8 px-6 py-16 md:py-20">
        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {t.stats.map((s) => (
            <div
              key={s.label}
              className="rounded-[22px] border-b-4 border-[#ce4a28] bg-white p-8 text-center shadow-[0_8px_32px_rgba(206,74,40,0.07)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_48px_rgba(206,74,40,0.14)]"
            >
              <div className="mb-2 text-[clamp(2.2rem,5vw,3.25rem)] font-black leading-none text-[#ce4a28]">
                <span dir="ltr" lang="en" style={{ fontVariantNumeric: "lining-nums" }}>
                  {s.value}
                </span>
              </div>
              <div className="mb-1 text-[15px] font-extrabold text-[#2c1810]">{s.label}</div>
              <div className="text-xs font-medium text-[#a07060]">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Products */}
        <SectionCard>
          <SectionHeading>{t.productsHeading}</SectionHeading>
          {t.productSections.map((subSection, idx) => (
            <div key={idx} className="mb-6 last:mb-0">
              <div className="mb-1.5 text-base font-bold text-[#ce4a28]">{subSection.productsSubheading}</div>
              <div className="flex flex-col gap-3.5 text-[15px] leading-[2.1] text-[#5a3728]">
                {subSection.productParagraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>
          ))}
        </SectionCard>

        {/* Features */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
          {t.features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border-[1.5px] border-[rgba(206,74,40,0.1)] bg-[#fdf8f3] px-4.5 py-6 text-center transition-all duration-250 hover:-translate-y-1 hover:border-[rgba(206,74,40,0.3)] hover:bg-[#fdf0e8]"
            >
              <span className="mb-3 block text-3xl">{feature.icon}</span>
              <div className="mb-1.5 text-sm font-extrabold text-[#2c1810]">{feature.title}</div>
              <div className="text-xs leading-[1.7] text-[#a07060]">{feature.desc}</div>
            </div>
          ))}
        </div>

        {/* Brand */}
        <SectionCard>
          <SectionHeading>{t.brandHeading}</SectionHeading>
          <div className="flex flex-col gap-3.5 text-[15px] leading-[2.1] text-[#5a3728]">
            <p>{t.brandParagraph}</p>
            <div className="flex flex-col gap-3">
              {t.brandQuotes.map((quote) => (
                <div
                  key={quote}
                  className="rounded-r-none rounded-l-xl border-r-4 border-[#ce4a28] bg-[rgba(206,74,40,0.05)] px-5 py-3 text-[15px] font-bold text-[#8f2e18]"
                >
                  {quote}
                </div>
              ))}
            </div>
          </div>
        </SectionCard>

        {/* Company */}
        <SectionCard>
          <SectionHeading>{t.companyHeading}</SectionHeading>
          <div className="flex flex-col gap-3.5 text-[15px] leading-[2.1] text-[#5a3728]">
            {t.companyParagraphs.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
        </SectionCard>

        {/* CTA */}
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/contact?lang=${locale}`}
            className="inline-flex items-center rounded-full bg-white px-7 py-3 text-[15px] font-extrabold text-[#8f2e18] transition-all hover:-translate-y-0.5 hover:bg-[#f5ede6]"
          >
            {t.ctaButtons.contact}
          </Link>
          <a
            href="https://instagram.com/tordillachips/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full border-2 border-[rgba(143,46,24,0.25)] px-7 py-3 text-[15px] font-bold text-[#8f2e18] transition-all hover:-translate-y-0.5 hover:border-[#8f2e18] hover:bg-[rgba(143,46,24,0.05)]"
          >
            {t.ctaButtons.instagram}
          </a>
        </div>
      </div>
    </main>
  );
}
