// app/api/admin/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';
import { verifyAdminAuth } from '@/lib/admin-auth';
import {
  ALLOWED_MEDIA_TYPES as ALLOWED_TYPES,
  MAX_MEDIA_FILE_BYTES as MAX_BYTES,
  MEDIA_UPLOAD_DIR as UPLOAD_DIR,
  MEDIA_PUBLIC_PREFIX as PUBLIC_PREFIX,
} from '@/lib/media';

function buildFileName(originalName: string, mimeType: string) {
  const extension = ALLOWED_TYPES[mimeType];
  const base = path
    .basename(originalName, path.extname(originalName))
    .toLowerCase()
    .normalize('NFKD')
    // keep latin letters, digits and Persian/Arabic letters, everything else becomes a dash
    .replace(/[^\w؀-ۿ]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

  const stamp = Date.now().toString(36);
  return `${base || 'image'}-${stamp}${extension}`;
}

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth();

  if (!auth.isValid) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'فایلی ارسال نشده است.' }, { status: 400 });
    }

    if (!ALLOWED_TYPES[file.type]) {
      return NextResponse.json(
        { error: 'فرمت تصویر پشتیبانی نمی‌شود. (JPG, PNG, WebP, GIF, AVIF)' },
        { status: 415 },
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: 'حجم تصویر باید کمتر از ۵ مگابایت باشد.' }, { status: 413 });
    }

    const fileName = buildFileName(file.name || 'image', file.type);
    const targetPath = path.join(UPLOAD_DIR, fileName);

    // Guard against any path escaping the upload directory
    if (path.dirname(targetPath) !== UPLOAD_DIR) {
      return NextResponse.json({ error: 'نام فایل نامعتبر است.' }, { status: 400 });
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    await writeFile(targetPath, Buffer.from(await file.arrayBuffer()));

    return NextResponse.json({
      url: `${PUBLIC_PREFIX}/${fileName}`,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ error: 'خطا در آپلود تصویر.' }, { status: 500 });
  }
}
