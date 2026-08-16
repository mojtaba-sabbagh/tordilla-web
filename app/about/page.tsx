import Link from "next/link";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SectionCard, SectionHeading } from "@/components/ui/section-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { HealthPillars } from "@/components/ui/health-pillars";
import { getHealthPillars, getSecondaryFeatures } from "@/lib/health-pillars";

export const metadata = {
  title: "درباره ترددیلا | چیپس ذرت گلوتن فری با کلسیم مضاعف",
  description:
    "آشنایی با ترددیلا، تولیدکننده چیپس ذرت گلوتن فری با کلسیم مضاعف (بدلیل پخت در آهک) و جذب روغن بسیار کم (بدلیل پخت دو مرحله‌ای). آشنایی با محصولات، نام تجاری و شرکت کوثر کویر رفسنجان.",
  keywords: [
    "گلوتن فری",
    "چیپس ذرت گلوتن فری",
    "کلسیم مضاعف",
    "جذب روغن کم",
    "چیپس ذرت ترددیلا",
    "ترددیلا",
  ],
};

const aboutFaqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "آیا چیپس ذرت ترددیلا گلوتن فری است؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "بله، چیپس ذرت ترددیلا گلوتن فری است؛ زیرا ذرت به‌طور طبیعی گلوتن ندارد.",
      },
    },
    {
      "@type": "Question",
      name: "چرا چیپس ترددیلا کلسیم مضاعف دارد؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "به دلیل پخت ذرت در آهک (فرآیند نیکستامالیزاسیون)، چیپس ترددیلا کلسیم مضاعف دارد.",
      },
    },
    {
      "@type": "Question",
      name: "چرا چیپس ترددیلا جذب روغن بسیار کمی دارد؟",
      acceptedAnswer: {
        "@type": "Answer",
        text: "به دلیل پخت دو مرحله‌ای، چیپس ترددیلا جذب روغن بسیار کمی دارد.",
      },
    },
  ],
};

interface AboutPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export default async function AboutPage({ searchParams }: AboutPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.about as Record<string, any>;
  const isFa = locale === "fa";

  const pillars = getHealthPillars(t.features);
  const otherFeatures = getSecondaryFeatures(t.features, pillars);

  return (
    <main dir={isFa ? "rtl" : "ltr"}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutFaqJsonLd) }}
      />
      <PageHero badge={t.heroBadge} title={t.heroTitle} text={t.heroSubtitle} />

      <BreadcrumbNav
        items={[{ label: t.breadcrumbHome, href: `/?lang=${locale}` }, { label: t.heroTitle }]}
      />

      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-5 pb-8 pt-6 md:px-6">
        {/* ── Stats ── */}
        <AnimatedSection className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {(t.stats ?? []).map((s: any) => (
            <div
              key={s.label}
              className="group relative overflow-hidden rounded-card-lg border border-line bg-surface p-8 text-center shadow-soft transition-all duration-400 hover:-translate-y-1.5 hover:shadow-lift"
            >
              <span className="pointer-events-none absolute -top-14 start-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-corn-200/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0" />
              <div className="relative mb-2 text-[clamp(2.2rem,5vw,3.1rem)] font-black leading-none text-leaf-600">
                <span dir="ltr" lang="en" style={{ fontVariantNumeric: "lining-nums" }}>
                  {s.value}
                </span>
              </div>
              <div className="relative mb-1.5 text-[15px] font-black text-ink">{s.label}</div>
              <div className="relative text-[12.5px] font-medium text-ink-mute">{s.sub}</div>
            </div>
          ))}
        </AnimatedSection>
      </div>

      {/* ── The three claims the brand leads with ── */}
      {pillars.length > 0 && (
        <section className="grain relative overflow-hidden bg-leaf-800 px-5 py-16 md:px-6 md:py-20">
          <div className="pointer-events-none absolute -start-20 -top-24 h-80 w-80 rounded-full bg-leaf-500/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 -end-16 h-96 w-96 rounded-full bg-corn-500/15 blur-3xl" />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.1]"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "26px 26px",
            }}
          />

          <AnimatedSection className="relative mx-auto max-w-[1120px]">
            <HealthPillars items={pillars} />
          </AnimatedSection>
        </section>
      )}

      <div className="mx-auto flex max-w-[1120px] flex-col gap-8 px-5 py-16 md:px-6 md:py-20">
        {/* ── Products ── */}
        <AnimatedSection>
          <SectionCard>
            <SectionHeading>{t.productsHeading}</SectionHeading>
            <div className="flex flex-col gap-8">
              {(t.productSections ?? []).map((subSection: any, idx: number) => (
                <div key={idx} className="relative ps-5">
                  <span className="absolute inset-y-1 start-0 w-[3px] rounded-full bg-gradient-to-b from-corn-300 to-corn-500/20" />
                  <div className="mb-2.5 text-[16px] font-black text-leaf-600">
                    {subSection.productsSubheading}
                  </div>
                  <div className="flex flex-col gap-3.5 text-[15px] leading-[2.15] text-ink-soft">
                    {(subSection.productParagraphs ?? []).map((paragraph: any, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>
        </AnimatedSection>

        {/* ── Remaining product features ── */}
        {otherFeatures.length > 0 && (
          <AnimatedSection className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {otherFeatures.map((feature) => (
              <div
                key={feature.title}
                className="group rounded-card border border-line bg-surface px-4 py-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-leaf-200 hover:shadow-soft"
              >
                <span className="mx-auto mb-3.5 grid h-12 w-12 place-items-center rounded-full bg-cream-warm text-2xl transition-transform duration-300 group-hover:scale-110">
                  {feature.icon}
                </span>
                <div className="mb-1.5 text-[13.5px] font-black text-ink">{feature.title}</div>
                <div className="text-[12px] leading-[1.8] text-ink-mute">{feature.desc}</div>
              </div>
            ))}
          </AnimatedSection>
        )}

        {/* ── Brand ── */}
        <AnimatedSection>
          <SectionCard>
            <SectionHeading>{t.brandHeading}</SectionHeading>
            <div className="flex flex-col gap-6 text-[15px] leading-[2.15] text-ink-soft">
              <p>{t.brandParagraph}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {(t.brandQuotes ?? []).map((quote: any) => (
                  <div
                    key={quote}
                    className="rounded-card bg-leaf-50 px-6 py-5 text-center text-[15px] font-black text-leaf-700 ring-1 ring-leaf-100"
                  >
                    {quote}
                  </div>
                ))}
              </div>
            </div>
          </SectionCard>
        </AnimatedSection>

        {/* ── Company ── */}
        <AnimatedSection>
          <SectionCard>
            <SectionHeading>{t.companyHeading}</SectionHeading>
            <div className="flex flex-col gap-3.5 text-[15px] leading-[2.15] text-ink-soft">
              {(t.companyParagraphs ?? []).map((paragraph: any, index: number) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </SectionCard>
        </AnimatedSection>

        {/* ── CTA ── */}
        <AnimatedSection className="relative overflow-hidden rounded-card-lg border border-leaf-100 bg-gradient-to-br from-leaf-50 to-cream-warm px-6 py-12 text-center">
          <span className="pointer-events-none absolute -end-10 -top-10 h-40 w-40 rounded-full bg-corn-200/50 blur-3xl" />
          <h2 className="display relative mb-3 text-[clamp(1.3rem,2.8vw,2rem)] text-ink">
            {t.ctaHeading}
          </h2>
          <p className="relative mx-auto mb-8 max-w-md text-[14.5px] leading-[1.95] text-ink-mute">
            {t.ctaText}
          </p>
          <div className="relative flex flex-wrap justify-center gap-3">
            <Link
              href={`/contact?lang=${locale}`}
              className="inline-flex min-h-[50px] items-center rounded-full bg-leaf-600 px-7 text-[14.5px] font-extrabold text-white shadow-glow transition-all hover:-translate-y-0.5 hover:bg-leaf-700"
            >
              {t.ctaButtons?.contact}
            </Link>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[50px] items-center rounded-full border-2 border-leaf-200 bg-white/70 px-7 text-[14.5px] font-bold text-leaf-700 transition-all hover:-translate-y-0.5 hover:border-leaf-400 hover:bg-white"
            >
              {t.ctaButtons?.instagram}
            </a>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
