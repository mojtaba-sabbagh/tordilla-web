/**
 * Adds the product-catalog gallery labels used by the agency page to SitePageContent.
 *
 * getSiteTranslations() replaces a whole pageKey with the row stored in the
 * database, so new keys added to lib/i18n.ts stay invisible until they also
 * exist in the DB. This script adds only the missing keys and never overwrites
 * a value that is already stored, so admin-panel edits survive. Safe to re-run.
 *
 *   node scripts/add-agency-catalog-labels.js
 */
const fs = require('fs');
const path = require('path');

// minimal .env loader - plain node does not get Next's env handling
for (const line of fs.readFileSync(path.join(__dirname, '..', '.env'), 'utf8').split(/\r?\n/)) {
  const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
  if (match && !process.env[match[1]]) {
    process.env[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
}

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const NEW_LABELS = {
  fa: {
    catalogTitle: 'کاتالوگ محصولات',
    catalogIntro: 'مشخصات بسته‌بندی، وزن، ابعاد کارتن و بارکد تمام طعم‌های ترددیلا برای همکاری عمده',
    catalogCloseAria: 'بستن',
    catalogPrevAria: 'تصویر قبلی',
    catalogNextAria: 'تصویر بعدی',
  },
  en: {
    catalogTitle: 'Product Catalog',
    catalogIntro: 'Pack weights, carton dimensions, and barcodes for every Tordilla flavor, for wholesale partners',
    catalogCloseAria: 'Close',
    catalogPrevAria: 'Previous image',
    catalogNextAria: 'Next image',
  },
};

async function main() {
  for (const [language, labels] of Object.entries(NEW_LABELS)) {
    const row = await prisma.sitePageContent.findUnique({
      where: { pageKey_language: { pageKey: 'agency', language } },
    });

    if (!row) {
      console.log(`[${language}] no agency row yet - it will be seeded from lib/i18n.ts on first request`);
      continue;
    }

    const content = { ...row.content };
    const added = Object.keys(labels).filter((key) => !(key in content));

    if (added.length === 0) {
      console.log(`[${language}] already up to date`);
      continue;
    }

    for (const key of added) {
      content[key] = labels[key];
    }

    await prisma.sitePageContent.update({
      where: { pageKey_language: { pageKey: 'agency', language } },
      data: { content },
    });

    console.log(`[${language}] added: ${added.join(', ')}`);
  }
}

main()
  .catch((error) => {
    console.error('Failed to add agency catalog labels:', error.message);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
