// app/api/admin/backup/route.ts
import { NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { createBackup } from '@/lib/backup';

export async function GET() {
  const auth = await verifyAdminAuth();

  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backup = await createBackup();
    const stamp = backup.createdAt.slice(0, 19).replace(/[:T]/g, '-');

    return new NextResponse(JSON.stringify(backup, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Content-Disposition': `attachment; filename="tordilla-backup-${stamp}.json"`,
        'Cache-Control': 'no-store',
      },
    });
  } catch (error) {
    console.error('Error creating backup:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `خطا در ساخت پشتیبان: ${error.message}`
            : 'خطا در ساخت پشتیبان.',
      },
      { status: 500 },
    );
  }
}
