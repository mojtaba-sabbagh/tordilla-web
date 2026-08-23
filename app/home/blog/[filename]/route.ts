// app/home/blog/[filename]/route.ts
import { NextResponse } from 'next/server';
import { readFile, stat } from 'fs/promises';
import path from 'path';
import { MEDIA_CONTENT_TYPES, resolveMediaPath } from '@/lib/media';

/**
 * Serves uploaded media under /home/blog/<name>.
 *
 * Next snapshots the public directory when the production server boots, so
 * files uploaded (or restored from a backup) afterwards are invisible to the
 * static handler until a restart — and in Docker they do not live under
 * public/ at all. Images that shipped with the build are still served
 * statically and never reach this route; everything else falls through here.
 */
export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> },
) {
  const { filename: rawName } = await params;

  let filename: string;
  try {
    filename = decodeURIComponent(rawName);
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  // resolveMediaPath rejects unsafe names and path escapes for us.
  const filePath = await resolveMediaPath(filename);

  if (!filePath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  try {
    const stats = await stat(filePath);
    const file = await readFile(filePath);

    return new NextResponse(new Uint8Array(file), {
      headers: {
        'Content-Type': MEDIA_CONTENT_TYPES[path.extname(filename).toLowerCase()],
        'Content-Length': String(stats.size),
        'Cache-Control': 'public, max-age=0, must-revalidate',
        'Last-Modified': stats.mtime.toUTCString(),
      },
    });
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
}
