"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";

const navigationItems = [
  { key: "home", href: "/" },
  { key: "products", href: "/products" },
  { key: "about", href: "/about" },
  { key: "blog", href: "/blog" },
  { key: "shop", href: "/shop" },
  { key: "agency", href: "/agency" },
  { key: "contact", href: "/contact" },
] as const;

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const locale = getLocaleFromSearchParams(searchParams);
  const t = translations[locale];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname, searchParams]);

  const normalizedPath = pathname.replace(/^\/(fa|en)(?=\/|$)/, "") || "/";

  const isActive = (href: string) => {
    if (href === "/") {
      return normalizedPath === "/";
    }
    return normalizedPath.startsWith(href);
  };

  const currentSearch = new URLSearchParams(searchParams.toString());
  const otherLocale = locale === "fa" ? "en" : "fa";
  currentSearch.set("lang", otherLocale);
  const langSwitchHref = `${pathname}?${currentSearch.toString()}`;

  const brandName = locale === "fa" ? "ترددیلا" : "Tordilla";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-cream/85 shadow-soft backdrop-blur-xl"
          : "border-b border-transparent bg-cream/55 backdrop-blur-md"
      }`}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex min-h-[74px] items-center justify-between gap-4">
          {/* Brand */}
          <Link
            href={`/?lang=${locale}`}
            className="group flex items-center gap-2.5"
            aria-label={brandName}
          >
            <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-white ring-1 ring-leaf-100 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/home/logo.png"
                alt=""
                width={38}
                height={38}
                className="h-8 w-8 object-contain"
                priority
              />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-[16px] font-black tracking-tight text-ink">{brandName}</span>
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-leaf-500">
                corn chips
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={`${item.href}?lang=${locale}`}
                className={`relative rounded-full px-3.5 py-2 text-[13.5px] font-bold transition-all duration-200 ${
                  isActive(item.href)
                    ? "bg-leaf-50 text-leaf-700"
                    : "text-ink-soft hover:bg-white/70 hover:text-leaf-600"
                }`}
              >
                {t.nav[item.key]}
                {isActive(item.href) && (
                  <span className="absolute inset-x-3.5 -bottom-0.5 h-[3px] rounded-full bg-corn-400" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href={langSwitchHref}
              className="hidden items-center gap-1.5 rounded-full border border-leaf-200 bg-white/70 px-3.5 py-2 text-[13px] font-bold text-leaf-700 transition-all hover:border-leaf-400 hover:bg-leaf-600 hover:text-white sm:inline-flex"
            >
              <Globe className="h-3.5 w-3.5" />
              {t.languageToggle}
            </Link>

            <button
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white/70 text-leaf-700 transition hover:bg-white lg:hidden"
              aria-label={locale === "fa" ? "منو" : "Menu"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <div
          className={`grid overflow-hidden transition-all duration-300 lg:hidden ${
            mobileMenuOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="min-h-0">
            <nav className="mb-4 mt-1 grid gap-1.5 rounded-card border border-line bg-white/90 p-3 shadow-soft backdrop-blur">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={`${item.href}?lang=${locale}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`rounded-tile px-4 py-3 text-sm font-bold transition ${
                    isActive(item.href)
                      ? "bg-leaf-600 text-white"
                      : "text-ink-soft hover:bg-leaf-50 hover:text-leaf-700"
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              ))}
              <Link
                href={langSwitchHref}
                onClick={() => setMobileMenuOpen(false)}
                className="mt-1 inline-flex items-center justify-center gap-2 rounded-full border border-leaf-200 px-5 py-2.5 text-sm font-bold text-leaf-700"
              >
                <Globe className="h-4 w-4" />
                {t.languageToggle}
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
