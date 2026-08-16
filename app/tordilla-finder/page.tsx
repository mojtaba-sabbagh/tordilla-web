import Link from "next/link";
import { Store } from "lucide-react";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

interface TordillaFinderPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: TordillaFinderPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.tordillaFinder as Record<string, any>;
  return {
    title: t.pageTitle,
    description: t.metaDescription,
  };
}

export default async function TordillaFinderPage({ searchParams }: TordillaFinderPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.tordillaFinder as Record<string, any>;
  const localeQuery = `?lang=${locale}`;

  return (
    <div className="min-h-screen" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero title={t.heroTitle} text={t.heroText} showLogo={false} />

      <BreadcrumbNav
        items={[
          { label: t.breadcrumbHome, href: `/?lang=${locale}` },
          { label: t.breadcrumbCurrent },
        ]}
      />

      <section className="mx-auto max-w-[1240px] px-4 py-12 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-card-lg border border-line bg-surface shadow-lift">
          <div className="aspect-video w-full">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1XXtufbZufrihTNWzWRG8mugSpE9cAkCT"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title={t.mapTitle}
              className="h-full min-h-[500px] w-full"
            />
          </div>
        </div>
      </section>

      <section className="bg-cream-warm py-16">
        <div className="mx-auto max-w-[1240px] px-4 text-center md:px-6 lg:px-8">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50">
            <Store className="h-8 w-8 text-leaf-600" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-leaf-700 md:text-3xl">{t.infoTitle}</h3>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-soft">{t.infoText}</p>
          <div className="mt-8">
            <Link
              href={`/contact${localeQuery}`}
              className="inline-flex min-h-12 items-center rounded-full bg-leaf-600 px-8 text-base font-extrabold text-white transition hover:bg-leaf-700"
            >
              {t.contactButton}
            </Link>
          </div>
        </div>
      </section>

      <section className="grain relative overflow-hidden bg-leaf-800 py-8">
        <div className="mx-auto max-w-[760px] px-5 text-center">
          <h4 className="mb-4 text-xl font-black text-white md:text-2xl">{t.socialHeading}</h4>
          <p className="mb-6 text-white/80">{t.socialText}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full bg-corn-400 px-6 text-sm font-extrabold text-leaf-900 shadow-glow-corn transition hover:-translate-y-0.5 hover:bg-corn-300"
            >
              {t.instagramButton}
            </a>
            <Link
              href={`/contact${localeQuery}`}
              className="inline-flex min-h-10 items-center rounded-full border-2 border-white px-5 text-sm font-bold text-white transition hover:bg-white hover:text-leaf-700"
            >
              {t.contactLink}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
