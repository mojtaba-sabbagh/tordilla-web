// app/shop/page.tsx
import Link from "next/link";
import { Clock, Package, Truck, Shield, Mail } from "lucide-react";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";
import { SectionCard, SectionHeading } from "@/components/ui/section-card";
import { SocialSection } from "@/components/social-icons";

interface ShopPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: ShopPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  return {
    title: locale === "fa" ? "فروشگاه | چیپس ذرت ترددیلا" : "Shop | Tordilla Corn Chips",
    description:
      locale === "fa"
        ? "خرید آنلاین چیپس ذرت ترددیلا - به زودی با بهترین قیمت‌ها"
        : "Buy Tordilla corn chips online – coming soon with best prices",
  };
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const t = translations[locale].shop;
  const commonT = translations[locale].common;
  const contactT = translations[locale].contact;
  const localeQuery = `?lang=${locale}`;

  const features = [
    { icon: Package, title: t.featurePackaging, desc: t.featurePackagingDesc },
    { icon: Shield, title: t.featureNatural, desc: t.featureNaturalDesc },
    { icon: Truck, title: t.featureShipping, desc: t.featureShippingDesc },
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
          <Link
            href={`/contact${localeQuery}`}
            className="inline-flex items-center gap-2 rounded-full bg-[#ce4a28] px-8 py-3 font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-[#8f2e18]"
          >
            <Mail size={18} />
            {t.contactButton}
          </Link>
        </SectionCard>

        <SectionCard className="mb-12">
          <SectionHeading>{t.featuresTitle}</SectionHeading>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {features.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="rounded-[20px] border-[1.5px] border-[rgba(206,74,40,0.1)] bg-[#fdf8f3] p-7 text-center transition-all duration-250 hover:-translate-y-1 hover:border-[rgba(206,74,40,0.3)] hover:bg-[#fdf0e8]"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(206,74,40,0.1)]">
                  <Icon className="h-7 w-7 text-[#ce4a28]" />
                </div>
                <div className="mb-2 text-base font-extrabold text-[#2c1810]">{title}</div>
                <div className="text-[13px] leading-relaxed text-[#a07060]">{desc}</div>
              </div>
            ))}
          </div>
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
