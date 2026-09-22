// lib/analytics-stats.ts
import { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { ANALYTICS_TIMEZONE } from '@/lib/analytics';

export type Granularity = 'hour' | 'day' | 'week' | 'month';

export const GRANULARITIES: Granularity[] = ['hour', 'day', 'week', 'month'];

export type RangePreset = 'today' | 'yesterday' | '7d' | '30d' | '90d' | '365d' | 'custom';

export type AnalyticsRange = {
  from: Date;
  to: Date;
  preset: RangePreset;
  granularity: Granularity;
  timeZone: string;
};

/* -------------------------------------------------------------------------- */
/* Time zone helpers                                                          */
/* -------------------------------------------------------------------------- */

/**
 * Offset between the zone and UTC at a given instant, in milliseconds.
 * Iran dropped DST in 2022, but deriving the offset keeps this correct for any
 * zone the site might be reported in later.
 */
function zoneOffsetMs(instant: Date, timeZone: string): number {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(instant);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0');
  const hour = get('hour') % 24; // Intl renders midnight as 24 in some runtimes

  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), hour, get('minute'), get('second'));
  return asUtc - instant.getTime();
}

/** The instant at which the given wall-clock time happens in `timeZone`. */
function fromZonedTime(
  year: number,
  month: number,
  day: number,
  timeZone: string,
  hour = 0,
  minute = 0,
  second = 0,
): Date {
  const guess = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
  const firstOffset = zoneOffsetMs(guess, timeZone);
  const candidate = new Date(guess.getTime() - firstOffset);
  const secondOffset = zoneOffsetMs(candidate, timeZone);
  if (secondOffset === firstOffset) return candidate;
  return new Date(guess.getTime() - secondOffset);
}

/** Calendar date in `timeZone` for an instant. */
function zonedDateParts(instant: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(instant);

  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value ?? '0');
  return { year: get('year'), month: get('month'), day: get('day') };
}

function startOfZonedDay(instant: Date, timeZone: string): Date {
  const { year, month, day } = zonedDateParts(instant, timeZone);
  return fromZonedTime(year, month, day, timeZone);
}

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

function parseIsoDate(value: string | null, timeZone: string, endOfDay = false): Date | null {
  if (!value) return null;
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;

  const [, year, month, day] = match;
  const start = fromZonedTime(Number(year), Number(month), Number(day), timeZone);
  return endOfDay ? addDays(start, 1) : start;
}

/* -------------------------------------------------------------------------- */
/* Range resolution                                                           */
/* -------------------------------------------------------------------------- */

function defaultGranularity(from: Date, to: Date): Granularity {
  const days = (to.getTime() - from.getTime()) / (24 * 60 * 60 * 1000);
  if (days <= 2) return 'hour';
  if (days <= 70) return 'day';
  if (days <= 400) return 'week';
  return 'month';
}

/**
 * Turns `?range=`/`?from=`/`?to=`/`?granularity=` into a concrete UTC window.
 * Dates in the query string are Tehran calendar days, and `to` is inclusive of
 * the whole day the admin picked.
 */
export function resolveRange(searchParams: URLSearchParams): AnalyticsRange {
  const timeZone = ANALYTICS_TIMEZONE;
  const now = new Date();
  const todayStart = startOfZonedDay(now, timeZone);

  const requestedPreset = (searchParams.get('range') || '').trim() as RangePreset;
  const customFrom = parseIsoDate(searchParams.get('from'), timeZone);
  const customTo = parseIsoDate(searchParams.get('to'), timeZone, true);

  let preset: RangePreset = requestedPreset || '30d';
  let from: Date;
  let to: Date;

  if (customFrom || customTo) {
    preset = 'custom';
    from = customFrom ?? addDays(todayStart, -29);
    to = customTo ?? addDays(todayStart, 1);
  } else {
    switch (preset) {
      case 'today':
        from = todayStart;
        to = addDays(todayStart, 1);
        break;
      case 'yesterday':
        from = addDays(todayStart, -1);
        to = todayStart;
        break;
      case '7d':
        from = addDays(todayStart, -6);
        to = addDays(todayStart, 1);
        break;
      case '90d':
        from = addDays(todayStart, -89);
        to = addDays(todayStart, 1);
        break;
      case '365d':
        from = addDays(todayStart, -364);
        to = addDays(todayStart, 1);
        break;
      case '30d':
      default:
        preset = '30d';
        from = addDays(todayStart, -29);
        to = addDays(todayStart, 1);
        break;
    }
  }

  if (to.getTime() <= from.getTime()) to = addDays(from, 1);

  const requestedGranularity = (searchParams.get('granularity') || '') as Granularity;
  const granularity = GRANULARITIES.includes(requestedGranularity)
    ? requestedGranularity
    : defaultGranularity(from, to);

  return { from, to, preset, granularity, timeZone };
}

/* -------------------------------------------------------------------------- */
/* Filters                                                                    */
/* -------------------------------------------------------------------------- */

export type ViewFilters = {
  includeBots: boolean;
  path?: string | null;
  country?: string | null;
  ip?: string | null;
  deviceType?: string | null;
  search?: string | null;
};

export function buildWhere(range: { from: Date; to: Date }, filters: ViewFilters): Prisma.PageViewWhereInput {
  const where: Prisma.PageViewWhereInput = {
    createdAt: { gte: range.from, lt: range.to },
  };

  if (!filters.includeBots) where.isBot = false;
  if (filters.path) where.path = filters.path;
  if (filters.country) where.country = filters.country;
  if (filters.ip) where.ip = { contains: filters.ip };
  if (filters.deviceType) where.deviceType = filters.deviceType;

  if (filters.search) {
    const search = filters.search;
    where.OR = [
      { ip: { contains: search, mode: 'insensitive' } },
      { path: { contains: search, mode: 'insensitive' } },
      { city: { contains: search, mode: 'insensitive' } },
      { country: { contains: search, mode: 'insensitive' } },
      { referrerHost: { contains: search, mode: 'insensitive' } },
      { userAgent: { contains: search, mode: 'insensitive' } },
    ];
  }

  return where;
}

/* -------------------------------------------------------------------------- */
/* Aggregates                                                                 */
/* -------------------------------------------------------------------------- */

function utcLiteral(date: Date): string {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

/**
 * Postgres weeks start on Monday; Iranian weeks start on Saturday, so the
 * timestamp is shifted two days forward before truncating and back afterwards.
 */
function weekShift(granularity: Granularity): string {
  return granularity === 'week' ? '2 days' : '0 days';
}

const INTERVAL_BY_GRANULARITY: Record<Granularity, string> = {
  hour: '1 hour',
  day: '1 day',
  week: '1 week',
  month: '1 month',
};

export type SeriesPoint = {
  bucket: string; // local wall-clock "YYYY-MM-DD HH:mm"
  views: number;
  visitors: number;
  sessions: number;
};

export async function getSeries(
  range: AnalyticsRange,
  filters: ViewFilters,
): Promise<SeriesPoint[]> {
  const { granularity, timeZone } = range;
  const shift = weekShift(granularity);
  const step = INTERVAL_BY_GRANULARITY[granularity];
  const fromLiteral = utcLiteral(range.from);
  const toLiteral = utcLiteral(range.to);

  const botFilter = filters.includeBots ? Prisma.empty : Prisma.sql` AND "isBot" = false`;
  const pathFilter = filters.path ? Prisma.sql` AND "path" = ${filters.path}` : Prisma.empty;
  const countryFilter = filters.country ? Prisma.sql` AND "country" = ${filters.country}` : Prisma.empty;

  const rows = await prisma.$queryRaw<
    { bucket: string; views: number; visitors: number; sessions: number }[]
  >(Prisma.sql`
    WITH bounds AS (
      SELECT
        date_trunc(${granularity}, (((${fromLiteral}::timestamp AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone}) + ${shift}::interval)) - ${shift}::interval AS start_bucket,
        date_trunc(${granularity}, ((((${toLiteral}::timestamp - interval '1 millisecond') AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone}) + ${shift}::interval)) - ${shift}::interval AS end_bucket
    ),
    series AS (
      SELECT generate_series(start_bucket, end_bucket, ${step}::interval) AS bucket FROM bounds
    ),
    bucketed AS (
      SELECT
        date_trunc(${granularity}, (((("createdAt" AT TIME ZONE 'UTC') AT TIME ZONE ${timeZone})) + ${shift}::interval)) - ${shift}::interval AS bucket,
        "visitorId",
        "sessionId"
      FROM "PageView"
      WHERE "createdAt" >= ${fromLiteral}::timestamp
        AND "createdAt" < ${toLiteral}::timestamp
        ${botFilter}${pathFilter}${countryFilter}
    )
    SELECT
      to_char(s.bucket, 'YYYY-MM-DD HH24:MI') AS bucket,
      COUNT(b."visitorId")::int AS views,
      COUNT(DISTINCT b."visitorId")::int AS visitors,
      COUNT(DISTINCT b."sessionId")::int AS sessions
    FROM series s
    LEFT JOIN bucketed b ON b.bucket = s.bucket
    GROUP BY s.bucket
    ORDER BY s.bucket
  `);

  return rows.map((row) => ({
    bucket: row.bucket,
    views: Number(row.views),
    visitors: Number(row.visitors),
    sessions: Number(row.sessions),
  }));
}

export type Totals = {
  views: number;
  visitors: number;
  sessions: number;
  ips: number;
  countries: number;
};

export async function getTotals(
  from: Date,
  to: Date,
  filters: ViewFilters,
): Promise<Totals> {
  const botFilter = filters.includeBots ? Prisma.empty : Prisma.sql` AND "isBot" = false`;
  const pathFilter = filters.path ? Prisma.sql` AND "path" = ${filters.path}` : Prisma.empty;
  const countryFilter = filters.country ? Prisma.sql` AND "country" = ${filters.country}` : Prisma.empty;

  const rows = await prisma.$queryRaw<
    { views: number; visitors: number; sessions: number; ips: number; countries: number }[]
  >(Prisma.sql`
    SELECT
      COUNT(*)::int AS views,
      COUNT(DISTINCT "visitorId")::int AS visitors,
      COUNT(DISTINCT "sessionId")::int AS sessions,
      COUNT(DISTINCT "ip")::int AS ips,
      COUNT(DISTINCT "country")::int AS countries
    FROM "PageView"
    WHERE "createdAt" >= ${utcLiteral(from)}::timestamp
      AND "createdAt" < ${utcLiteral(to)}::timestamp
      ${botFilter}${pathFilter}${countryFilter}
  `);

  const row = rows[0];
  return {
    views: Number(row?.views ?? 0),
    visitors: Number(row?.visitors ?? 0),
    sessions: Number(row?.sessions ?? 0),
    ips: Number(row?.ips ?? 0),
    countries: Number(row?.countries ?? 0),
  };
}

export type BreakdownRow = { label: string | null; extra?: string | null; count: number };

type GroupedRow = Record<string, unknown> & { _count: { _all: number } };

/**
 * `groupBy` is typed per literal field list, so a helper that takes the field
 * as a value needs the delegate loosened; the row shape is re-asserted below.
 */
const groupByDynamic = prisma.pageView.groupBy as unknown as (
  args: Record<string, unknown>,
) => Promise<GroupedRow[]>;

async function groupCount(
  by: 'path' | 'country' | 'referrerHost' | 'deviceType' | 'browser' | 'os',
  where: Prisma.PageViewWhereInput,
  take: number,
): Promise<BreakdownRow[]> {
  const rows = await groupByDynamic({
    by: [by],
    where,
    _count: { _all: true },
    orderBy: { _count: { [by]: 'desc' } },
    take,
  });

  return rows.map((row) => ({
    label: (row[by] as string | null) ?? null,
    count: row._count._all,
  }));
}

export type Breakdowns = {
  pages: BreakdownRow[];
  countries: BreakdownRow[];
  cities: BreakdownRow[];
  referrers: BreakdownRow[];
  devices: BreakdownRow[];
  browsers: BreakdownRow[];
  operatingSystems: BreakdownRow[];
  topIps: BreakdownRow[];
};

export async function getBreakdowns(where: Prisma.PageViewWhereInput): Promise<Breakdowns> {
  const [pages, countries, referrers, devices, browsers, operatingSystems, cityRows, ipRows] =
    await Promise.all([
      groupCount('path', where, 12),
      groupCount('country', where, 12),
      groupCount('referrerHost', where, 10),
      groupCount('deviceType', where, 6),
      groupCount('browser', where, 8),
      groupCount('os', where, 8),
      prisma.pageView.groupBy({
        by: ['city', 'country'],
        where,
        _count: { _all: true },
        orderBy: { _count: { city: 'desc' } },
        take: 12,
      }),
      prisma.pageView.groupBy({
        by: ['ip', 'country', 'city'],
        where,
        _count: { _all: true },
        orderBy: { _count: { ip: 'desc' } },
        take: 12,
      }),
    ]);

  return {
    pages,
    countries,
    cities: cityRows.map((row) => ({
      label: row.city,
      extra: row.country,
      count: row._count._all,
    })),
    referrers,
    devices,
    browsers,
    operatingSystems,
    topIps: ipRows.map((row) => ({
      label: row.ip,
      extra: [row.city, row.country].filter(Boolean).join('، ') || null,
      count: row._count._all,
    })),
  };
}
