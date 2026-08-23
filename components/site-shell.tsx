"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getLocaleFromSearchParams } from "@/lib/i18n";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const locale = getLocaleFromSearchParams(searchParams);
  const dir = locale === "fa" ? "rtl" : "ltr";

  // The root <html> gets its dir/lang on the server, but it is not re-rendered
  // during client-side navigation, so keep it in sync when the locale changes.
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = locale;
  }, [dir, locale]);

  return (
    <div className="site-shell min-h-screen flex flex-col" dir={dir} lang={locale}>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
