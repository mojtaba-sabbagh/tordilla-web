// app/api/admin/media/restore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { MAX_ARCHIVE_BYTES, restoreMedia } from '@/lib/media';

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth();

  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const overwrite = formData.get('overwrite') === 'true';

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'فایلی ارسال نشده است.' }, { status: 400 });
    }

    if (file.size > MAX_ARCHIVE_BYTES) {
      return NextResponse.json({ error: 'حجم آرشیو بیش از حد مجاز است.' }, { status: 413 });
    }

    const report = await restoreMedia(Buffer.from(await file.arrayBuffer()), { overwrite });

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error restoring media:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `خطا در بازگردانی تصاویر: ${error.message}`
            : 'خطا در بازگردانی تصاویر.',
      },
      { status: 500 },
    );
  }
}
