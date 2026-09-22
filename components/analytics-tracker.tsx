"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const SESSION_KEY = "tordilla_session_id";

/**
 * A "session" is one browsing sitting: it lives in sessionStorage, so it ends
 * when the tab is closed and lets the panel separate visits from page views.
 */
function getSessionId(): string | null {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const created =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2) + Date.now().toString(36);

    window.sessionStorage.setItem(SESSION_KEY, created);
    return created;
  } catch {
    // Private mode or storage disabled — views still count, sessions do not.
    return null;
  }
}

/**
 * Reports one page view per client-side navigation. Kept deliberately silent:
 * any failure here must never surface to the visitor.
 */
export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastReported = useRef<string | null>(null);

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin")) return;

    const query = searchParams.toString();
    const key = query ? `${pathname}?${query}` : pathname;

    // React re-runs effects on remount; only a real navigation is a new view.
    if (lastReported.current === key) return;
    lastReported.current = key;

    const payload = JSON.stringify({
      path: pathname,
      query: query || null,
      title: typeof document !== "undefined" ? document.title : null,
      locale: searchParams.get("lang") === "en" ? "en" : "fa",
      referrer: typeof document !== "undefined" && document.referrer ? document.referrer : null,
      sessionId: getSessionId(),
    });

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }, [pathname, searchParams]);

  return null;
}
