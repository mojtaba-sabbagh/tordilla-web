// lib/backup.ts
import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export const BACKUP_FORMAT = 'tordilla-backup';
export const BACKUP_VERSION = 1;

export type RestoreMode = 'merge' | 'replace';

export type BackupFile = {
  format: typeof BACKUP_FORMAT;
  version: number;
  createdAt: string;
  counts: Record<string, number>;
  data: {
    blogPosts: any[];
    comments: any[];
    sitePageContent: any[];
    contactMessages: any[];
  };
};

export type RestoreReport = {
  mode: RestoreMode;
  blogPosts: { created: number; updated: number };
  comments: { created: number; updated: number; skipped: number };
  sitePageContent: { created: number; updated: number };
  contactMessages: { created: number; updated: number };
  warnings: string[];
};

/**
 * Admin credentials are deliberately left out: a backup is meant to be
 * downloadable and shareable, and restoring stale password hashes could lock
 * the real admin out of the panel.
 */
export async function createBackup(): Promise<BackupFile> {
  const [blogPosts, comments, sitePageContent, contactMessages] = await Promise.all([
    prisma.blogPost.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.comment.findMany({ orderBy: { createdAt: 'asc' } }),
    prisma.sitePageContent.findMany({ orderBy: [{ pageKey: 'asc' }, { language: 'asc' }] }),
    prisma.contactMessage.findMany({ orderBy: { createdAt: 'asc' } }),
  ]);

  return {
    format: BACKUP_FORMAT,
    version: BACKUP_VERSION,
    createdAt: new Date().toISOString(),
    counts: {
      blogPosts: blogPosts.length,
      comments: comments.length,
      sitePageContent: sitePageContent.length,
      contactMessages: contactMessages.length,
    },
    data: { blogPosts, comments, sitePageContent, contactMessages },
  };
}

function asArray(value: unknown): any[] {
  return Array.isArray(value) ? value : [];
}

function toDate(value: unknown, fallback: Date = new Date()): Date {
  if (value instanceof Date) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return fallback;
}

export function validateBackup(raw: unknown): { backup: BackupFile | null; error: string | null } {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return { backup: null, error: 'ساختار فایل پشتیبان معتبر نیست.' };
  }

  const candidate = raw as Partial<BackupFile>;

  if (candidate.format !== BACKUP_FORMAT) {
    return { backup: null, error: 'این فایل، پشتیبان ترددیلا نیست.' };
  }

  if (typeof candidate.version !== 'number' || candidate.version > BACKUP_VERSION) {
    return {
      backup: null,
      error: `نسخه فایل پشتیبان (${candidate.version}) پشتیبانی نمی‌شود.`,
    };
  }

  if (typeof candidate.data !== 'object' || candidate.data === null) {
    return { backup: null, error: 'بخش data در فایل پشتیبان وجود ندارد.' };
  }

  return { backup: candidate as BackupFile, error: null };
}

/**
 * Postgres does not advance an autoincrement sequence when rows are inserted
 * with explicit ids, so the next contact message would collide. Realign it.
 */
async function resyncContactMessageSequence(tx: Prisma.TransactionClient) {
  await tx.$executeRawUnsafe(
    `SELECT setval(pg_get_serial_sequence('"ContactMessage"', 'id'), COALESCE((SELECT MAX(id) FROM "ContactMessage"), 1), (SELECT COUNT(*) > 0 FROM "ContactMessage"))`,
  );
}

export async function restoreBackup(backup: BackupFile, mode: RestoreMode): Promise<RestoreReport> {
  const report: RestoreReport = {
    mode,
    blogPosts: { created: 0, updated: 0 },
    comments: { created: 0, updated: 0, skipped: 0 },
    sitePageContent: { created: 0, updated: 0 },
    contactMessages: { created: 0, updated: 0 },
    warnings: [],
  };

  const blogPosts = asArray(backup.data.blogPosts);
  const comments = asArray(backup.data.comments);
  const sitePageContent = asArray(backup.data.sitePageContent);
  const contactMessages = asArray(backup.data.contactMessages);

  await prisma.$transaction(
    async (tx) => {
      if (mode === 'replace') {
        // Comments first: they reference posts.
        await tx.comment.deleteMany({});
        await tx.blogPost.deleteMany({});
        await tx.sitePageContent.deleteMany({});
        await tx.contactMessage.deleteMany({});
      }

      // Maps a post id from the backup to the id it actually got in this database.
      const postIdMap = new Map<string, string>();

      for (const post of blogPosts) {
        if (!post?.slug) {
          report.warnings.push('یک مطلب بدون slug نادیده گرفته شد.');
          continue;
        }

        const data = {
          slug: String(post.slug),
          title: post.title ?? {},
          category: post.category ?? {},
          categorySlug: String(post.categorySlug ?? ''),
          date: toDate(post.date),
          image: String(post.image ?? ''),
          imageWidth: Number(post.imageWidth) || 800,
          imageHeight: Number(post.imageHeight) || 600,
          excerpt: post.excerpt ?? {},
          content: post.content ?? {},
          author: post.author ?? {},
          published: post.published ?? false,
        };

        // A post may already exist under the same id or the same slug.
        const existing = await tx.blogPost.findFirst({
          where: {
            OR: [...(post.id ? [{ id: String(post.id) }] : []), { slug: data.slug }],
          },
        });

        if (existing) {
          const updated = await tx.blogPost.update({ where: { id: existing.id }, data });
          postIdMap.set(String(post.id ?? updated.id), updated.id);
          report.blogPosts.updated++;
        } else {
          const created = await tx.blogPost.create({
            data: { ...data, ...(post.id ? { id: String(post.id) } : {}) },
          });
          postIdMap.set(String(post.id ?? created.id), created.id);
          report.blogPosts.created++;
        }
      }

      for (const comment of comments) {
        const backupPostId = String(comment?.blogPostId ?? '');
        const targetPostId =
          postIdMap.get(backupPostId) ??
          (await tx.blogPost.findUnique({ where: { id: backupPostId }, select: { id: true } }))?.id;

        if (!targetPostId) {
          report.comments.skipped++;
          continue;
        }

        const data = {
          name: String(comment.name ?? ''),
          email: String(comment.email ?? ''),
          content: String(comment.content ?? ''),
          status: comment.status ?? 'PENDING',
          blogPostId: targetPostId,
          createdAt: toDate(comment.createdAt),
        };

        const existing = comment.id
          ? await tx.comment.findUnique({ where: { id: String(comment.id) } })
          : null;

        if (existing) {
          await tx.comment.update({ where: { id: existing.id }, data });
          report.comments.updated++;
        } else {
          await tx.comment.create({
            data: { ...data, ...(comment.id ? { id: String(comment.id) } : {}) },
          });
          report.comments.created++;
        }
      }

      for (const page of sitePageContent) {
        if (!page?.pageKey || !page?.language) {
          report.warnings.push('یک بخش محتوا بدون pageKey یا language نادیده گرفته شد.');
          continue;
        }

        const key = {
          pageKey_language: {
            pageKey: String(page.pageKey),
            language: String(page.language),
          },
        };
        const data = {
          title: String(page.title ?? page.pageKey),
          content: page.content ?? {},
        };

        const existing = await tx.sitePageContent.findUnique({ where: key });

        if (existing) {
          await tx.sitePageContent.update({ where: key, data });
          report.sitePageContent.updated++;
        } else {
          await tx.sitePageContent.create({
            data: {
              pageKey: String(page.pageKey),
              language: String(page.language),
              ...data,
            },
          });
          report.sitePageContent.created++;
        }
      }

      for (const message of contactMessages) {
        const data = {
          name: String(message.name ?? ''),
          email: String(message.email ?? ''),
          phone: message.phone ? String(message.phone) : null,
          subject: String(message.subject ?? ''),
          message: String(message.message ?? ''),
          status: String(message.status ?? 'UNSEEN'),
          createdAt: toDate(message.createdAt),
        };

        const id = Number(message.id);
        const existing = Number.isFinite(id)
          ? await tx.contactMessage.findUnique({ where: { id } })
          : null;

        if (existing) {
          await tx.contactMessage.update({ where: { id: existing.id }, data });
          report.contactMessages.updated++;
        } else {
          await tx.contactMessage.create({
            data: { ...data, ...(Number.isFinite(id) ? { id } : {}) },
          });
          report.contactMessages.created++;
        }
      }

      await resyncContactMessageSequence(tx);
    },
    { timeout: 120_000, maxWait: 15_000 },
  );

  return report;
}
