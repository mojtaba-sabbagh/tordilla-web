// lib/media.ts
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';
import { createZip, readZip } from '@/lib/zip';

/**
 * Media is served from /home/blog/<name> and read from two directories.
 *
 * MEDIA_SEED_DIR holds the images committed to the repo. They ship inside the
 * build, so in production Next serves them straight off the public directory
 * and they never reach our route handler.
 *
 * MEDIA_UPLOAD_DIR is where new uploads are written. It defaults to the same
 * public directory for local development, but in Docker it points at a mounted
 * volume (MEDIA_UPLOAD_DIR=/app/data/media) so uploads survive an image
 * rebuild. Next snapshots public/ once at startup in production, so files that
 * land there afterwards are invisible to the static handler either way — they
 * are served by app/home/blog/[filename]/route.ts instead.
 */
export const MEDIA_SEED_DIR = path.join(process.cwd(), 'public', 'home', 'blog');

export const MEDIA_UPLOAD_DIR = process.env.MEDIA_UPLOAD_DIR
  ? path.resolve(process.env.MEDIA_UPLOAD_DIR)
  : MEDIA_SEED_DIR;

export const MEDIA_PUBLIC_PREFIX = '/home/blog';

/**
 * Where to look for a file, uploads first so a re-upload shadows a seed image
 * of the same name. Collapses to a single entry when both point at public/.
 */
function mediaSearchDirs(): string[] {
  return MEDIA_UPLOAD_DIR === MEDIA_SEED_DIR
    ? [MEDIA_UPLOAD_DIR]
    : [MEDIA_UPLOAD_DIR, MEDIA_SEED_DIR];
}

/** Absolute path of an existing media file, or null when there is no such file. */
export async function resolveMediaPath(name: string): Promise<string | null> {
  if (!isSafeMediaName(name)) return null;

  for (const dir of mediaSearchDirs()) {
    const candidate = path.join(dir, name);

    // Belt and braces: the resolved path must stay inside its directory.
    if (path.dirname(candidate) !== dir) continue;

    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // Missing here just means we try the next directory.
    }
  }

  return null;
}

export const ALLOWED_MEDIA_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

/** Content type to send back when serving an uploaded file, keyed by extension. */
export const MEDIA_CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

const ALLOWED_EXTENSIONS = new Set(Object.keys(MEDIA_CONTENT_TYPES));

export const MAX_MEDIA_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_ARCHIVE_BYTES = 200 * 1024 * 1024;

export type MediaRestoreReport = {
  restored: number;
  overwritten: number;
  skipped: { name: string; reason: string }[];
};

export function isSafeMediaName(name: string) {
  // Flat filenames only: no directories, no traversal, no dotfiles.
  return (
    name.length > 0 &&
    name === path.basename(name) &&
    !name.startsWith('.') &&
    !name.includes('/') &&
    !name.includes('\\') &&
    ALLOWED_EXTENSIONS.has(path.extname(name).toLowerCase())
  );
}

/** Every media file the site can serve, uploads and seed images together. */
export async function listMediaFiles(): Promise<string[]> {
  const names = new Set<string>();

  for (const dir of mediaSearchDirs()) {
    try {
      for (const name of await readdir(dir)) {
        if (isSafeMediaName(name)) names.add(name);
      }
    } catch {
      // A directory that does not exist yet simply contributes nothing.
    }
  }

  return [...names].sort();
}

export async function getMediaStats() {
  const names = await listMediaFiles();
  let bytes = 0;

  for (const name of names) {
    try {
      const filePath = await resolveMediaPath(name);
      if (filePath) bytes += (await stat(filePath)).size;
    } catch {
      // A file vanishing between listing and stat is not worth failing over.
    }
  }

  return { count: names.length, bytes };
}

export async function packMedia(): Promise<Buffer> {
  const names = await listMediaFiles();
  const entries = [];

  for (const name of names) {
    const filePath = await resolveMediaPath(name);
    if (filePath) entries.push({ name, data: await readFile(filePath) });
  }

  return createZip(entries);
}

export async function restoreMedia(
  archive: Buffer,
  { overwrite }: { overwrite: boolean },
): Promise<MediaRestoreReport> {
  const entries = readZip(archive);
  const report: MediaRestoreReport = { restored: 0, overwritten: 0, skipped: [] };

  await mkdir(MEDIA_UPLOAD_DIR, { recursive: true });

  for (const entry of entries) {
    if (!isSafeMediaName(entry.name)) {
      report.skipped.push({ name: entry.name, reason: 'نام یا فرمت فایل مجاز نیست' });
      continue;
    }

    if (entry.data.length > MAX_MEDIA_FILE_BYTES) {
      report.skipped.push({ name: entry.name, reason: 'حجم فایل بیش از حد مجاز است' });
      continue;
    }

    const target = path.join(MEDIA_UPLOAD_DIR, entry.name);

    // Belt and braces: the resolved path must stay inside the upload directory.
    if (path.dirname(target) !== MEDIA_UPLOAD_DIR) {
      report.skipped.push({ name: entry.name, reason: 'مسیر فایل مجاز نیست' });
      continue;
    }

    // A seed image of the same name counts as existing: restoring over it
    // writes an upload that shadows it rather than silently duplicating it.
    const exists = (await resolveMediaPath(entry.name)) !== null;

    if (exists && !overwrite) {
      report.skipped.push({ name: entry.name, reason: 'فایل هم‌نام از قبل وجود دارد' });
      continue;
    }

    await writeFile(target, entry.data);

    if (exists) {
      report.overwritten++;
    } else {
      report.restored++;
    }
  }

  return report;
}
