// app/shop/page.tsx
import Link from "next/link";
import { Clock, Package, Truck, Shield, Mail } from "lucide-react";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
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
  const content = await getSiteTranslations(locale);
  const t = content.shop as Record<string, any>;
  const commonT = content.common as Record<string, any>;
  const contactT = content.contact as Record<string, any>;
  const localeQuery = `?lang=${locale}`;

  const features = [
    { icon: Package, title: t.featurePackaging, desc: t.featurePackagingDesc },
    { icon: Shield, title: t.featureNatural, desc: t.featureNaturalDesc },
    { icon: Truck, title: t.featureShipping, desc: t.featureShippingDesc },
  ];

  return (
    <main className="min-h-screen" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero badge={t.heroBadge} title={t.heroTitle} text={t.heroText} />

      <BreadcrumbNav items={[{ label: commonT.home, href: `/?lang=${locale}` }, { label: t.breadcrumbCurrent }]} />

      <div className="mx-auto max-w-[1120px] px-6 pb-20 pt-8 md:pb-24">
        <SectionCard className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-leaf-50">
            <Clock className="h-12 w-12 text-leaf-600" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-ink md:text-3xl">{t.comingSoonTitle}</h2>
          <p className="mx-auto mb-8 max-w-2xl leading-relaxed text-ink-soft">{t.comingSoonText}</p>
          <Link
            href={`/contact${localeQuery}`}
            className="inline-flex items-center gap-2 rounded-full bg-leaf-600 px-8 py-3 font-extrabold text-white transition-all hover:-translate-y-0.5 hover:bg-leaf-700"
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
                className="rounded-card border border-line bg-cream p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-leaf-200 hover:bg-leaf-50"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-leaf-50">
                  <Icon className="h-7 w-7 text-leaf-600" />
                </div>
                <div className="mb-2 text-base font-extrabold text-ink">{title}</div>
                <div className="text-[13px] leading-relaxed text-ink-mute">{desc}</div>
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
