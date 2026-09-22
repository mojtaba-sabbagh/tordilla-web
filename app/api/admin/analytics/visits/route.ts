// app/api/admin/analytics/visits/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { buildWhere, resolveRange, type ViewFilters } from '@/lib/analytics-stats';

export const dynamic = 'force-dynamic';

const MAX_LIMIT = 200;
const CSV_LIMIT = 10000;

const CSV_COLUMNS = [
  'تاریخ و زمان',
  'IP',
  'کشور',
  'استان',
  'شهر',
  'صفحه',
  'پارامترها',
  'ارجاع‌دهنده',
  'دستگاه',
  'مرورگر',
  'سیستم عامل',
  'زبان',
  'ربات',
  'User Agent',
] as const;

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return '';
  const text = String(value).replace(/"/g, '""');
  // Guard against spreadsheet formula injection from attacker-controlled UAs.
  const safe = /^[=+\-@]/.test(text) ? `'${text}` : text;
  return `"${safe}"`;
}

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
      ip: searchParams.get('ip'),
      deviceType: searchParams.get('deviceType'),
      search: searchParams.get('q'),
    };

    const where = buildWhere(range, filters);
    const isCsv = searchParams.get('format') === 'csv';

    if (isCsv) {
      const visits = await prisma.pageView.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: CSV_LIMIT,
      });

      const lines = [
        CSV_COLUMNS.join(','),
        ...visits.map((visit) =>
          [
            visit.createdAt.toISOString(),
            visit.ip,
            visit.country,
            visit.region,
            visit.city,
            visit.path,
            visit.query,
            visit.referrerHost ?? visit.referrer,
            visit.deviceType,
            visit.browser,
            visit.os,
            visit.locale,
            visit.isBot ? 'بله' : 'خیر',
            visit.userAgent,
          ]
            .map(csvCell)
            .join(','),
        ),
      ];

      const stamp = new Date().toISOString().slice(0, 10);

      // The BOM keeps Excel from mangling Persian text.
      return new NextResponse('﻿' + lines.join('\r\n'), {
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="tordilla-visits-${stamp}.csv"`,
        },
      });
    }

    const limit = Math.min(Math.max(parseInt(searchParams.get('limit') || '50', 10) || 50, 1), MAX_LIMIT);
    const page = Math.max(parseInt(searchParams.get('page') || '1', 10) || 1, 1);

    const [visits, total] = await Promise.all([
      prisma.pageView.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.pageView.count({ where }),
    ]);

    return NextResponse.json({
      visits,
      total,
      page,
      limit,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    });
  } catch (error) {
    console.error('Error fetching visit log:', error);
    return NextResponse.json({ error: 'خطا در دریافت فهرست بازدیدها' }, { status: 500 });
  }
}
