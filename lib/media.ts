// lib/media.ts
import { mkdir, readdir, readFile, stat, writeFile } from 'fs/promises';
import path from 'path';
import { createZip, readZip } from '@/lib/zip';

/** Uploaded media lives here and is served from /home/blog/<name>. */
export const MEDIA_DIR = path.join(process.cwd(), 'public', 'home', 'blog');
export const MEDIA_PUBLIC_PREFIX = '/home/blog';

export const ALLOWED_MEDIA_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'image/avif': '.avif',
};

const ALLOWED_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.avif']);

export const MAX_MEDIA_FILE_BYTES = 5 * 1024 * 1024;
export const MAX_ARCHIVE_BYTES = 200 * 1024 * 1024;

export type MediaRestoreReport = {
  restored: number;
  overwritten: number;
  skipped: { name: string; reason: string }[];
};

function isSafeMediaName(name: string) {
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

export async function listMediaFiles(): Promise<string[]> {
  try {
    const names = await readdir(MEDIA_DIR);
    return names.filter(isSafeMediaName).sort();
  } catch {
    return [];
  }
}

export async function getMediaStats() {
  const names = await listMediaFiles();
  let bytes = 0;

  for (const name of names) {
    try {
      bytes += (await stat(path.join(MEDIA_DIR, name))).size;
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
    entries.push({ name, data: await readFile(path.join(MEDIA_DIR, name)) });
  }

  return createZip(entries);
}

export async function restoreMedia(
  archive: Buffer,
  { overwrite }: { overwrite: boolean },
): Promise<MediaRestoreReport> {
  const entries = readZip(archive);
  const report: MediaRestoreReport = { restored: 0, overwritten: 0, skipped: [] };

  await mkdir(MEDIA_DIR, { recursive: true });

  for (const entry of entries) {
    if (!isSafeMediaName(entry.name)) {
      report.skipped.push({ name: entry.name, reason: 'نام یا فرمت فایل مجاز نیست' });
      continue;
    }

    if (entry.data.length > MAX_MEDIA_FILE_BYTES) {
      report.skipped.push({ name: entry.name, reason: 'حجم فایل بیش از حد مجاز است' });
      continue;
    }

    const target = path.join(MEDIA_DIR, entry.name);

    // Belt and braces: the resolved path must stay inside the media directory.
    if (path.dirname(target) !== MEDIA_DIR) {
      report.skipped.push({ name: entry.name, reason: 'مسیر فایل مجاز نیست' });
      continue;
    }

    let exists = false;
    try {
      await stat(target);
      exists = true;
    } catch {
      exists = false;
    }

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
