// app/api/admin/analytics/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { backfillMissingLocations } from '@/lib/analytics';
import {
  buildWhere,
  getBreakdowns,
  getSeries,
  getTotals,
  resolveRange,
  type ViewFilters,
} from '@/lib/analytics-stats';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { isValid } = await verifyAdminAuth();
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const range = resolveRange(searchParams);

    const filters: ViewFilters = {
      includeBots: searchParams.get('includeBots') === '1',
      path: searchParams.get('path'),
      country: searchParams.get('country'),
    };

    // Addresses recorded while the geo service was unreachable get a second
    // chance every time the panel is opened. Deliberately not awaited: a slow
    // lookup service must not hold up the report, the result lands in the next
    // refresh instead.
    void backfillMissingLocations(5).catch(() => 0);

    const where = buildWhere(range, filters);

    // Same-length window immediately before the selected one, for the deltas.
    const span = range.to.getTime() - range.from.getTime();
    const previousFrom = new Date(range.from.getTime() - span);

    const [totals, previousTotals, series, breakdowns, firstView] = await Promise.all([
      getTotals(range.from, range.to, filters),
      getTotals(previousFrom, range.from, filters),
      getSeries(range, filters),
      getBreakdowns(where),
      prisma.pageView.findFirst({ orderBy: { createdAt: 'asc' }, select: { createdAt: true } }),
    ]);

    return NextResponse.json({
      range: {
        from: range.from.toISOString(),
        to: range.to.toISOString(),
        preset: range.preset,
        granularity: range.granularity,
        timeZone: range.timeZone,
      },
      totals,
      previousTotals,
      series,
      breakdowns,
      trackingSince: firstView?.createdAt ?? null,
    });
  } catch (error) {
    console.error('Error building analytics summary:', error);
    return NextResponse.json({ error: 'خطا در دریافت آمار بازدید' }, { status: 500 });
  }
}
