"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Menu, X, Globe } from "lucide-react";
import { getLocaleFromSearchParams, translations, Locale } from "@/lib/i18n";

const navigationItems = [
  { key: "home", href: "/" },
  { key: "blog", href: "/blog" },
  { key: "products", href: "/products" },
  { key: "shop", href: "/shop" },
  { key: "about", href: "/about" },
  { key: "contact", href: "/contact" },
  { key: "agency", href: "/agency" },
] as const;

export function SiteHeader() {
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const locale = getLocaleFromSearchParams(searchParams);
  const t = translations[locale];
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(247,239,228,0.72)] border-b border-[rgba(76,50,33,0.12)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between min-h-[78px] gap-5">
          <Link href={`/?lang=${locale}`} className="flex items-center gap-3 font-bold text-base">
            <div className="grid place-items-center w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#ce4a28] to-[#ef8a4b] text-white shadow-[0_24px_60px_rgba(54,29,12,0.12)]">
              <span className="text-sm">ت</span>
            </div>
            <span className="hidden sm:inline">ترددیلا</span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 flex-wrap">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={`${item.href}?lang=${locale}`}
                className={`transition-colors duration-180 ${
                  isActive(item.href)
                    ? "text-[#8f2e18] font-semibold"
                    : "text-[#675247] hover:text-[#8f2e18]"
                }`}
              >
                {t.nav[item.key]}
              </Link>
            ))}
            {/* Language Toggle with extra padding and min-width */}
            <Link
              href={langSwitchHref}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-[#8f2e18] bg-white/50 px-5 !py-1 min-w-[100px] text-sm font-semibold text-[#8f2e18] transition-all hover:bg-[#8f2e18] hover:!text-white hover:border-[#8f2e18]"
            >
              <Globe className="w-4 h-4" />
              {t.languageToggle}
            </Link>
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#675247] hover:bg-white/20 transition"
            aria-label="منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(76,50,33,0.12)]">
            <nav className="flex flex-col gap-3">
              {navigationItems.map((item) => (
                <Link
                  key={item.key}
                  href={`${item.href}?lang=${locale}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive(item.href)
                      ? "bg-[#ce4a28]/10 text-[#8f2e18] font-semibold"
                      : "text-[#675247] hover:bg-white/20"
                  }`}
                >
                  {t.nav[item.key]}
                </Link>
              ))}
              <Link
                href={langSwitchHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#8f2e18] px-5 py-2 text-sm font-semibold text-[#8f2e18] transition hover:bg-[#8f2e18] hover:text-white"
              >
                <Globe className="w-4 h-4" />
                {t.languageToggle}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}