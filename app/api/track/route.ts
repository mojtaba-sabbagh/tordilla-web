// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  getClientIp,
  hostFromUrl,
  parseUserAgent,
  resolveIpLocation,
  visitorIdFor,
} from '@/lib/analytics';

export const dynamic = 'force-dynamic';

const MAX_PATH = 512;
const MAX_TEXT = 255;
const MAX_UA = 512;

/**
 * React re-mounts and back/forward navigation can fire the beacon twice for the
 * same screen. Anything identical arriving within this window from the same
 * visitor is treated as one view.
 */
const DEDUPE_WINDOW_MS = 3000;
const recentViews = new Map<string, number>();

function isDuplicate(key: string): boolean {
  const now = Date.now();

  // Opportunistic sweep so the map cannot grow without bound.
  if (recentViews.size > 500) {
    for (const [existing, seenAt] of recentViews) {
      if (now - seenAt > DEDUPE_WINDOW_MS) recentViews.delete(existing);
    }
  }

  const seenAt = recentViews.get(key);
  recentViews.set(key, now);
  return seenAt !== undefined && now - seenAt < DEDUPE_WINDOW_MS;
}

function clamp(value: unknown, max: number): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return new NextResponse(null, { status: 204 });

    const path = clamp(body.path, MAX_PATH);
    if (!path || !path.startsWith('/')) return new NextResponse(null, { status: 204 });

    // The panel itself and internal endpoints are not "site traffic".
    if (path.startsWith('/admin') || path.startsWith('/api')) {
      return new NextResponse(null, { status: 204 });
    }

    const userAgent = clamp(request.headers.get('user-agent'), MAX_UA) ?? '';
    const ip = getClientIp(request.headers);
    const visitorId = visitorIdFor(ip, userAgent);

    if (isDuplicate(`${visitorId}|${path}`)) {
      return new NextResponse(null, { status: 204 });
    }

    const { isBot, deviceType, browser, os } = parseUserAgent(userAgent);

    const referrer = clamp(body.referrer, MAX_PATH);
    const referrerHost = hostFromUrl(referrer);
    const selfHost = request.headers.get('host')?.replace(/^www\./, '').split(':')[0] ?? null;

    const location = await resolveIpLocation(ip);

    await prisma.pageView.create({
      data: {
        path,
        query: clamp(body.query, MAX_TEXT),
        title: clamp(body.title, MAX_TEXT),
        locale: clamp(body.locale, 8),
        referrer,
        // Internal navigation is not a referral source worth reporting.
        referrerHost: referrerHost && referrerHost !== selfHost ? referrerHost : null,
        userAgent: userAgent || null,
        ip,
        visitorId,
        sessionId: clamp(body.sessionId, 64),
        deviceType,
        browser,
        os,
        isBot,
        ...location,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    // Never let analytics break a page load.
    console.error('Error recording page view:', error);
    return new NextResponse(null, { status: 204 });
  }
}
