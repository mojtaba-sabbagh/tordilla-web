// app/cinema/page.tsx
import Link from "next/link";
import { MapPin, Ticket } from "lucide-react";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";
import { PageHero } from "@/components/ui/page-hero";
import { BreadcrumbNav } from "@/components/ui/breadcrumb-nav";

interface CinemaPageProps {
  searchParams: Promise<{ lang?: string }>;
}

export async function generateMetadata({ searchParams }: CinemaPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const t = translations[locale].cinema;
  return {
    title: t.pageTitle,
    description: t.metaDescription,
  };
}

const cinemas = [
  {
    nameFa: "پردیس سینمایی باغ کتاب",
    nameEn: "Bagh-e Ketab Cinema Complex",
    addressFa: "بزرگراه شهید حقانی - ورودی کتابخانه ملی - باغ کتاب تهران",
    addressEn: "Shahid Haqani Highway - National Library Entrance - Bagh-e Ketab, Tehran",
    ticketUrl: "https://cinematicket.org/?p=ncinemadet&cid=524",
  },
  {
    nameFa: "بولینگ عبدو",
    nameEn: "Abdo Bowling",
    addressFa: "بزرگراه صدر - خیابان شریعتی - مترو صدر",
    addressEn: "Sadr Highway - Shariati Street - Sadr Metro",
    ticketUrl: "https://cinematicket.org/?p=ncinemadet&cid=73",
  },
  {
    nameFa: "سینما فرهنگ",
    nameEn: "Farhang Cinema",
    addressFa: "خیابان شریعتی - بالاتر از خیابان دولت",
    addressEn: "Shariati Street - above Dolat Street",
    ticketUrl: "",
  },
  {
    nameFa: "پردیس سینمایی کورش",
    nameEn: "Cyrus Cinema Complex",
    addressFa: "بزرگراه شهید ستاری - نبش پیامبر مرکزی",
    addressEn: "Shahid Sattari Highway - intersection of Payambar Markazi",
    ticketUrl: "https://cinematicket.org/?p=ncinemadet&cid=448",
  },
  {
    nameFa: "پردیس سینمایی ملت",
    nameEn: "Mellat Cinema Complex",
    addressFa: "پارک ملت - خیابان ولیعصر - خیابان دستگردی",
    addressEn: "Mellat Park - Valiasr Street - Dastgerdi Street",
    ticketUrl: "",
  },
];

export default async function CinemaPage({ searchParams }: CinemaPageProps) {
  const { lang } = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: lang || "fa" }));
  const t = translations[locale].cinema;
  const localeQuery = `?lang=${locale}`;

  const localizedCinemas = cinemas.map((cinema) => ({
    name: locale === "fa" ? cinema.nameFa : cinema.nameEn,
    address: locale === "fa" ? cinema.addressFa : cinema.addressEn,
    ticketUrl: cinema.ticketUrl,
  }));

  return (
    <main className="min-h-screen bg-[#fdf8f3]" dir={locale === "fa" ? "rtl" : "ltr"}>
      <PageHero title={t.heroTitle} text={t.heroText} logoAlt="Tordilla" />

      <BreadcrumbNav
        items={[
          { label: t.breadcrumbHome, href: `/?lang=${locale}` },
          { label: t.breadcrumbCurrent },
        ]}
      />

      <section className="mx-auto max-w-3xl px-4 py-4 text-center md:px-6">
        <h2 className="text-xl font-bold text-[#8f2e18] md:text-2xl">{t.sectionTitle}</h2>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-8 md:px-6 md:py-12">
        <div className="space-y-4">
          {localizedCinemas.map((cinema) => (
            <div
              key={cinema.name}
              className="overflow-hidden rounded-2xl border border-neutral-100 bg-white shadow-md transition hover:shadow-lg"
            >
              <div className="p-5 md:p-6">
                <h3 className="mb-2 text-lg font-bold text-[#8f2e18] md:text-xl">{cinema.name}</h3>
                <div className="mb-4 flex items-start gap-2 text-sm text-neutral-600">
                  <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#ce4a28]" />
                  <p>{cinema.address}</p>
                </div>
                {cinema.ticketUrl ? (
                  <a
                    href={cinema.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-[#ce4a28] px-4 py-2 text-sm font-bold !text-white transition hover:bg-[#8f2e18]"
                  >
                    <Ticket className="h-4 w-4 text-white" />
                    {t.buyTicket}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 rounded-full bg-neutral-100 px-4 py-2 text-sm font-bold text-neutral-500">
                    <Ticket className="h-4 w-4" />
                    {t.buyTicket}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#fdf1e6] py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-[rgba(206,74,40,0.1)]">
            <span className="text-2xl">🎬</span>
          </div>
          <h3 className="mb-3 text-xl font-bold text-[#8f2e18] md:text-2xl">{t.infoTitle}</h3>
          <p className="leading-relaxed text-neutral-600">{t.infoText}</p>
        </div>
      </section>

      <section className="bg-gradient-to-br from-[#8f2e18] to-[#4a1509] py-12 text-white">
        <div className="mx-auto max-w-3xl px-4 text-center md:px-6">
          <h4 className="mb-4 text-xl font-black md:text-2xl">{t.ctaTitle}</h4>
          <p className="mx-auto mb-6 max-w-2xl text-white/80">{t.ctaText}</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={`/contact${localeQuery}`}
              className="inline-flex min-h-12 items-center rounded-full border-2 border-white px-6 font-bold text-white transition hover:bg-white hover:text-[#8f2e18]"
            >
              {t.contactButton}
            </Link>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-12 items-center rounded-full border-2 border-white px-6 font-bold text-white transition hover:bg-white hover:text-[#8f2e18]"
            >
              {t.instagramButton}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
