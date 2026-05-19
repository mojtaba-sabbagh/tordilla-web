// app/cinema/page.tsx
import Link from "next/link";
import { MapPin, Ticket, Popcorn } from "lucide-react";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";

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

  const localizedCinemas = cinemas.map(cinema => ({
    name: locale === "fa" ? cinema.nameFa : cinema.nameEn,
    address: locale === "fa" ? cinema.addressFa : cinema.addressEn,
    ticketUrl: cinema.ticketUrl,
  }));

  return (
    <main className="bg-white" dir={locale === "fa" ? "rtl" : "ltr"}>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8f1d1d]/10 mb-6">
              <Popcorn className="w-10 h-10 text-[#8f1d1d]" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#8f1d1d] mb-4">
              {t.heroTitle}
            </h1>
            <p className="text-base md:text-lg text-neutral-600">
              {t.heroText}
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="text-sm text-neutral-500">
          <Link href={`/?lang=${locale}`} className="hover:text-[#8f1d1d] transition">
            {t.breadcrumbHome}
          </Link>{" "}
          &gt; <span className="text-[#8f1d1d]">{t.breadcrumbCurrent}</span>
        </div>
      </div>

      {/* Title Section */}
      <section className="container mx-auto px-4 md:px-6 py-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[#8f1d1d]">
            {t.sectionTitle}
          </h2>
        </div>
      </section>

      {/* Cinemas List */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {localizedCinemas.map((cinema) => (
            <div
              key={cinema.name}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100 transition hover:shadow-lg"
            >
              <div className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-[#8f1d1d] mb-2">
                  {cinema.name}
                </h3>
                <div className="flex items-start gap-2 text-neutral-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-[#8f1d1d] flex-shrink-0 mt-0.5" />
                  <p>{cinema.address}</p>
                </div>
                {cinema.ticketUrl ? (
                  <a
                    href={cinema.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#8f1d1d] !text-white px-4 py-2 rounded-full text-sm font-bold transition hover:bg-[#6b1616]"
                  >
                    <Ticket className="w-4 h-4 text-white" />
                    {t.buyTicket}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-500 px-4 py-2 rounded-full text-sm font-bold">
                    <Ticket className="w-4 h-4" />
                    {t.buyTicket}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[#f6f1ec] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8f1d1d]/10 mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#8f1d1d] mb-3">
              {t.infoTitle}
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              {t.infoText}
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8f1d1d] py-12 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h4 className="text-xl md:text-2xl font-black mb-4">
            {t.ctaTitle}
          </h4>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            {t.ctaText}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href={`/contact${localeQuery}`}
              className="inline-block rounded-full border-2 border-white text-[#8f1d1d] px-6 py-2.5 font-bold transition"
            >
              {t.contactButton}
            </Link>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border-2 border-white px-6 py-2.5 font-bold transition"
            >
              {t.instagramButton}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}