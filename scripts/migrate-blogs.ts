// scripts/migrate-blogs.js
const { PrismaClient } = require('@prisma/client');
const { blogPosts } = require('../lib/blog-data');

const prisma = new PrismaClient();

// Function to convert Persian date to JavaScript Date
function convertPersianDate(dateString) {
  // Map Persian month names to numbers (0-indexed for JavaScript)
  const monthMap = {
    // Gregorian months (used in your data)
    'ژانویه': 0,    // January
    'فوریه': 1,     // February
    'مارس': 2,      // March
    'آوریل': 3,     // April
    'مه': 4,        // May
    'ژوئن': 5,      // June
    'ژوئیه': 6,     // July
    'اوت': 7,       // August
    'آگوست': 7,     // August (alternative spelling)
    'سپتامبر': 8,   // September
    'اکتبر': 9,     // October
    'نوامبر': 10,   // November
    'دسامبر': 11,   // December
    
    // Persian calendar months (if needed in future)
    'فروردین': 0,
    'اردیبهشت': 1,
    'خرداد': 2,
    'تیر': 3,
    'مرداد': 4,
    'شهریور': 5,
    'مهر': 6,
    'آبان': 7,
    'آذر': 8,
    'دی': 9,
    'بهمن': 10,
    'اسفند': 11
  };
  
  // Check if it's already a valid date or English format
  const englishDate = new Date(dateString);
  if (!isNaN(englishDate.getTime())) {
    return englishDate;
  }
  
  // Handle Persian format: "13 آگوست 2018"
  const parts = dateString.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0]);
    const monthName = parts[1];
    const year = parseInt(parts[2]);
    const month = monthMap[monthName];
    
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  
  // Fallback to current date
  console.log(`⚠️ Could not parse date: ${dateString}, using today's date`);
  return new Date();
}

async function migrateBlogs() {
  console.log('Starting blog migration...');
  console.log(`Found ${blogPosts.length} blogs to migrate\n`);

  let successCount = 0;
  let errorCount = 0;
  let updatedCount = 0;

  for (const post of blogPosts) {
    try {
      const parsedDate = convertPersianDate(post.date);
      console.log(`📅 ${post.title}: ${post.date} -> ${parsedDate.toISOString().split('T')[0]}`);

      // Check if blog already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      });

      if (existing) {
        // Update existing blog with correct date
        await prisma.blogPost.update({
          where: { slug: post.slug },
          data: {
            date: parsedDate,
          },
        });
        console.log(`🔄 Updated date for: ${post.title}`);
        updatedCount++;
        continue;
      }

      // Create new blog post
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          category: post.category,
          categorySlug: post.categorySlug,
          date: parsedDate,
          image: post.image,
          imageWidth: post.imageWidth || 800,
          imageHeight: post.imageHeight || 600,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          published: post.published !== undefined ? post.published : true,
        },
      });

      console.log(`✅ Migrated: ${post.title}`);
      successCount++;
    } catch (error) {
      console.error(`❌ Error migrating ${post.title}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`✅ Newly migrated: ${successCount}`);
  console.log(`🔄 Updated dates: ${updatedCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total blogs in database: ${await prisma.blogPost.count()}`);
  
  // Show all blogs with their dates
  const allBlogs = await prisma.blogPost.findMany({
    select: { title: true, date: true },
    orderBy: { date: 'desc' },
  });
  console.log('\n=== Blogs in Database ===');
  allBlogs.forEach(blog => {
    console.log(`📝 ${blog.title}: ${blog.date.toISOString().split('T')[0]}`);
  });
}

migrateBlogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());