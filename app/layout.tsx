// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
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
  title: siteMeta.title,
  description: siteMeta.description,
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      data-scroll-behavior="smooth" 
      dir="rtl" 
      lang="fa"
      suppressHydrationWarning  // ← Add this line
    >
      <body className={yekan.className} suppressHydrationWarning>
        <div className="site-shell min-h-screen flex flex-col">
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}