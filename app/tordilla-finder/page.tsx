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
    <div className="min-h-screen bg-[#fdf8f3]" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero title={t.heroTitle} text={t.heroText} showLogo={false} />

      <BreadcrumbNav
        items={[
          { label: t.breadcrumbHome, href: `/?lang=${locale}` },
          { label: t.breadcrumbCurrent },
        ]}
      />

      <section className="mx-auto max-w-[1240px] px-4 py-12 md:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[24px] border border-neutral-100 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
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

      <section className="bg-[#fdf1e6] py-16">
        <div className="mx-auto max-w-[1240px] px-4 text-center md:px-6 lg:px-8">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(206,74,40,0.1)]">
            <Store className="h-8 w-8 text-[#ce4a28]" />
          </div>
          <h3 className="mb-3 text-2xl font-bold text-[#8f2e18] md:text-3xl">{t.infoTitle}</h3>
          <p className="mx-auto max-w-2xl leading-relaxed text-neutral-600">{t.infoText}</p>
          <div className="mt-8">
            <Link
              href={`/contact${localeQuery}`}
              className="inline-flex min-h-12 items-center rounded-full bg-[#214c3f] px-8 text-base font-extrabold text-white transition hover:bg-[#173630]"
            >
              {t.contactButton}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#8f2e18] to-[#4a1509] py-8">
        <div className="mx-auto max-w-[760px] px-5 text-center">
          <h4 className="mb-4 text-xl font-black text-white md:text-2xl">{t.socialHeading}</h4>
          <p className="mb-6 text-white/80">{t.socialText}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-bold text-[#8f2e18] transition hover:bg-gray-100"
            >
              {t.instagramButton}
            </a>
            <Link
              href={`/contact${localeQuery}`}
              className="inline-flex min-h-10 items-center rounded-full border-2 border-white px-5 text-sm font-bold text-white transition hover:bg-white hover:text-[#8f2e18]"
            >
              {t.contactLink}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
