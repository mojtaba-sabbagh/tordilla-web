// scripts/migrate-blogs.js
const { PrismaClient } = require('@prisma/client');
const { blogPosts } = require('../lib/blog-data');

const prisma = new PrismaClient();

async function migrateBlogs() {
  console.log('Starting blog migration...');
  console.log(`Found ${blogPosts.length} blogs to migrate\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const post of blogPosts) {
    try {
      // Check if blog already exists
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
      });

      if (existing) {
        console.log(`⏭️  Skipping existing blog: ${post.title}`);
        continue;
      }

      // Create new blog post
      await prisma.blogPost.create({
        data: {
          slug: post.slug,
          title: post.title,
          category: post.category,
          categorySlug: post.categorySlug,
          date: new Date(post.date),
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
  console.log(`✅ Successfully migrated: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total blogs in database: ${await prisma.blogPost.count()}`);
}

migrateBlogs()
  .catch(console.error)
  .finally(() => prisma.$disconnect());