// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";
import { ProductCard } from "@/components/product-card";
import { SectionBadge } from "@/components/ui/section-badge";
import { CtaLink } from "@/components/ui/cta-link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { getLocaleFromSearchParams, Locale } from "@/lib/i18n";
import { getSiteTranslations } from "@/lib/site-content";
import { products, getLocalizedProduct } from "@/lib/seed-content";
import { getPaginatedBlogPosts } from "@/lib/blog-data";

const sliderImages = [
  "/home/slider/where-1024x447.jpg",
  "/home/slider/tamas-ba-ma-small-size-min-1024x447.jpg",
  "/home/slider/tortella-mexico-min-800x350.jpg",
  "/home/slider/tortella-salsa-min-800x350.jpg",
];

const retailers = [
  { name: "دیجی‌کالا", image: "/home/brands/digikala.png" },
  { name: "مزبار", image: "/home/brands/mazbar.png" },
  { name: "شهروند", image: "/home/brands/shahrvand.png" },
  { name: "رفاه", image: "/home/brands/refah.png" },
  { name: "کنبو", image: "/home/brands/canbo.png" },
  { name: "پالادیوم", image: "/home/brands/paladium.png" },
  { name: "روکو", image: "/home/brands/roco.png" },
];

function formatPostDate(date: Date, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR-u-ca-persian" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}

export default async function HomePage({
  searchParams,
}: {
  searchParams?: Promise<{ lang?: string }>;
}) {
  const params = await searchParams;
  const locale = getLocaleFromSearchParams(new URLSearchParams({ lang: params?.lang ?? "fa" }));
  const content = await getSiteTranslations(locale);
  const t = content.home as Record<string, any>;
  const localeQuery = `?lang=${locale}`;
  const isFa = locale === "fa";

  let latestPosts: Awaited<ReturnType<typeof getPaginatedBlogPosts>>["posts"] = [];
  try {
    const result = await getPaginatedBlogPosts(1, 3);
    latestPosts = result.posts;
  } catch {
    latestPosts = [];
  }

  const stats = (content.about as Record<string, any>).stats;

  return (
    <div dir={isFa ? "rtl" : "ltr"} lang={locale} className="bg-[#fdf8f3]">
      {/* ── SLIDER ── */}
      <HomeSlider images={sliderImages} />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden px-4 py-20 text-center md:px-6 md:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#ce4a28]/20 blur-3xl" />
          <div className="absolute -right-20 top-4 h-96 w-96 rounded-full bg-[#214c3f]/15 blur-3xl" />
          <div className="absolute left-[8%] top-[20%] hidden text-5xl opacity-70 animate-float-a sm:block md:text-6xl">🌽</div>
          <div className="absolute right-[10%] top-[14%] hidden text-4xl opacity-60 animate-float-b sm:block md:text-5xl">🧀</div>
          <div className="absolute bottom-[14%] left-[14%] hidden text-4xl opacity-50 animate-float-b sm:block md:text-5xl">🌶️</div>
          <div className="absolute bottom-[20%] right-[14%] hidden text-3xl opacity-60 animate-float-a sm:block">✨</div>
        </div>

        <AnimatedSection className="relative z-10 mx-auto max-w-2xl">
          <SectionBadge className="mb-5">{t.heroTag}</SectionBadge>
          <h1 className="mb-5 bg-gradient-to-br from-[#e05a30] via-[#8f2e18] to-[#5c1c10] bg-clip-text text-[clamp(2.4rem,6vw,4.4rem)] font-black leading-[1.15] tracking-tight text-transparent">
            {t.heroTitle}
          </h1>
          <Image
            src="/home/logo.png"
            alt={isFa ? "لوگوی ترددیلا" : "Tordilla logo"}
            width={150}
            height={150}
            className="mx-auto mb-6 h-auto w-[clamp(110px,12vw,150px)] drop-shadow-[0_12px_24px_rgba(206,74,40,0.25)]"
          />
          <p className="mx-auto mb-7 max-w-lg text-lg leading-[1.9] text-[#675247]">
            {t.heroText}
          </p>

          <div className="mb-9 flex flex-wrap items-center justify-center gap-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-2 rounded-full border border-[rgba(206,74,40,0.15)] bg-white/75 px-4 py-2 shadow-sm backdrop-blur"
              >
                <span dir="ltr" className="text-base font-black text-[#ce4a28]">
                  {s.value}
                </span>
                <span className="text-xs font-semibold text-[#675247]">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <CtaLink href={`/products${localeQuery}`} variant="primary">
              {t.heroButton}
            </CtaLink>
            <CtaLink href={`/tordilla-finder${localeQuery}`} variant="outline">
              {t.finderButton}
            </CtaLink>
          </div>
        </AnimatedSection>
      </section>

      <hr className="border-t border-[rgba(76,50,33,0.12)]" />

      {/* ── FLAVORS ── */}
      <section className="relative overflow-hidden px-4 py-16 md:px-6 md:py-20">
        <div className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-[#ce4a28]/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-[#214c3f]/10 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-6xl">
          <AnimatedSection className={`mb-11 ${isFa ? "text-center" : "text-left"}`}>
            <SectionBadge className="mb-3">{t.flavorsTag}</SectionBadge>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.6rem)] font-black tracking-tight text-[#8f2e18]">
              {t.flavorsHeading}
            </h2>
            <p className="mt-2.5 text-[15px] text-[#7a5040]">{t.flavorsSubheading}</p>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product, index) => {
              const localized = getLocalizedProduct(product, locale);
              return (
                <AnimatedSection key={product.slug} delay={index * 60}>
                  <ProductCard
                    href={`/products/${product.slug}${localeQuery}`}
                    image={product.image}
                    title={localized.title}
                    description={localized.shortDescription}
                    badgeLabel={isFa ? "ترددیلا" : "Tordilla"}
                    ctaLabel={t.flavorCta}
                    priority={index < 2}
                  />
                </AnimatedSection>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <CtaLink href={`/products${localeQuery}`} variant="outline">
              {t.allFlavorsButton}
            </CtaLink>
          </div>
        </div>
      </section>

      {/* ── CINEMA ── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ce4a28] to-[#7a2412] px-4 py-16 md:px-6 md:py-20">
        <div className="pointer-events-none absolute -left-16 -top-16 h-60 w-60 rounded-full bg-white/[0.06]" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-white/[0.04]" />

        <AnimatedSection className="relative mx-auto max-w-2xl">
          <div className="mb-9 text-center">
            <SectionBadge tone="invert" className="mb-3">
              {t.cinemaTag}
            </SectionBadge>
            <h2 className="text-[clamp(1.4rem,3vw,2.3rem)] font-black text-white">
              {t.cinemaHeading}
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["/home/cinema/cinema-01.png", "/home/cinema/cinema-02.png"].map((src) => (
              <div key={src} className="overflow-hidden rounded-2xl bg-white/10 p-1.5">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl">
                  <Image src={src} alt={isFa ? "سینما" : "Cinema"} fill sizes="(max-width: 640px) 50vw, 320px" className="object-cover" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <CtaLink href={`/cinema${localeQuery}`} variant="accent">
              {t.cinemaButton}
            </CtaLink>
          </div>
        </AnimatedSection>
      </section>

      {/* ── WHERE TO BUY ── */}
      <section className="overflow-hidden bg-[#fdf1e6] py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <AnimatedSection className="mb-12 text-center">
            <SectionBadge className="mb-3">{t.whereBuyTag}</SectionBadge>
            <h2 className="text-[clamp(1.6rem,3.5vw,2.6rem)] font-black tracking-tight text-[#8f2e18]">
              {t.whereBuyHeading}
            </h2>
            <p className="mt-2.5 text-[15px] text-[#7a5040]">{t.whereBuyText}</p>
          </AnimatedSection>
        </div>

        <div className="group relative [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div dir="ltr" className="flex w-max gap-5 animate-marquee group-hover:[animation-play-state:paused]">
            {[...retailers, ...retailers].map((r, i) => (
              <div
                key={`${r.name}-${i}`}
                className="flex h-28 w-44 flex-shrink-0 items-center justify-center rounded-[22px] bg-white p-6 shadow-[0_8px_32px_rgba(206,74,40,0.08)] transition-all duration-250 hover:-translate-y-1 hover:shadow-[0_18px_48px_rgba(206,74,40,0.16)]"
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  width={140}
                  height={72}
                  className="h-auto max-h-[64px] w-auto max-w-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-6xl px-4 text-center md:px-6">
          <CtaLink href={`/tordilla-finder${localeQuery}`} variant="accent">
            {t.finderButton}
          </CtaLink>
        </div>
      </section>

      <hr className="border-t border-[rgba(76,50,33,0.12)]" />

      {/* ── BLOG ── */}
      <section className="mx-auto max-w-6xl px-4 py-20 md:px-6">
        <AnimatedSection className="mb-11 flex flex-wrap items-baseline justify-between gap-3">
          <div>
            <SectionBadge className="mb-1.5">{t.blogTag}</SectionBadge>
            <h2 className="mt-1.5 text-[clamp(1.4rem,3vw,2.3rem)] font-black text-[#8f2e18]">
              {t.blogHeading}
            </h2>
          </div>
          <Link
            href={`/blog${localeQuery}`}
            className="border-b-2 border-[#8f2e18] pb-0.5 text-sm font-bold text-[#8f2e18]"
          >
            {t.blogAllPosts}
          </Link>
        </AnimatedSection>

        {latestPosts.length === 0 ? (
          <p className="rounded-2xl bg-white p-10 text-center text-[#7a5040] shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
            {isFa ? "به‌زودی مطالب تازه منتشر می‌شود." : "New posts are coming soon."}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {latestPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}${localeQuery}`}
                  className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_6px_20px_rgba(0,0,0,0.07)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(0,0,0,0.13)]"
                >
                  <div className="relative aspect-[16/9] w-full overflow-hidden">
                    <Image
                      src={post.image}
                      alt={post.title[locale]}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="mb-2.5 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-[rgba(206,74,40,0.1)] px-3 py-0.5 text-xs font-bold text-[#8f2e18]">
                        {post.category[locale]}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {formatPostDate(post.date, locale)}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-extrabold leading-[1.6] text-[#2c1810]">
                      {post.title[locale]}
                    </h3>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>

      {/* ── SOCIAL ── */}
      <section className="bg-gradient-to-br from-[#8f2e18] to-[#4a1509] px-4 py-16 md:px-6">
        <AnimatedSection className="mx-auto max-w-2xl text-center">
          <SectionBadge tone="invert" className="mb-3.5">
            {t.socialTag}
          </SectionBadge>
          <h2 className="mb-3 text-[clamp(1.3rem,3vw,2.1rem)] font-black text-white">
            {t.socialHeading}
          </h2>
          <p className="mb-9 text-[15px] text-white/70">{t.socialText}</p>
          <div className="flex flex-wrap items-center justify-center gap-5">
            {t.socialNetworks.map(({ label, href, emoji }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="inline-flex min-w-[100px] flex-col items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-6 py-4.5 text-[13px] font-bold text-white transition-all duration-250 hover:-translate-y-1 hover:bg-white/20"
              >
                <span className="text-2xl">{emoji}</span>
                {label}
              </a>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
