// lib/analytics.ts
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

/**
 * Buckets are cut on Tehran wall-clock time, not UTC: a "day" in the panel has
 * to mean the day the visitor experienced, otherwise every visit between
 * midnight and 03:30 local would land on the previous chart column.
 */
export const ANALYTICS_TIMEZONE = process.env.ANALYTICS_TIMEZONE || 'Asia/Tehran';

const VISITOR_SALT =
  process.env.ANALYTICS_SALT || process.env.JWT_SECRET || 'tordilla-analytics-salt';

/**
 * `{ip}` is replaced with the address being looked up. The ip-api.com free tier
 * needs no key and answers in Persian; point this at a self-hosted database
 * instead, or set it empty to turn location lookups off entirely.
 */
const GEO_API_URL =
  process.env.GEOIP_API_URL ??
  'http://ip-api.com/json/{ip}?fields=status,message,country,countryCode,regionName,city,lat,lon,isp&lang=fa';

const GEO_TIMEOUT_MS = 2500;
const GEO_OK_TTL_MS = 90 * 24 * 60 * 60 * 1000; // re-check a known address quarterly
const GEO_FAIL_TTL_MS = 6 * 60 * 60 * 1000; // but retry a failed lookup the same day

export const LOCAL_NETWORK_LABEL = 'شبکه محلی';

/* -------------------------------------------------------------------------- */
/* IP handling                                                                */
/* -------------------------------------------------------------------------- */

function normalizeIp(raw: string): string {
  const ip = raw.trim();
  // Node reports IPv4 peers of a dual-stack socket as ::ffff:1.2.3.4
  if (ip.toLowerCase().startsWith('::ffff:')) return ip.slice(7);
  return ip;
}

/**
 * nginx in front of this app sets X-Forwarded-For, so the left-most entry is
 * the original client. Cloudflare / real-ip headers win when present because a
 * client cannot forge them past the proxy that sets them.
 */
export function getClientIp(headers: Headers): string {
  const direct = headers.get('cf-connecting-ip') || headers.get('x-real-ip');
  if (direct) return normalizeIp(direct);

  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    const first = forwarded.split(',')[0];
    if (first && first.trim()) return normalizeIp(first);
  }

  return 'unknown';
}

export function isPrivateIp(ip: string): boolean {
  if (!ip || ip === 'unknown') return true;
  if (ip === '::1' || ip.startsWith('127.')) return true;
  if (ip.startsWith('10.') || ip.startsWith('192.168.') || ip.startsWith('169.254.')) return true;

  const match = /^172\.(\d{1,3})\./.exec(ip);
  if (match) {
    const second = Number(match[1]);
    if (second >= 16 && second <= 31) return true;
  }

  const lower = ip.toLowerCase();
  // fc00::/7 (unique local) and fe80::/10 (link local)
  if (lower.startsWith('fc') || lower.startsWith('fd') || lower.startsWith('fe8')) return true;

  return false;
}

/**
 * A pseudonymous but stable id for "the same person". The raw IP is stored
 * separately for the admin log; this is what de-duplicated counts run on.
 */
export function visitorIdFor(ip: string, userAgent: string): string {
  return crypto
    .createHash('sha256')
    .update(ip + '|' + userAgent + '|' + VISITOR_SALT)
    .digest('hex')
    .slice(0, 32);
}

/* -------------------------------------------------------------------------- */
/* User agent parsing                                                         */
/* -------------------------------------------------------------------------- */

const BOT_PATTERN =
  /bot\b|bot\/|crawler|spider|crawling|slurp|mediapartners|facebookexternalhit|whatsapp|telegrambot|skypeuripreview|monitoring|curl\/|wget|python-requests|python-urllib|go-http-client|okhttp|axios\/|node-fetch|headless|lighthouse|pingdom|uptimerobot|semrush|ahrefs|mj12|dotbot|yandex|baiduspider|duckduckgo|applebot|petalbot|gptbot|claudebot|ccbot|perplexity|bytespider|archive\.org_bot/i;

export type UserAgentInfo = {
  isBot: boolean;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
  browser: string;
  os: string;
};

export function parseUserAgent(userAgent: string): UserAgentInfo {
  const ua = userAgent || '';

  if (!ua) {
    return { isBot: true, deviceType: 'unknown', browser: 'نامشخص', os: 'نامشخص' };
  }

  const isBot = BOT_PATTERN.test(ua);

  let deviceType: UserAgentInfo['deviceType'] = 'desktop';
  if (/ipad|tablet|playbook|silk/i.test(ua) || (/android/i.test(ua) && !/mobi/i.test(ua))) {
    deviceType = 'tablet';
  } else if (/mobi|iphone|ipod|android|windows phone|blackberry|opera mini/i.test(ua)) {
    deviceType = 'mobile';
  }

  let browser = 'سایر';
  if (/edga?|edgios|edg\//i.test(ua)) browser = 'Edge';
  else if (/opr\/|opera/i.test(ua)) browser = 'Opera';
  else if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
  else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
  else if (/chrome|crios|chromium/i.test(ua)) browser = 'Chrome';
  else if (/safari/i.test(ua)) browser = 'Safari';
  else if (/msie|trident/i.test(ua)) browser = 'Internet Explorer';

  let os = 'سایر';
  if (/windows nt/i.test(ua)) os = 'Windows';
  else if (/iphone|ipad|ipod|ios /i.test(ua)) os = 'iOS';
  else if (/mac os x/i.test(ua)) os = 'macOS';
  else if (/android/i.test(ua)) os = 'Android';
  else if (/cros/i.test(ua)) os = 'ChromeOS';
  else if (/ubuntu/i.test(ua)) os = 'Ubuntu';
  else if (/linux/i.test(ua)) os = 'Linux';

  return { isBot, deviceType, browser, os };
}

export function hostFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    return new URL(url).hostname.replace(/^www\./, '') || null;
  } catch {
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* Location lookup                                                            */
/* -------------------------------------------------------------------------- */

export type ResolvedLocation = {
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
};

const EMPTY_LOCATION: ResolvedLocation = {
  country: null,
  countryCode: null,
  region: null,
  city: null,
};

const LOCAL_LOCATION: ResolvedLocation = {
  country: LOCAL_NETWORK_LABEL,
  countryCode: 'LAN',
  region: null,
  city: LOCAL_NETWORK_LABEL,
};

function isFresh(status: string, lookedUpAt: Date): boolean {
  const age = Date.now() - lookedUpAt.getTime();
  return status === 'FAILED' ? age < GEO_FAIL_TTL_MS : age < GEO_OK_TTL_MS;
}

/**
 * Resolves an address to a place, answering from the `IpLocation` cache
 * whenever possible. Never throws: a failed lookup only means the view is
 * recorded without a location, and `backfillMissingLocations` can fill it in
 * once the lookup service is reachable again.
 */
export async function resolveIpLocation(ip: string): Promise<ResolvedLocation> {
  if (isPrivateIp(ip)) {
    await prisma.ipLocation
      .upsert({
        where: { ip },
        create: { ip, ...LOCAL_LOCATION, status: 'PRIVATE', lookedUpAt: new Date() },
        update: { lookedUpAt: new Date() },
      })
      .catch(() => undefined);
    return LOCAL_LOCATION;
  }

  const cached = await prisma.ipLocation.findUnique({ where: { ip } }).catch(() => null);
  if (cached && isFresh(cached.status, cached.lookedUpAt)) {
    return {
      country: cached.country,
      countryCode: cached.countryCode,
      region: cached.region,
      city: cached.city,
    };
  }

  if (!GEO_API_URL) return EMPTY_LOCATION;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), GEO_TIMEOUT_MS);

  try {
    const response = await fetch(GEO_API_URL.replace('{ip}', encodeURIComponent(ip)), {
      signal: controller.signal,
      cache: 'no-store',
      headers: { accept: 'application/json' },
    });

    if (!response.ok) throw new Error('geo lookup failed with ' + response.status);

    const data = (await response.json()) as Record<string, unknown>;
    if (data.status && data.status !== 'success') {
      throw new Error(String(data.message || 'geo lookup rejected'));
    }

    const location: ResolvedLocation = {
      country: (data.country as string) || null,
      countryCode: (data.countryCode as string) || null,
      region: ((data.regionName || data.region) as string) || null,
      city: (data.city as string) || null,
    };

    const extras = {
      latitude: typeof data.lat === 'number' ? data.lat : null,
      longitude: typeof data.lon === 'number' ? data.lon : null,
      isp: (data.isp as string) || null,
      status: 'OK',
      lookedUpAt: new Date(),
    };

    await prisma.ipLocation
      .upsert({
        where: { ip },
        create: { ip, ...location, ...extras },
        update: { ...location, ...extras },
      })
      .catch(() => undefined);

    return location;
  } catch {
    await prisma.ipLocation
      .upsert({
        where: { ip },
        create: { ip, status: 'FAILED', lookedUpAt: new Date() },
        update: { status: 'FAILED', lookedUpAt: new Date() },
      })
      .catch(() => undefined);
    return EMPTY_LOCATION;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fills in the location of views recorded while the lookup service was
 * unreachable. Deliberately small-batched: the free geo tier is rate limited
 * and this runs opportunistically whenever the panel is opened.
 */
export async function backfillMissingLocations(maxIps = 5): Promise<number> {
  const pending = await prisma.pageView
    .findMany({
      where: { country: null },
      select: { ip: true },
      distinct: ['ip'],
      orderBy: { createdAt: 'desc' },
      take: maxIps,
    })
    .catch(() => [] as { ip: string }[]);

  let updated = 0;

  for (const { ip } of pending) {
    const location = await resolveIpLocation(ip);
    if (!location.country) continue;

    const result = await prisma.pageView
      .updateMany({ where: { ip, country: null }, data: location })
      .catch(() => null);

    if (result) updated += result.count;
  }

  return updated;
}
