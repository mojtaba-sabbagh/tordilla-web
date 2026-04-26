// scripts/migrate-blogs.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Blog data directly in the script
const blogPosts = [
  {
    slug: "tordilla-in-digikala",
    title: "ترددیلا در دیجیکالا",
    category: "بدانیم",
    categorySlug: "badanim",
    date: "2018-10-11",
    image: "/home/blog/digikala-logo-1200x480-760x180.jpg",
    imageWidth: 760,
    imageHeight: 180,
    excerpt: "چیپس ذرت ترددیلا با طعم‌های متنوع و کیفیت عالی، حالا در دیجیکالا قابل خریداری است...",
    content: `
      <p>ترددیلا، برند محبوب چیپس ذرت، حالا در فروشگاه اینترنتی دیجیکالا نیز عرضه می‌شود.</p>
      <p>شما می‌توانید با مراجعه به دیجیکالا، تمام طعم‌های ترددیلا را مشاهده و خریداری کنید.</p>
      <h2>طعم‌های موجود در دیجیکالا</h2>
      <ul>
        <li>ترددیلا ماست موسیر</li>
        <li>ترددیلا پنیری</li>
        <li>ترددیلا تنوری</li>
        <li>ترددیلا سالسا</li>
        <li>ترددیلا مکزیکی</li>
      </ul>
      <p>برای خرید به <a href="https://digikala.com">دیجیکالا</a> مراجعه کنید.</p>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
  {
    slug: "cinema-nacho",
    title: "ناچو ترددیلا در سینماهای سراسر کشور عرضه خواهد شد.",
    category: "بدانیم",
    categorySlug: "badanim",
    date: "2018-08-26",
    image: "/home/blog/b4fd571f4b9de34a1599ffdd904f3295-380x180.jpg",
    imageWidth: 380,
    imageHeight: 180,
    excerpt: "خبر خوب برای علاقه‌مندان به سینما! ناچو ترددیلا به زودی در سینماهای سراسر کشور عرضه می‌شود...",
    content: `
      <p>ترددیلا با همکاری بزرگترین پردیس‌های سینمایی، ناچوهای خوشمزه خود را به سینماها می‌آورد.</p>
      <p>از این پس می‌توانید هنگام تماشای فیلم، از طعم بی‌نظیر ناچو ترددیلا لذت ببرید.</p>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
  {
    slug: "mexican-taco",
    title: "طرز تهیه تاکو مکزیکی (مرحله به مرحله با عکس)",
    category: "طرز تهیه غذا",
    categorySlug: "recipe-food",
    date: "2018-08-13",
    image: "/home/blog/1520956952-chicken-tacos-horizontal-380x180.jpg",
    imageWidth: 380,
    imageHeight: 180,
    excerpt: "تاکو یکی از معروف‌ترین غذاهای مکزیکی است که با ترددیلا می‌توانید آن را در خانه تهیه کنید...",
    content: `
      <h2>مواد لازم برای تاکو مکزیکی:</h2>
      <ul>
        <li>چیپس ترددیلا: ۲ بسته</li>
        <li>گوشت چرخ کرده: ۵۰۰ گرم</li>
        <li>پیاز: ۱ عدد بزرگ</li>
        <li>گوجه فرنگی: ۳ عدد</li>
        <li>کاهو: به میزان لازم</li>
        <li>پنیر چدار: ۲۰۰ گرم</li>
        <li>سس سالسا: به میزان لازم</li>
      </ul>
      <h2>طرز تهیه:</h2>
      <p>ابتدا گوشت را با پیاز تفت دهید. سپس ترددیلاها را در ظرف بچینید و مواد را روی آن بریزید. در پایان با پنیر و سس سالسا تزیین کنید.</p>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
  {
    slug: "tortilla-bread",
    title: "بهترین دستور تهیه نان ترتیلا مرحله به مرحله",
    category: "طرز تهیه غذا",
    categorySlug: "recipe-food",
    date: "2018-08-13",
    image: "/home/blog/lionel-gustave-171881-unsplash-380x180.jpg",
    imageWidth: 380,
    imageHeight: 180,
    excerpt: "نان ترتیلا یکی از اصلی‌ترین اجزای غذاهای مکزیکی است. در این مقاله طرز تهیه آن را یاد می‌گیرید...",
    content: `
      <p>نان ترتیلا یک نان سنتی مکزیکی است که از آرد ذرت یا گندم تهیه می‌شود.</p>
      <h2>مواد لازم:</h2>
      <ul>
        <li>آرد ذرت: ۲ پیمانه</li>
        <li>آب گرم: ۱ پیمانه</li>
        <li>نمک: نصف قاشق چایخوری</li>
        <li>روغن: ۲ قاشق غذاخوری</li>
      </ul>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
  {
    slug: "salsa-recipes",
    title: "طرز تهیه سالسا با طعم‌های متفاوت",
    category: "طرز تهیه دیپ",
    categorySlug: "recipe-dip",
    date: "2018-08-13",
    image: "/home/blog/OG0A1062-380x180.jpg",
    imageWidth: 380,
    imageHeight: 180,
    excerpt: "سالسا همراه همیشگی ترددیلا! با ۴ طعم متفاوت سالسا آشنا شوید...",
    content: `
      <p>طرز تهیه سالسا، با ۴ طعم مختلف! به جز دستور کلاسیک سالسا، رسپی‌های مختلف دیگری برای تهیه آن وجود دارد.</p>
      
      <h2>طرز تهیه سالسا آناناس به همراه کیوی:</h2>
      <p><strong>مواد لازم:</strong></p>
      <ul>
        <li>کمپوت آناناس: ۲ عدد</li>
        <li>کیوی: ۲ عدد تکه شده</li>
        <li>جعفری خرد شده: ۱ سوم پیمانه</li>
        <li>آبلیمو تازه: ۲ قاشق چایخوری</li>
        <li>فلفل هالوپینو: ۱ قاشق چایخوری (خرد شده)</li>
      </ul>
      <p><strong>چه کار کنیم:</strong> همه مواد را باهم ترکیب کنید و برای مزه بیشتر کمی نمک به آن اضافه کنید.</p>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
  {
    slug: "healthy-snack-for-kids",
    title: "چگونه یک میان وعده سالم برای کودکان انتخاب کنیم؟",
    category: "سالم بخوریم",
    categorySlug: "healthy-eating",
    date: "2018-08-13",
    image: "/home/blog/282864-P61N2F-139-276x235.jpg",
    imageWidth: 276,
    imageHeight: 235,
    excerpt: "انتخاب میان وعده مناسب برای کودکان اهمیت زیادی دارد. ترددیلا یک انتخاب سالم و خوشمزه است...",
    content: `
      <p>میان وعده‌های سالم نقش مهمی در رشد و تکامل کودکان دارند.</p>
      <p>ترددیلا با استفاده از ذرت تازه و بدون مواد نگهدارنده، یک گزینه عالی برای میان وعده کودکان است.</p>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
  {
    slug: "what-is-tortilla",
    title: "نان ترتیلا چیست؟",
    category: "بدانیم",
    categorySlug: "badanim",
    date: "2018-08-13",
    image: "/home/blog/Flatbread-17-276x235.jpg",
    imageWidth: 276,
    imageHeight: 235,
    excerpt: "نان ترتیلا یک نان سنتی مکزیکی است که در غذاهای مختلفی استفاده می‌شود...",
    content: `
      <p>نان ترتیلا (Tortilla) یک نان نازک و گرد است که از آرد ذرت یا گندم تهیه می‌شود.</p>
      <p>این نان ریشه در فرهنگ مکزیک دارد و در غذاهایی مانند تاکو، بوریتو و انچیلادا استفاده می‌شود.</p>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
  {
    slug: "cheesy-dip",
    title: "طرز تهیه دیپ پنیر تند و آتشین",
    category: "طرز تهیه دیپ",
    categorySlug: "recipe-dip",
    date: "2018-08-13",
    image: "/home/blog/HotCheesyBaconDip-276x235.jpg",
    imageWidth: 276,
    imageHeight: 235,
    excerpt: "دیپ پنیر تند، یک همراه عالی برای چیپس ترددیلا...",
    content: `
      <p>دیپ پنیر تند یکی از محبوب‌ترین دیپ‌ها برای همراهی با ناچو است.</p>
      <h2>مواد لازم:</h2>
      <ul>
        <li>پنیر چدار: ۲۰۰ گرم</li>
        <li>خامه: ۱۰۰ میلی‌لیتر</li>
        <li>فلفل تند: ۲ عدد</li>
        <li>سیر: ۲ حبه</li>
      </ul>
    `,
    author: "Hamidreza Vosoughi",
    published: true,
  },
];

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
          imageWidth: post.imageWidth,
          imageHeight: post.imageHeight,
          excerpt: post.excerpt,
          content: post.content,
          author: post.author,
          published: post.published,
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