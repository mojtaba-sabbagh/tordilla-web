// app/api/admin/analytics/today/route.ts
import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { getTotals, resolveRange } from '@/lib/analytics-stats';

export const dynamic = 'force-dynamic';

/** Lightweight counter for the dashboard card — no breakdowns, no geo work. */
export async function GET() {
  try {
    const { isValid } = await verifyAdminAuth();
    if (!isValid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const range = resolveRange(new URLSearchParams({ range: 'today' }));
    const totals = await getTotals(range.from, range.to, { includeBots: false });

    return NextResponse.json({ views: totals.views, visitors: totals.visitors });
  } catch (error) {
    console.error('Error fetching today analytics:', error);
    return NextResponse.json({ error: 'خطا در دریافت آمار امروز' }, { status: 500 });
  }
}
