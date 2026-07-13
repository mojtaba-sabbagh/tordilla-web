import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { getSiteContentAdminPayload, upsertSitePageContent } from '@/lib/site-content';
import type { Locale } from '@/lib/i18n';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth();

  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const pages = await getSiteContentAdminPayload();
    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching site content:', error);
    return NextResponse.json({ error: 'Failed to load site content' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth();

  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { pageKey, language, content } = body as {
      pageKey: string;
      language: Locale;
      content: unknown;
    };

    if (!pageKey || !language || content === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const record = await upsertSitePageContent(pageKey, language, content);
    return NextResponse.json({ record }, { status: 200 });
  } catch (error) {
    console.error('Error saving site content:', error);
    return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 });
  }
}
