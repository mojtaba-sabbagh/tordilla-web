// app/api/admin/media/backup/route.ts
import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { getMediaStats, packMedia } from '@/lib/media';

export async function GET() {
  const auth = await verifyAdminAuth();

  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { count } = await getMediaStats();

    if (count === 0) {
      return NextResponse.json({ error: 'هیچ تصویری برای پشتیبان‌گیری وجود ندارد.' }, { status: 404 });
    }

    const archive = await packMedia();
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');

    return new NextResponse(new Uint8Array(archive), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="tordilla-media-${stamp}.zip"`,
        'Content-Length': String(archive.length),
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error packing media:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `خطا در ساخت پشتیبان تصاویر: ${error.message}`
            : 'خطا در ساخت پشتیبان تصاویر.',
      },
      { status: 500 },
    );
  }
}
