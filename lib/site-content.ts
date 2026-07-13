import { prisma } from '@/lib/prisma';
import { locales, translations, type Locale } from '@/lib/i18n';

export type SiteContentSection = Record<string, unknown>;

function getFallbackLocaleContent(locale: Locale): SiteContentSection {
  return translations[locale] as SiteContentSection;
}

async function runWithFallback<T>(operation: () => Promise<T>, fallbackValue: T): Promise<T> {
  if (!process.env.DATABASE_URL) {
    return fallbackValue;
  }

  try {
    return await operation();
  } catch (error) {
    console.warn('Site content database unavailable, falling back to local translations.', error);
    return fallbackValue;
  }
}

function normalizeForStorage(value: unknown): unknown {
  if (typeof value === 'function') {
    return '';
  }

  if (Array.isArray(value)) {
    return value.map((item) => normalizeForStorage(item));
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([key, childValue]) => [key, normalizeForStorage(childValue)]),
    );
  }

  return value;
}

function getPageLabel(pageKey: string) {
  const labels: Record<string, string> = {
    common: 'General UI',
    nav: 'Navigation',
    footer: 'Footer',
    about: 'About Page',
    contact: 'Contact Page',
    products: 'Products Page',
    productDetail: 'Product Detail Page',
    home: 'Home Page',
    blog: 'Blog Page',
    agency: 'Agency Page',
    shop: 'Shop Page',
    tordillaFinder: 'Tordilla Finder Page',
    cinema: 'Cinema Page',
  };

  return labels[pageKey] || pageKey;
}

export async function ensureSiteContentSeeded() {
  await runWithFallback(async () => {
    const existingCount = await prisma.sitePageContent.count();
    if (existingCount > 0) {
      return;
    }

    const seedData = locales.flatMap((locale) => {
      const pageSections = getFallbackLocaleContent(locale);

      return Object.entries(pageSections).map(([pageKey, value]) => ({
        pageKey,
        language: locale,
        title: getPageLabel(pageKey),
        content: normalizeForStorage(value) as Record<string, unknown>,
      }));
    });

    await prisma.sitePageContent.createMany({
      data: seedData,
    });
  }, undefined);
}

export async function getSiteTranslations(locale: Locale): Promise<SiteContentSection> {
  const fallback = getFallbackLocaleContent(locale);

  const records = await runWithFallback(async () => {
    await ensureSiteContentSeeded();

    return prisma.sitePageContent.findMany({
      where: { language: locale },
      select: { pageKey: true, content: true },
    });
  }, []);

  const merged: SiteContentSection = {};
  for (const record of records) {
    merged[record.pageKey] = record.content as SiteContentSection;
  }

  for (const [pageKey, value] of Object.entries(fallback)) {
    if (!(pageKey in merged)) {
      merged[pageKey] = normalizeForStorage(value) as SiteContentSection;
    }
  }

  return merged;
}

export async function getSitePageContent(locale: Locale, pageKey: string) {
  const translatedSections = await getSiteTranslations(locale);
  return (translatedSections[pageKey] ?? {}) as SiteContentSection;
}

export async function upsertSitePageContent(pageKey: string, language: Locale, content: unknown) {
  const fallbackValue = {
    pageKey,
    language,
    content: normalizeForStorage(content) as Record<string, unknown>,
  };

  return runWithFallback(async () => {
    await ensureSiteContentSeeded();

    return prisma.sitePageContent.upsert({
      where: {
        pageKey_language: {
          pageKey,
          language,
        },
      },
      update: {
        content: normalizeForStorage(content) as Record<string, unknown>,
        title: getPageLabel(pageKey),
      },
      create: {
        pageKey,
        language,
        title: getPageLabel(pageKey),
        content: normalizeForStorage(content) as Record<string, unknown>,
      },
    });
  }, fallbackValue);
}

export async function getSiteContentAdminPayload() {
  const fallback = Object.keys(getFallbackLocaleContent('fa')).map((pageKey) => ({
    pageKey,
    title: getPageLabel(pageKey),
    contentByLanguage: {
      fa: normalizeForStorage(getFallbackLocaleContent('fa')[pageKey]) ?? {},
      en: normalizeForStorage(getFallbackLocaleContent('en')[pageKey]) ?? {},
    },
  }));

  const records = await runWithFallback(async () => {
    await ensureSiteContentSeeded();

    return prisma.sitePageContent.findMany({
      orderBy: [{ pageKey: 'asc' }, { language: 'asc' }],
    });
  }, []);

  const grouped = records.reduce<Record<string, Record<string, unknown>>>((acc, record) => {
    if (!acc[record.pageKey]) {
      acc[record.pageKey] = {};
    }
    acc[record.pageKey][record.language] = record.content as Record<string, unknown>;
    return acc;
  }, {});

  return fallback.map((page) => ({
    ...page,
    contentByLanguage: {
      fa: grouped[page.pageKey]?.fa ?? page.contentByLanguage.fa ?? {},
      en: grouped[page.pageKey]?.en ?? page.contentByLanguage.en ?? {},
    },
  }));
}
