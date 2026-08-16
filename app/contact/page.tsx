// app/contact/page.tsx
import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SectionCard } from "@/components/ui/section-card";
import { SocialSection } from "@/components/social-icons";
import { ContactForm } from "./ContactForm";

interface ContactPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: ContactPageProps): Promise<Metadata> {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.contact as Record<string, any>;
  return {
    title: t.heroTitle,
    description: t.heroText,
    openGraph: { title: t.heroTitle, description: t.heroText },
  };
}

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.contact as Record<string, any>;
  const commonT = content.common as Record<string, any>;

  const infoCards = [
    { icon: MapPin, title: t.addressTitle, content: <>{t.addressLines[0]}<br />{t.addressLines[1]}</> },
    { icon: Phone, title: t.phoneTitle, content: <a href="tel:09426002408">{t.phoneNumber}</a> },
    { icon: Mail, title: t.emailTitle, content: <a href="mailto:it@tordilla.ir">{t.emailAddress}</a> },
    { icon: Clock, title: t.hoursTitle, content: t.hoursText },
  ];

  return (
    <main className="min-h-screen" dir={locale === "fa" ? "rtl" : "ltr"} lang={locale}>
      <PageHero badge={t.heroBadge} title={t.heroTitle} text={t.heroText} />

      <BreadcrumbNav items={[{ label: t.breadcrumbHome, href: `/?lang=${locale}` }, { label: t.breadcrumbCurrent }]} />

      <div className="mx-auto max-w-[1120px] px-6 pb-20 pt-8 md:pb-24">
        {/* Info cards */}
        <div className="mb-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {infoCards.map(({ icon: Icon, title, content }) => (
            <div
              key={title}
              className="rounded-card-lg border border-line bg-surface p-7 text-center shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-leaf-200 hover:shadow-lift"
            >
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-leaf-50">
                <Icon className="h-8 w-8 text-leaf-600" />
              </div>
              <h3 className="mb-2 text-lg font-extrabold text-ink">{title}</h3>
              <p className="text-sm leading-relaxed text-ink-soft">{content}</p>
            </div>
          ))}
        </div>

        {/* Form + Map */}
        <div className="mb-16 flex flex-col gap-8 md:flex-row">
          <div className="flex-1">
            <SectionCard className="h-full">
              <div className="mb-7 flex items-center gap-3">
                <span className="h-9 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-leaf-400 to-leaf-700" />
                <h2 className="text-[clamp(20px,2.8vw,28px)] font-black text-ink">{t.formHeading}</h2>
              </div>
              <ContactForm locale={locale} content={t} />
            </SectionCard>
          </div>

          <div className="flex-1">
            <div className="h-full overflow-hidden rounded-card-lg border border-line bg-surface shadow-soft">
              <div className="min-h-[420px] h-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3244.123456789012!2x55.3890!3x30.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0143e6b3c0e1%3A0x2b9a8f0b1c2d3e4f!2sRafsanjan%2C%20Kerman%20Province%2C%20Iran!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
                  title={t.mapTitle}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block h-full w-full min-h-[420px] border-0"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Company info */}
        <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="rounded-card-lg border border-line bg-surface p-8 shadow-soft">
            <h3 className="mb-4 border-s-4 border-corn-400 ps-4 text-xl font-extrabold text-ink">
              {t.companyCard1Title}
            </h3>
            <p className="text-sm leading-[1.9] text-ink-soft">{t.companyCard1Text}</p>
          </div>
          <div className="rounded-card-lg border border-line bg-surface p-8 shadow-soft">
            <h3 className="mb-4 border-s-4 border-corn-400 ps-4 text-xl font-extrabold text-ink">
              {t.companyCard2Title}
            </h3>
            <p className="text-sm leading-[1.9] text-ink-soft">{t.companyCard2Text}</p>
          </div>
        </div>

        {/* Instagram CTA */}
        <div className="relative mb-12 overflow-hidden rounded-card-lg grain bg-leaf-800 px-8 py-13 text-center">
          <div className="pointer-events-none absolute -left-16 -top-16 h-60 w-60 rounded-full bg-white/[0.06]" />
          <div className="pointer-events-none absolute -bottom-20 -right-12 h-72 w-72 rounded-full bg-white/[0.04]" />
          <div className="relative">
            <h2 className="mb-3 text-[clamp(22px,3vw,34px)] font-black text-white">{t.ctaHeading}</h2>
            <p className="mb-8 text-[15px] text-white/75">{t.ctaText}</p>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-full bg-white px-7 py-3 text-[15px] font-extrabold text-leaf-700 transition-all hover:-translate-y-0.5 hover:bg-cream-warm"
            >
              {t.ctaButton}
            </a>
          </div>
        </div>

        <SocialSection
          heading={commonT.socialHeading}
          labels={{
            instagram: t.instagramAria,
            twitter: t.twitterAria,
            facebook: t.facebookAria,
            aparat: t.aparatAria,
          }}
        />
      </div>
    </main>
  );
}
