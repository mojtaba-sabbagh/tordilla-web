"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
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

  return (
    <footer className="border-t border-[rgba(76,50,33,0.12)] text-[#675247]">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* About Section */}
          <div>
            <h5 className="text-lg font-bold text-[#1f140f] mb-4">{t.aboutTitle}</h5>
            <p className="text-sm leading-relaxed">{t.aboutText}</p>
          </div>

          {/* Instagram Section 
          <div>
            <h5 className="text-lg font-bold text-[#1f140f] mb-4">اینستاگرام</h5>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <a
                  key={i}
                  href="https://instagram.com/tordillachips/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square bg-neutral-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={`/home/blog/insta.jpg`}
                    alt="اینستاگرام ترددیلا"
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div> */}

          {/* Contact Section */}
          <div>
            <h5 className="text-lg font-bold text-[#1f140f] mb-4">{t.contactTitle}</h5>
            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span>📍</span>
                <span>{t.address}</span>
              </p>
              <p className="flex gap-2">
                <span>📞</span>
                <a href="tel:02191072667" className="hover:text-[#ce4a28] transition">
                  {t.phone}
                </a>
              </p>
              <p className="flex gap-2">
                <span>✉️</span>
                <a href="mailto:it@tordilla.ir" className="hover:text-[#ce4a28] transition">
                  {t.email}
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Networks Section */}
      <div className="bg-[#8f2e18] !py-8 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h4 className="text-xl font-black md:text-2xl mb-6">{t.socialTitle}</h4>
          <SocialLinksRow labels={socialLabels} />
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-4 md:!px-6 !py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex gap-6">
            <Link href={`/blog?lang=${locale}`} className="hover:text-[#ce4a28] transition">
              {t.links.blog}
            </Link>
            <Link href={`/contact?lang=${locale}`} className="hover:text-[#ce4a28] transition">
              {t.links.contact}
            </Link>
            <Link href={`/about?lang=${locale}`} className="hover:text-[#ce4a28] transition">
              {t.links.about}
            </Link>
          </div>
          <div className="text-center">
            <span>
              {t.copyright} {currentYear}{" "}
              <a
                href="https://www.joorchin.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ce4a28] transition"
              >
                {t.designBy}
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}