// app/layout.tsx
import type { Metadata } from "next";
import { Suspense } from "react";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { SiteShell } from "@/components/site-shell";
import { siteMeta } from "@/lib/seed-content";
import "./globals.css";

const yekan = localFont({
  src: [
    {
      path: "../public/fonts/Yekan.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Yekan.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/Yekan.ttf",
      weight: "400",
      style: "normal",
    },
  ],
  display: "swap",
  variable: "--font-yekan",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s | ${siteMeta.name}`,
  },
  description: siteMeta.description,
  alternates: {
    canonical: "/",
    languages: {
      fa: "/",
      en: "/?lang=en",
    },
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteMeta.url,
    siteName: siteMeta.name,
    title: siteMeta.title,
    description: siteMeta.description,
    images: [{ url: "/home/logo.png" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    images: ["/home/logo.png"],
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: siteMeta.name,
  alternateName: "Tordilla",
  url: siteMeta.url,
  logo: `${siteMeta.url}/home/logo.png`,
  description: siteMeta.description,
  sameAs: [
    "https://instagram.com/tordillachips/",
    "https://twitter.com/tordillachips",
    "https://www.facebook.com/tordillachips",
    "https://www.aparat.com/tordilla.chips",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // `x-locale` is set by proxy.ts from the `?lang` query param.
  const locale = (await headers()).get("x-locale") === "en" ? "en" : "fa";

  return (
    <html
      data-scroll-behavior="smooth"
      dir={locale === "fa" ? "rtl" : "ltr"}
      lang={locale}
      suppressHydrationWarning
    >
      <body className={yekan.className} suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <Suspense fallback={null}>
          <SiteShell>{children}</SiteShell>
        </Suspense>
      </body>
    </html>
  );
}