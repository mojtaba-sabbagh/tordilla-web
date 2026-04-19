// components/site-header.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const navigation = [
  { name: "خانه", href: "/" },
  { name: "وبلاگ", href: "/blog" },
  { name: "محصولات", href: "/products" },
  { name: "فروشگاه", href: "/shop" },
  { name: "درباره ترددیلا", href: "/about" },
  { name: "تماس با ما", href: "/contact" },
  { name: "اخذ نمایندگی", href: "/agency" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[rgba(247,239,228,0.72)] border-b border-[rgba(76,50,33,0.12)]">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between min-h-[78px] gap-5">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 font-bold text-base">
            <div className="grid place-items-center w-[42px] h-[42px] rounded-full bg-gradient-to-br from-[#ce4a28] to-[#ef8a4b] text-white shadow-[0_24px_60px_rgba(54,29,12,0.12)]">
              <span className="text-sm">ت</span>
            </div>
            <span className="hidden sm:inline">ترددیلا</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 flex-wrap">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`transition-colors duration-180 ${
                  isActive(item.href)
                    ? "text-[#8f2e18] font-semibold"
                    : "text-[#675247] hover:text-[#8f2e18]"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-[#675247] hover:bg-white/20 transition"
            aria-label="منو"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[rgba(76,50,33,0.12)]">
            <nav className="flex flex-col gap-3">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg transition ${
                    isActive(item.href)
                      ? "bg-[#ce4a28]/10 text-[#8f2e18] font-semibold"
                      : "text-[#675247] hover:bg-white/20"
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}