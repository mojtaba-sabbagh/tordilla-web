// app/api/admin/restore/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminAuth } from '@/lib/admin-auth';
import { restoreBackup, validateBackup, type RestoreMode } from '@/lib/backup';

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth();

  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const mode: RestoreMode = body?.mode === 'replace' ? 'replace' : 'merge';

    // Replace wipes the current data, so it needs an explicit typed confirmation.
    if (mode === 'replace' && body?.confirm !== 'REPLACE') {
      return NextResponse.json(
        { error: 'برای بازگردانی جایگزینی، تأیید لازم است.' },
        { status: 400 },
      );
    }

    const { backup, error } = validateBackup(body?.backup);

    if (!backup) {
      return NextResponse.json({ error }, { status: 400 });
    }

    const report = await restoreBackup(backup, mode);

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error restoring backup:', error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `خطا در بازگردانی: ${error.message}`
            : 'خطا در بازگردانی پشتیبان.',
      },
      { status: 500 },
    );
  }
}
