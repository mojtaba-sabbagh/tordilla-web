// app/agency/page.tsx
import Link from "next/link";
import { Clock, Mail, Phone, MapPin, Users, Award, TrendingUp, Headset } from "lucide-react";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SectionCard, SectionHeading } from "@/components/ui/section-card";
import { SocialSection } from "@/components/social-icons";

interface AgencyPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: AgencyPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  return {
    title: locale === "fa" ? "اخذ نمایندگی | چیپس ذرت ترددیلا" : "Become a Dealer | Tordilla Corn Chips",
    description:
      locale === "fa"
        ? "شرایط اخذ نمایندگی ترددیلا - به زودی با شرایط اختصاصی"
        : "Tordilla dealership terms - coming soon with exclusive conditions",
  };
}

export default async function AgencyPage({ searchParams }: AgencyPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.agency as Record<string, any>;
  const commonT = content.common as Record<string, any>;
  const contactT = content.contact as Record<string, any>;
  const localeQuery = `?lang=${locale}`;

  const benefits = [
    { icon: Award, title: t.benefitBrand, desc: t.benefitBrandDesc },
    { icon: TrendingUp, title: t.benefitGrowth, desc: t.benefitGrowthDesc },
    { icon: Headset, title: t.benefitSupport, desc: t.benefitSupportDesc },
    { icon: Users, title: t.benefitStable, desc: t.benefitStableDesc },
  ];

  const contactCards = [
    { icon: Phone, title: t.contactPhone, value: "۰۹۴۲۶۰۰۲۴۰۸" },
    { icon: Mail, title: t.contactEmail, value: "it@tordilla.ir" },
    { icon: MapPin, title: t.contactAddress, value: t.contactAddressText },
  ];

  return (
    <main className="min-h-screen bg-[#fdf8f3]" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero badge={t.heroBadge} title={t.heroTitle} text={t.heroText} />

      <BreadcrumbNav items={[{ label: commonT.home, href: `/?lang=${locale}` }, { label: t.breadcrumbCurrent }]} />

      <div className="mx-auto max-w-[1080px] px-6 py-16 md:py-20">
        <SectionCard className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-[rgba(206,74,40,0.08)]">
            <Clock className="h-12 w-12 text-[#ce4a28]" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-neutral-800 md:text-3xl">{t.comingSoonTitle}</h2>
          <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-neutral-600">{t.comingSoonText}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/contact${localeQuery}`}
              className="inline-flex items-center gap-2 rounded-full bg-[#ce4a28] px-7 py-3 font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8f2e18]"
            >
              <Mail size={18} />
              {t.contactButton}
            </Link>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#ce4a28] px-7 py-3 font-extrabold text-[#ce4a28] transition-all hover:-translate-y-0.5 hover:bg-[#ce4a28] hover:text-white"
            >
              {t.instagramButton}
            </a>
          </div>
        </SectionCard>

        <SectionCard className="mb-12">
          <SectionHeading>{t.benefitsTitle}</SectionHeading>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="rounded-2xl bg-[#fdf8f3] p-6 text-center transition-transform duration-250 hover:-translate-y-1.5">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(206,74,40,0.1)]">
                  <Icon className="h-8 w-8 text-[#ce4a28]" />
                </div>
                <div className="mb-2 text-lg font-extrabold text-[#2c1810]">{title}</div>
                <div className="text-[13px] leading-relaxed text-[#a07060]">{desc}</div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard className="mb-12">
          <SectionHeading>{t.contactTitle}</SectionHeading>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {contactCards.map(({ icon: Icon, title, value }) => (
              <div key={title} className="rounded-2xl border-b-[3px] border-[#ce4a28] bg-[#fdf8f3] p-6 text-center">
                <Icon className="mx-auto mb-3 h-8 w-8 text-[#ce4a28]" />
                <h4 className="mb-1.5 font-extrabold text-[#2c1810]">{title}</h4>
                <p className="text-[13px] text-[#5a3728]">{value}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-neutral-500">{t.contactNote}</p>
        </SectionCard>

        <SocialSection
          heading={t.socialHeading}
          labels={{
            instagram: contactT.instagramAria,
            twitter: contactT.twitterAria,
            facebook: contactT.facebookAria,
            aparat: contactT.aparatAria,
          }}
        />
      </div>
    </main>
  );
}
