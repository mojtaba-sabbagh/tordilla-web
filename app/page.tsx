"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";

// Type definitions
interface Flavor {
  titleFa: string;
  titleEn: string;
  title?: string;
  image: string;
  href: string;
  color: string;
  accent: string;
}

interface Retailer {
  name: string;
  image: string;
}

interface BlogPost {
  titleFa: string;
  titleEn: string;
  categoryFa: string;
  categoryEn: string;
  dateFa: string;
  dateEn: string;
  image: string;
  href: string;
  featured?: boolean;
}

interface AnimatedSectionProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  style?: React.CSSProperties;
}

interface SliderProps {
  images: string[];
}

interface FlavorCardProps {
  flavor: Flavor;
  index: number;
  localeQuery: string;
  titlePrefix: string;
  flavorCta: string;
}

const flavors: Flavor[] = [
  { titleFa: "ماست موسیر", titleEn: "Yogurt & Shallot", image: "/home/flavors/mast1.jpg", href: "/products/mast-o-musir", color: "#e8f5e9", accent: "#2e7d32" },
  { titleFa: "پنیری", titleEn: "Cheese", image: "/home/flavors/chees1.jpg", href: "/products/paniri", color: "#fff8e1", accent: "#f9a825" },
  { titleFa: "تنوری", titleEn: "Oven-Baked", image: "/home/flavors/barbiq1.jpg", href: "/products/tanouri", color: "#fbe9e7", accent: "#bf360c" },
  { titleFa: "سالسا", titleEn: "Salsa", image: "/home/flavors/salsa1.jpg", href: "/products/salsa", color: "#fce4ec", accent: "#c62828" },
  { titleFa: "مکزیکی", titleEn: "Mexican", image: "/home/flavors/mexican1.jpg", href: "/products/mexican", color: "#e8eaf6", accent: "#283593" },
  { titleFa: "پیاز جعفری", titleEn: "Onion & Parsley", image: "/home/flavors/piaz1.jpg", href: "/products/piaz-jafari", color: "#e0f2f1", accent: "#00695c" },
  { titleFa: "کنجدی", titleEn: "Sesame", image: "/home/flavors/seseami.jpg", href: "/products/sesame", color: "#efebe9", accent: "#4e342e" },
];

const retailers: Retailer[] = [
  { name: "دیجی‌کالا", image: "/home/brands/digikala.png" },
  { name: "مزبار", image: "/home/brands/mazbar.png" },
  { name: "شهروند", image: "/home/brands/shahrvand.png" },
  { name: "کنبو", image: "/home/brands/canbo.png" },
  { name: "پالادیوم", image: "/home/brands/paladium.png" },
  { name: "روکو", image: "/home/brands/roco.png" },
];

const blogPosts: BlogPost[] = [
  {
    titleFa: "ترددیلا در دیجیکالا",
    titleEn: "Tordilla on Digikala",
    categoryFa: "بدانیم",
    categoryEn: "Know",
    dateFa: "۱۱ اکتبر ۲۰۱۸",
    dateEn: "October 11, 2018",
    image: "/home/blog/digikala-logo-1200x480-760x180.jpg",
    href: "/blog/tordilla-in-digikala",
    featured: true,
  },
  {
    titleFa: "ناچو ترددیلا در سینماهای سراسر کشور عرضه خواهد شد",
    titleEn: "Tordilla Nachos Coming to Cinemas Nationwide",
    categoryFa: "بدانیم",
    categoryEn: "Know",
    dateFa: "۲۶ آگوست ۲۰۱۸",
    dateEn: "August 26, 2018",
    image: "/home/blog/b4fd571f4b9de34a1599ffdd904f3295-380x180.jpg",
    href: "/blog/nacho-at-cinemas",
  },
  {
    titleFa: "طرز تهیه تاکو مکزیکی (مرحله به مرحله با عکس)",
    titleEn: "How to Make Mexican Tacos (Step by Step)",
    categoryFa: "طرز تهیه غذا",
    categoryEn: "Recipe",
    dateFa: "۱۳ آگوست ۲۰۱۸",
    dateEn: "August 13, 2018",
    image: "/home/blog/1520956952-chicken-tacos-horizontal-380x180.jpg",
    href: "/blog/mexican-taco-recipe",
  },
  {
    titleFa: "بهترین دستور تهیه نان ترتیلا مرحله به مرحله",
    titleEn: "The Best Step-by-Step Tortilla Bread Recipe",
    categoryFa: "طرز تهیه غذا",
    categoryEn: "Recipe",
    dateFa: "۱۳ آگوست ۲۰۱۸",
    dateEn: "August 13, 2018",
    image: "/home/blog/lionel-gustave-171881-unsplash-380x180.jpg",
    href: "/blog/tortilla-bread-recipe",
  },
  {
    titleFa: "طرز تهیه سالسا با طعم‌های متفاوت",
    titleEn: "Salsa Recipes with Different Flavors",
    categoryFa: "طرز تهیه دیپ",
    categoryEn: "Dip Recipe",
    dateFa: "۱۳ آگوست ۲۰۱۸",
    dateEn: "August 13, 2018",
    image: "/home/blog/OG0A1062-380x180.jpg",
    href: "/blog/salsa-recipe",
  },
];

const sliderImages: string[] = [
  "/home/slider/where-1024x447.jpg",
  "/home/slider/tamas-ba-ma-small-size-min-1024x447.jpg",
];

// Custom hook with proper return type
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

// Fixed AnimatedSection with proper typing
function AnimatedSection({ children, delay = 0, className = "", style }: AnimatedSectionProps) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(36px)",
        transition: `opacity 0.75s ease ${delay}ms, transform 0.75s ease ${delay}ms`,
        ...style,   // now `style` is defined
      }}
    >
      {children}
    </div>
  );
}

function Slider({ images }: SliderProps) {
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % images.length), 4500);
    return () => clearInterval(t);
  }, [images.length]);

  return (
    <div style={{ position: "relative", width: "100%", overflow: "hidden" }}>
      <div style={{ position: "relative", width: "100%", height: "clamp(260px, 52vw, 560px)", background: "#1a0a04" }}>
        {images.map((src, i) => (
          <img
            key={src}
            src={src}
            alt={`اسلاید ${i + 1}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: active === i ? 1 : 0,
              transition: "opacity 1.1s ease",
            }}
          />
        ))}
        {/* gradient overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(15,4,0,0.55) 0%, transparent 60%)" }} />

        {/* arrows */}
        {[
          { dir: "right", label: "قبلی", delta: -1 },
          { dir: "left", label: "بعدی", delta: 1 },
        ].map(({ dir, label, delta }) => (
          <button
            key={dir}
            aria-label={`اسلاید ${label}`}
            onClick={() => setActive(i => (i + delta + images.length) % images.length)}
            style={{
              position: "absolute",
              top: "50%",
              [dir]: "16px",
              transform: "translateY(-50%)",
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.18)",
              backdropFilter: "blur(8px)",
              border: "1.5px solid rgba(255,255,255,0.35)",
              color: "#fff",
              fontSize: 22,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.2s",
            }}
          >
            {delta === -1 ? "›" : "‹"}
          </button>
        ))}

        {/* dots */}
        <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 8 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                height: 8,
                width: active === i ? 28 : 8,
                borderRadius: 9999,
                background: active === i ? "#fff" : "rgba(255,255,255,0.45)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.35s ease",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FlavorCard({ flavor, index, localeQuery, titlePrefix, flavorCta }: FlavorCardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        borderRadius: 24,
        overflow: "hidden",
        cursor: "pointer",
        background: "#1a0a04",
        opacity: 0,
        animation: `fadeSlideUp 0.6s ease ${120 + index * 70}ms forwards`,
        boxShadow: hovered ? "0 24px 52px rgba(0,0,0,0.28)" : "0 6px 20px rgba(0,0,0,0.12)",
        transform: hovered ? "translateY(-6px)" : "translateY(0)",
        transition: "box-shadow 0.35s, transform 0.35s",
      }}
    >
      <img
        src={flavor.image}
        alt={flavor.title}
        style={{
          display: "block",
          width: "100%",
          height: 240,
          objectFit: "cover",
          transition: "transform 0.6s ease",
          transform: hovered ? "scale(1.07)" : "scale(1)",
        }}
      />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 55%, transparent 100%)" }} />
      <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "20px 18px" }}>
        <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, margin: 0, letterSpacing: "0.01em" }}>{titlePrefix} {flavor.title}</p>
        <a
          href={`${flavor.href}${localeQuery}`}
          style={{
            display: "inline-flex",
            alignItems: "center",
            marginTop: 10,
            padding: "7px 18px",
            borderRadius: 9999,
            background: "#39a845",
            color: "#fff",
            fontWeight: 700,
            fontSize: 13,
            textDecoration: "none",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.3s, transform 0.3s",
          }}
        >
          {flavorCta}
        </a>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [flavorHintVisible, setFlavorHintVisible] = useState(true); // kept for potential future use
  const searchParams = useSearchParams();
  const locale = getLocaleFromSearchParams(searchParams);
  const t = translations[locale].home;
  const localeQuery = `?lang=${locale}`;

  const localizedFlavors = flavors.map((flavor) => ({
    ...flavor,
    title: locale === "fa" ? flavor.titleFa : flavor.titleEn,
  }));

  const localizedBlogPosts = blogPosts.map((post) => ({
    ...post,
    title: locale === "fa" ? post.titleFa : post.titleEn,
    category: locale === "fa" ? post.categoryFa : post.categoryEn,
    date: locale === "fa" ? post.dateFa : post.dateEn,
  }));

  const socialNetworks = translations[locale].home.socialNetworks;

  return (
    <div dir={locale === "fa" ? "rtl" : "ltr"} lang={locale} style={{ background: "#fdf8f3", color: "#2c1810", minHeight: "100vh" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; } to { opacity: 1; }
        }
        @keyframes chip-float {
          0%, 100% { transform: translateY(0) rotate(-5deg); }
          50% { transform: translateY(-12px) rotate(-5deg); }
        }
        .flavor-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 18px; }
        .retailer-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 16px; }
        .blog-grid { display: grid; gap: 20px; }
        @media(min-width: 760px) { .blog-grid { grid-template-columns: 1.6fr 1fr 1fr; } }
        .tag { display: inline-block; padding: 3px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; background: rgba(143,29,29,0.1); color: #8f1d1d; }
        .btn-primary { display: inline-flex; align-items: center; padding: 12px 28px; border-radius: 9999px; background: #8f1d1d; color: #fff; font-weight: 800; font-size: 15px; text-decoration: none; border: none; cursor: pointer; transition: background 0.2s, transform 0.2s; }
        .btn-primary:hover { background: #6e1515; transform: translateY(-2px); }
        .btn-green { background: #39a845; }
        .btn-green:hover { background: #2f8d39; }
        .btn-blue { background: #1a6fa8; }
        .btn-blue:hover { background: #145480; }
        .section-tag { display: inline-flex; align-items: center; gap: 6px; padding: 5px 16px; border-radius: 9999px; border: 1.5px solid rgba(143,29,29,0.2); background: rgba(143,29,29,0.06); color: #8f1d1d; font-size: 13px; font-weight: 700; margin-bottom: 14px; }
        hr.divider { border: none; border-top: 1.5px solid rgba(143,29,29,0.1); margin: 0; }
      `}</style>

      {/* ── SLIDER ── */}
      <Slider images={sliderImages} />

      {/* ── HERO TEXT ── */}
      <section style={{ textAlign: locale === "fa" ? "center" : "left", padding: "72px 24px 60px" }}>
        <AnimatedSection>
          <div className="section-tag">{t.heroTag}</div>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 58px)", fontWeight: 900, color: "#8f1d1d", lineHeight: 1.25, marginBottom: 20 }}>
            {t.heroTitle}
          </h1>
          <img src="/home/logo.png" alt={locale === "fa" ? "لوگوی ترددیلا" : "Tordilla logo"} style={{ width: "clamp(120px, 12vw, 170px)", height: "auto", margin: "0 auto 24px", display: "block" }} />
          <p style={{ maxWidth: 600, margin: "0 auto 32px", fontSize: 18, lineHeight: 1.9, color: "#5a3728" }}>
            {t.heroText}
          </p>
          <a href={`/products${localeQuery}`} className="btn-primary">{t.heroButton}</a>
        </AnimatedSection>
      </section>

      <hr className="divider" />

      {/* ── FLAVORS ── */}
      <section style={{ padding: "72px 24px", maxWidth: 1240, margin: "0 auto" }}>
        <AnimatedSection style={{ textAlign: "center", marginBottom: 48 }}>
          <div style={{ textAlign: locale === "fa" ? "center" : "left", marginBottom: 48 }}>
            <div className="section-tag">{t.flavorsTag}</div>
            <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, color: "#8f1d1d" }}>{t.flavorsHeading}</h2>
            <p style={{ marginTop: 10, color: "#7a5040", fontSize: 15 }}>{t.flavorsSubheading}</p>
          </div>
        </AnimatedSection>

        <div className="flavor-grid">
          {localizedFlavors.map((flavor, i) => (
            <FlavorCard key={flavor.title} flavor={flavor} index={i} localeQuery={localeQuery} titlePrefix={locale === "fa" ? "ترددیلا" : "Tordilla"} flavorCta={t.flavorCta} />
          ))}
          {/* decorative 8th card */}
          <div style={{ position: "relative", borderRadius: 24, overflow: "hidden", background: "#8f1d1d", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 240, padding: 24, textAlign: "center", opacity: 0, animation: "fadeSlideUp 0.6s ease 640ms forwards" }}>
            <div style={{ fontSize: 48, animation: "chip-float 3s ease-in-out infinite" }}>🌽</div>
            <p style={{ color: "#fff", fontWeight: 800, fontSize: 18, marginTop: 16 }}>{t.allFlavorsTitle}</p>
            <a href={`/products${localeQuery}`} style={{ marginTop: 14, padding: "8px 20px", borderRadius: 9999, background: "rgba(255,255,255,0.18)", color: "#fff", fontWeight: 700, fontSize: 13, textDecoration: "none", border: "1.5px solid rgba(255,255,255,0.35)" }}>{t.allFlavorsButton}</a>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── CINEMA ── */}
      <section style={{ background: "linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%)", padding: "72px 24px", position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: -60, left: -60, width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -80, right: -40, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

        <AnimatedSection className="" style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 36 }}>
              <div className="section-tag" style={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.1)", color: "#fff" }}>{t.cinemaTag}</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: "#fff" }}>{t.cinemaHeading}</h2>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {["/home/cinema/cinema-01.png", "/home/cinema/cinema-02.png"].map((src, i) => (
                <div key={i} style={{ borderRadius: 18, overflow: "hidden", background: "rgba(255,255,255,0.08)", padding: 6 }}>
                  <img src={src} alt="سینما" style={{ width: "100%", borderRadius: 13, display: "block", objectFit: "cover" }} />
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: 28 }}>
              <a href={`/cinema${localeQuery}`} className="btn-primary" style={{ background: "#39a845" }}>{t.cinemaButton}</a>
            </div>
          </div>
        </AnimatedSection>
      </section>

      {/* ── WHERE TO BUY ── */}
      <section style={{ background: "#fef4ec", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <AnimatedSection>
            <div style={{ textAlign: "center", marginBottom: 52 }}>
              <div className="section-tag">{t.whereBuyTag}</div>
              <h2 style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 900, color: "#8f1d1d" }}>{t.whereBuyHeading}</h2>
              <p style={{ marginTop: 10, color: "#7a5040", fontSize: 15 }}>{t.whereBuyText}</p>
            </div>
          </AnimatedSection>

          <div className="retailer-grid">
            {retailers.map((r, i) => (
              <AnimatedSection key={r.name} delay={i * 60}>
                <a
                  href="#"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 140,
                    borderRadius: 22,
                    background: "#fff",
                    padding: 24,
                    boxShadow: "0 8px 32px rgba(143,29,29,0.08)",
                    textDecoration: "none",
                    transition: "transform 0.25s, box-shadow 0.25s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = "translateY(-5px)";
                    e.currentTarget.style.boxShadow = "0 18px 48px rgba(143,29,29,0.16)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = "";
                    e.currentTarget.style.boxShadow = "0 8px 32px rgba(143,29,29,0.08)";
                  }}
                >
                  <img src={r.image} alt={r.name} style={{ maxHeight: 72, maxWidth: "100%", objectFit: "contain" }} />
                </a>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={400}>
            <div style={{ textAlign: "center", marginTop: 44 }}>
              <a href={`/tordilla-finder${localeQuery}`} className="btn-primary btn-blue">{t.finderButton}</a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <hr className="divider" />

      {/* ── BLOG ── */}
      <section style={{ padding: "80px 24px", maxWidth: 1240, margin: "0 auto" }}>
        <AnimatedSection>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 44 }}>
            <div>
              <div className="section-tag">{t.blogTag}</div>
              <h2 style={{ fontSize: "clamp(24px, 3vw, 38px)", fontWeight: 900, color: "#8f1d1d", marginTop: 6 }}>{t.blogHeading}</h2>
            </div>
            <a href={`/blog${localeQuery}`} style={{ color: "#8f1d1d", fontWeight: 700, fontSize: 14, textDecoration: "none", borderBottom: "2px solid #8f1d1d", paddingBottom: 2 }}>{t.blogAllPosts}</a>
          </div>
        </AnimatedSection>

        <div className="blog-grid">
          {/* featured */}
          <AnimatedSection delay={60}>
            <a
              href={`${localizedBlogPosts[0].href}${localeQuery}`}
              style={{
                display: "block",
                borderRadius: 22,
                overflow: "hidden",
                background: "#fff",
                boxShadow: "0 8px 32px rgba(0,0,0,0.09)",
                textDecoration: "none",
                color: "inherit",
                gridRow: "span 2",
                transition: "box-shadow 0.3s, transform 0.3s",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.boxShadow = "0 22px 52px rgba(0,0,0,0.16)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.09)";
                e.currentTarget.style.transform = "";
              }}
            >
              <img src={localizedBlogPosts[0].image} alt={localizedBlogPosts[0].title} style={{ width: "100%", height: 240, objectFit: "cover", display: "block" }} />
              <div style={{ padding: "22px 22px 26px" }}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <span className="tag">{localizedBlogPosts[0].category}</span>
                  <span style={{ fontSize: 12, color: "#999", lineHeight: "26px" }}>{localizedBlogPosts[0].date}</span>
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.6, color: "#2c1810" }}>{localizedBlogPosts[0].title}</h3>
              </div>
            </a>
          </AnimatedSection>

          {/* secondary posts */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {localizedBlogPosts.slice(1, 3).map((post, i) => (
              <AnimatedSection key={post.title} delay={120 + i * 80}>
                <a
                  href={`${post.href}${localeQuery}`}
                  style={{
                    display: "flex",
                    gap: 14,
                    borderRadius: 18,
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "box-shadow 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.13)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <img src={post.image} alt={post.title} style={{ width: 110, minHeight: "100%", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ padding: "14px 14px 14px 0" }}>
                    <span className="tag">{post.category}</span>
                    <h3 style={{ marginTop: 8, fontSize: 14, fontWeight: 700, lineHeight: 1.7, color: "#2c1810" }}>{post.title}</h3>
                    <p style={{ marginTop: 6, fontSize: 12, color: "#999" }}>{post.date}</p>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {localizedBlogPosts.slice(3).map((post, i) => (
              <AnimatedSection key={post.title} delay={200 + i * 80}>
                <a
                  href={`${post.href}${localeQuery}`}
                  style={{
                    display: "flex",
                    gap: 14,
                    borderRadius: 18,
                    overflow: "hidden",
                    background: "#fff",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.07)",
                    textDecoration: "none",
                    color: "inherit",
                    transition: "box-shadow 0.3s, transform 0.3s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.13)";
                    e.currentTarget.style.transform = "translateY(-3px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.07)";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <img src={post.image} alt={post.title} style={{ width: 110, minHeight: "100%", objectFit: "cover", flexShrink: 0 }} />
                  <div style={{ padding: "14px 14px 14px 0" }}>
                    <span className="tag">{post.category}</span>
                    <h3 style={{ marginTop: 8, fontSize: 14, fontWeight: 700, lineHeight: 1.7, color: "#2c1810" }}>{post.title}</h3>
                    <p style={{ marginTop: 6, fontSize: 12, color: "#999" }}>{post.date}</p>
                  </div>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOCIAL ── */}
      <section style={{ background: "linear-gradient(135deg, #8f1d1d 0%, #5c1111 100%)", padding: "72px 24px" }}>
        <AnimatedSection>
          <div style={{ maxWidth: 760, margin: "0 auto", textAlign: "center" }}>
            <div className="section-tag" style={{ borderColor: "rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.1)", color: "#fff", marginBottom: 14 }}>{t.socialTag}</div>
            <h2 style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 900, color: "#fff", marginBottom: 12 }}>{t.socialHeading}</h2>
            <p style={{ color: "rgba(255,255,255,0.72)", fontSize: 15, marginBottom: 40 }}>{t.socialText}</p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 20 }}>
              {socialNetworks.map(({ label, href, emoji }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 8,
                    padding: "18px 24px",
                    borderRadius: 20,
                    background: "rgba(255,255,255,0.12)",
                    border: "1.5px solid rgba(255,255,255,0.2)",
                    color: "#fff",
                    textDecoration: "none",
                    fontWeight: 700,
                    fontSize: 13,
                    minWidth: 100,
                    transition: "background 0.25s, transform 0.25s",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.22)";
                    e.currentTarget.style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.12)";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <span style={{ fontSize: 28 }}>{emoji}</span>
                  {label}
                </a>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </section>
    </div>
  );
}