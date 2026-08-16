// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";
import { ProductCard } from "@/components/product-card";
import { SectionBadge } from "@/components/ui/section-badge";
import { CtaLink } from "@/components/ui/cta-link";
import { AnimatedSection } from "@/components/ui/animated-section";
import { HealthPillars } from "@/components/ui/health-pillars";
import { getHealthPillars } from "@/lib/health-pillars";
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
  const about = content.about as Record<string, any>;
  const nav = content.nav as Record<string, any>;
  const localeQuery = `?lang=${locale}`;
  const isFa = locale === "fa";

  let latestPosts: Awaited<ReturnType<typeof getPaginatedBlogPosts>>["posts"] = [];
  try {
    const result = await getPaginatedBlogPosts(1, 3);
    latestPosts = result.posts;
  } catch {
    latestPosts = [];
  }

  const stats = (about.stats ?? []) as Array<Record<string, string>>;
  const pillars = getHealthPillars(about.features);
  const story = (about.productSections ?? [])[0] as
    | { productsSubheading?: string; productParagraphs?: string[] }
    | undefined;

  return (
    <div dir={isFa ? "rtl" : "ltr"} lang={locale}>
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section className="grain relative overflow-hidden bg-leaf-900">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 start-1/4 h-[34rem] w-[34rem] rounded-full bg-leaf-600/45 blur-3xl" />
          <div className="absolute -bottom-40 end-0 h-[26rem] w-[26rem] rounded-full bg-corn-500/20 blur-3xl" />
          <div className="absolute top-1/3 -start-24 h-72 w-72 rounded-full bg-paprika-500/15 blur-3xl" />
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <span className="absolute left-[6%] top-[18%] text-5xl opacity-30 animate-float-a">🌽</span>
          <span className="absolute right-[4%] bottom-[16%] text-4xl opacity-25 animate-float-b">🌿</span>
        </div>

        <div className="container relative mx-auto grid items-center gap-12 px-4 pb-24 pt-16 md:px-6 md:pb-28 md:pt-20 lg:grid-cols-[1.05fr_1fr] lg:gap-14">
          <AnimatedSection className={isFa ? "text-center lg:text-right" : "text-center lg:text-left"}>
            <SectionBadge tone="invert" className="mb-6">
              {t.heroTag}
            </SectionBadge>

            <h1 className="display text-balance mb-5 text-[clamp(2.3rem,6vw,4.2rem)] text-white">
              {t.heroTitle}
            </h1>

            <p className="text-balance mx-auto mb-8 max-w-xl text-[15.5px] leading-[2.05] text-leaf-100/80 lg:mx-0">
              {t.heroText}
            </p>

            {stats.length > 0 && (
              <div
                className={`mb-9 flex flex-wrap justify-center gap-2.5 ${
                  isFa ? "lg:justify-start" : "lg:justify-start"
                }`}
              >
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 backdrop-blur-sm"
                  >
                    <span dir="ltr" className="text-[15px] font-black text-corn-300">
                      {s.value}
                    </span>
                    <span className="text-[12px] font-bold text-leaf-100/80">{s.label}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-wrap justify-center gap-3 lg:justify-start">
              <CtaLink href={`/products${localeQuery}`} variant="accent">
                {t.heroButton}
              </CtaLink>
              <CtaLink href={`/tordilla-finder${localeQuery}`} variant="invert">
                {t.finderButton}
              </CtaLink>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={120} className="relative">
            <div className="absolute -inset-3 rounded-blob bg-gradient-to-tr from-corn-400/20 via-transparent to-leaf-400/25 blur-2xl" />
            <HomeSlider
              images={sliderImages}
              alt={isFa ? "ترددیلا" : "Tordilla"}
              className="relative aspect-[16/10] w-full lg:aspect-[4/3]"
            />
            <div className="relative mx-auto -mt-8 w-fit rounded-full border border-white/15 bg-leaf-800/90 px-5 py-2.5 shadow-lift backdrop-blur">
              <Image
                src="/home/logo.png"
                alt={isFa ? "لوگوی ترددیلا" : "Tordilla logo"}
                width={96}
                height={40}
                className="h-9 w-auto object-contain"
              />
            </div>
          </AnimatedSection>
        </div>

        <div className="hill-divider">
          <svg viewBox="0 0 1200 70" preserveAspectRatio="none" className="block h-[46px] w-full md:h-[70px]">
            <path
              d="M0,26 C220,74 420,74 640,40 C850,8 1020,8 1200,46 L1200,70 L0,70 Z"
              fill="var(--color-cream)"
            />
          </svg>
        </div>
      </section>

      {/* ───────────────────── HEALTH PILLARS ───────────────────── */}
      <section className="relative z-10 px-4 md:px-6">
        <div className="container mx-auto -mt-10 md:-mt-16">
          <AnimatedSection>
            <HealthPillars items={pillars} />
          </AnimatedSection>
        </div>
      </section>

      {/* ─────────────────────────── FLAVORS ─────────────────────────── */}
      <section className="relative overflow-hidden px-4 py-20 md:px-6 md:py-24">
        <div className="pointer-events-none absolute -end-32 top-1/4 h-96 w-96 rounded-full bg-corn-300/25 blur-3xl" />
        <div className="pointer-events-none absolute -start-24 bottom-0 h-72 w-72 rounded-full bg-leaf-200/40 blur-3xl" />

        <div className="container relative mx-auto">
          <AnimatedSection className="mb-12 text-center">
            <SectionBadge className="mb-4">{t.flavorsTag}</SectionBadge>
            <h2 className="display text-balance text-[clamp(1.7rem,3.6vw,2.8rem)] text-ink">
              {t.flavorsHeading}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.95] text-ink-mute">
              {t.flavorsSubheading}
            </p>
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

          <div className="mt-12 text-center">
            <CtaLink href={`/products${localeQuery}`} variant="primary">
              {t.allFlavorsButton}
            </CtaLink>
          </div>
        </div>
      </section>

      {/* ─────────────────────────── CRAFT STORY ─────────────────────────── */}
      {story?.productsSubheading && (
        <section className="px-4 pb-20 md:px-6 md:pb-24">
          <div className="container mx-auto">
            <AnimatedSection className="grid items-center gap-8 overflow-hidden rounded-card-lg border border-line bg-surface p-5 shadow-soft md:p-6 lg:grid-cols-2 lg:gap-12 lg:p-8">
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-card">
                <Image
                  src="/home/slider/tortella-mexico-min-800x350.jpg"
                  alt={story.productsSubheading}
                  fill
                  sizes="(max-width: 1024px) 100vw, 540px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-leaf-900/45 to-transparent" />
                <span className="absolute bottom-4 end-4 rounded-full bg-white/90 px-4 py-1.5 text-[12px] font-black text-leaf-700 backdrop-blur">
                  {isFa ? "ترددیلا" : "Tordilla"}
                </span>
              </div>

              <div className={isFa ? "lg:pe-4" : "lg:ps-4"}>
                <SectionBadge className="mb-4">{about.productsHeading}</SectionBadge>
                <h2 className="display mb-4 text-[clamp(1.5rem,3vw,2.2rem)] text-ink">
                  {story.productsSubheading}
                </h2>
                <div className="mb-7 flex flex-col gap-3 text-[14.5px] leading-[2.05] text-ink-soft">
                  {(story.productParagraphs ?? []).slice(0, 2).map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
                <CtaLink href={`/about${localeQuery}`} variant="outline" size="md">
                  {nav.about}
                </CtaLink>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* ─────────────────────────── CINEMA ─────────────────────────── */}
      <section className="grain relative overflow-hidden bg-leaf-800 px-4 py-20 md:px-6 md:py-24">
        <div className="pointer-events-none absolute -start-16 -top-16 h-72 w-72 rounded-full bg-leaf-500/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -end-10 h-80 w-80 rounded-full bg-corn-500/15 blur-3xl" />

        <AnimatedSection className="container relative mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <SectionBadge tone="invert" className="mb-4">
              {t.cinemaTag}
            </SectionBadge>
            <h2 className="display text-balance text-[clamp(1.5rem,3vw,2.4rem)] text-white">
              {t.cinemaHeading}
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {["/home/cinema/cinema-01.png", "/home/cinema/cinema-02.png"].map((src) => (
              <div
                key={src}
                className="group relative aspect-[4/3] w-full overflow-hidden rounded-card ring-1 ring-white/12"
              >
                <Image
                  src={src}
                  alt={isFa ? "سینما" : "Cinema"}
                  fill
                  sizes="(max-width: 640px) 50vw, 320px"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <CtaLink href={`/cinema${localeQuery}`} variant="accent">
              {t.cinemaButton}
            </CtaLink>
          </div>
        </AnimatedSection>
      </section>

      {/* ─────────────────────────── WHERE TO BUY ─────────────────────────── */}
      <section className="overflow-hidden bg-cream-warm py-20 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <AnimatedSection className="mb-12 text-center">
            <SectionBadge tone="corn" className="mb-4">
              {t.whereBuyTag}
            </SectionBadge>
            <h2 className="display text-balance text-[clamp(1.7rem,3.6vw,2.8rem)] text-ink">
              {t.whereBuyHeading}
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-[15px] leading-[1.95] text-ink-mute">
              {t.whereBuyText}
            </p>
          </AnimatedSection>
        </div>

        <div className="marquee-mask group relative">
          <div
            dir="ltr"
            className="flex w-max gap-4 animate-marquee group-hover:[animation-play-state:paused]"
          >
            {[...retailers, ...retailers].map((r, i) => (
              <div
                key={`${r.name}-${i}`}
                className="flex h-28 w-44 flex-shrink-0 items-center justify-center rounded-card border border-line bg-surface p-6 shadow-soft transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lift"
              >
                <Image
                  src={r.image}
                  alt={r.name}
                  width={140}
                  height={72}
                  className="h-auto max-h-[62px] w-auto max-w-full object-contain opacity-80 transition-opacity duration-300 hover:opacity-100"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="container mx-auto mt-12 px-4 text-center md:px-6">
          <CtaLink href={`/tordilla-finder${localeQuery}`} variant="primary">
            {t.finderButton}
          </CtaLink>
        </div>
      </section>

      {/* ─────────────────────────── BLOG ─────────────────────────── */}
      <section className="container mx-auto px-4 py-20 md:px-6 md:py-24">
        <AnimatedSection className="mb-11 flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionBadge className="mb-3">{t.blogTag}</SectionBadge>
            <h2 className="display text-[clamp(1.5rem,3vw,2.4rem)] text-ink">{t.blogHeading}</h2>
          </div>
          <Link
            href={`/blog${localeQuery}`}
            className="inline-flex items-center gap-1.5 rounded-full border border-leaf-200 bg-white/70 px-5 py-2.5 text-[13px] font-bold text-leaf-700 transition-all hover:border-leaf-400 hover:bg-white"
          >
            {t.blogAllPosts}
          </Link>
        </AnimatedSection>

        {latestPosts.length === 0 ? (
          <p className="rounded-card-lg border border-line bg-surface p-12 text-center text-ink-mute shadow-soft">
            {isFa ? "به‌زودی مطالب تازه منتشر می‌شود." : "New posts are coming soon."}
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-3">
            {latestPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 80}>
                <Link
                  href={`/blog/${post.slug}${localeQuery}`}
                  className="surface surface-hover group flex h-full flex-col overflow-hidden p-2.5"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-tile bg-cream-warm">
                    <Image
                      src={post.image}
                      alt={post.title[locale]}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="inline-flex rounded-full bg-leaf-50 px-3 py-1 text-[11px] font-bold text-leaf-600">
                        {post.category[locale]}
                      </span>
                      <span className="text-[11.5px] text-ink-mute">
                        {formatPostDate(post.date, locale)}
                      </span>
                    </div>
                    <h3 className="text-[15px] font-black leading-[1.75] text-ink transition-colors group-hover:text-leaf-600">
                      {post.title[locale]}
                    </h3>
                  </div>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        )}
      </section>

      {/* ─────────────────────────── SOCIAL ─────────────────────────── */}
      <section className="px-4 pb-24 md:px-6">
        <AnimatedSection className="container mx-auto overflow-hidden rounded-card-lg border border-line bg-surface px-6 py-14 text-center shadow-soft">
          <SectionBadge tone="corn" className="mb-4">
            {t.socialTag}
          </SectionBadge>
          <h2 className="display mb-3 text-[clamp(1.4rem,3vw,2.2rem)] text-ink">
            {t.socialHeading}
          </h2>
          <p className="mx-auto mb-10 max-w-md text-[15px] leading-[1.95] text-ink-mute">
            {t.socialText}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            {(t.socialNetworks ?? []).map(({ label, href, emoji }: any) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group inline-flex min-w-[112px] flex-col items-center gap-2.5 rounded-card border border-line bg-cream px-6 py-5 text-[13px] font-bold text-ink-soft transition-all duration-300 hover:-translate-y-1.5 hover:border-leaf-300 hover:bg-leaf-50 hover:text-leaf-700"
              >
                <span className="text-2xl transition-transform duration-300 group-hover:scale-115">
                  {emoji}
                </span>
                {label}
              </a>
            ))}
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}
