"use client";

import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { getLocaleFromSearchParams, translations } from "@/lib/i18n";
import { SocialLinksRow } from "@/components/social-icons";

export function SiteFooter() {
  const searchParams = useSearchParams();
  const locale = getLocaleFromSearchParams(searchParams);
  const t = translations[locale].footer;
  const contactT = translations[locale].contact;
  const currentYear = new Date().getFullYear();
  const socialLabels = {
    instagram: contactT.instagramAria,
    twitter: contactT.twitterAria,
    facebook: contactT.facebookAria,
    aparat: contactT.aparatAria,
  };

  const brandName = locale === "fa" ? "ترددیلا" : "Tordilla";

  return (
    <footer className="grain relative mt-auto overflow-hidden bg-leaf-900 text-leaf-100">
      <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-leaf-600/25 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-16 h-96 w-96 rounded-full bg-corn-600/12 blur-3xl" />

      <div className="container relative mx-auto px-4 py-14 md:px-6 md:py-16">
        <div className="grid gap-10 md:grid-cols-[1.3fr_1fr_auto]">
          {/* Brand + about */}
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10 ring-1 ring-white/15">
                <Image
                  src="/home/logo.png"
                  alt=""
                  width={40}
                  height={40}
                  className="h-9 w-9 object-contain"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="text-lg font-black text-white">{brandName}</span>
                <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.28em] text-corn-300">
                  corn chips
                </span>
              </span>
            </div>
            <h5 className="mb-2 text-sm font-black text-white">{t.aboutTitle}</h5>
            <p className="max-w-md text-[13.5px] leading-[2] text-leaf-100/70">{t.aboutText}</p>
          </div>

          {/* Contact */}
          <div>
            <h5 className="mb-5 text-sm font-black text-white">{t.contactTitle}</h5>
            <ul className="space-y-4 text-[13.5px] text-leaf-100/75">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-corn-300" />
                <span className="leading-[1.9]">{t.address}</span>
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 flex-shrink-0 text-corn-300" />
                <a href="tel:09426002408" className="transition hover:text-white">
                  {t.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 flex-shrink-0 text-corn-300" />
                <a href="mailto:it@tordilla.ir" className="transition hover:text-white">
                  {t.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Quick links */}
          <div>
            <h5 className="mb-5 text-sm font-black text-white">{t.links.about}</h5>
            <ul className="space-y-3 text-[13.5px]">
              {[
                { label: t.links.blog, href: `/blog?lang=${locale}` },
                { label: t.links.contact, href: `/contact?lang=${locale}` },
                { label: t.links.about, href: `/about?lang=${locale}` },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="inline-flex items-center gap-2 text-leaf-100/75 transition hover:text-corn-300"
                  >
                    <span className="h-1 w-1 rounded-full bg-corn-400" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social */}
        <div className="mt-12 rounded-card-lg border border-white/10 bg-white/[0.04] px-6 py-8 text-center backdrop-blur-sm">
          <h4 className="mb-6 text-lg font-black text-white md:text-xl">{t.socialTitle}</h4>
          <SocialLinksRow labels={socialLabels} size="md" />
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-[12.5px] text-leaf-100/55 md:flex-row">
          <span>
            {t.copyright} {currentYear}
          </span>
          <a
            href="https://www.tordilla.ir/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition hover:text-corn-300"
          >
            {t.designBy}
          </a>
        </div>
      </div>
    </footer>
  );
}
