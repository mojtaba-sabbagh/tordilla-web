// lib/seed-content.ts
import { CinemaPartner, Post, Product } from "@/lib/types";

export const siteMeta = {
  name: "ترددیلا",
  title: "ترددیلا | چیپس ذرت در طعم‌های متنوع",
  description:
    "نسخه Next.js وب‌سایت ترددیلا برای معرفی طعم‌های مختلف چیپس ذرت، بلاگ و شبکه فروش.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://tordillafood.com",
};

export const heroHighlights = [
  "چیپس ذرت تهیه‌شده از ذرت تازه",
  "طعم‌های متنوع برای هر سلیقه",
  "آماده توسعه برای فروش آنلاین و محتوای کامل برند",
];

// Bilingual product data
export const products: Product[] = [
  {
    slug: "mast-o-musir",
    title: { fa: "ترددیلا ماست موسیر", en: "Tordilla Yogurt & Shallot" },
    image: "/home/flavors/mast1.jpg",
    shortDescription: {
      fa: "چیپس ترددیلا با طعم ماست موسیر: ترکیبی نوستالژیک و هیجان‌انگیز.",
      en: "Tordilla chips with yogurt and shallot flavor: A nostalgic and exciting combination."
    },
    description: {
      fa: "طعم آشنا و دلنشین ماست و موسیر را حالا در قالب تردترین چیپس ترتیلا تجربه کنید! ما با دقت، طعم بی‌نظیر و عطر خاص ماست و موسیر را با کیفیت‌ترین چیپس‌های ترتیلا ذرت آمیخته‌ایم تا یک میان‌وعده خاص و خاطره‌انگیز برای شما خلق کنیم.",
      en: "Experience the familiar and delightful taste of yogurt and shallot in the crunchiest tortilla chips! We have carefully blended the unique flavor and special aroma of yogurt and shallot with the highest quality corn tortilla chips to create a special and memorable snack for you."
    },
    features: {
      fa: ["طعم ملایم و خوش‌عطر ماست و موسیر", "بافت ترد و سبک", "مناسب میان‌وعده، مهمانی و سرو کنار دیپ"],
      en: ["Mild and aromatic yogurt & shallot flavor", "Crunchy and light texture", "Perfect for snacks, parties, and serving with dips"]
    },
    packaging: { fa: "بسته آماده مصرف خرده‌فروشی", en: "Retail ready-to-eat package" },
    audience: { fa: "مصرف خانگی، فروشگاه‌ها و طرفداران طعم‌های کلاسیک", en: "Home consumption, stores, and classic flavor lovers" },
    nutrition: {
      serving: { fa: "۳۰ گرم", en: "30g" },
      energy: { fa: "۱۴۹.۵ کیلوکالری", en: "149.5 kcal" },
      sugar: { fa: "۰.۶۳ گرم", en: "0.63g" },
      fat: { fa: "۷.۷۷ گرم", en: "7.77g" },
      salt: { fa: "۰.۵۶ گرم", en: "0.56g" },
      transFat: { fa: "۰ گرم", en: "0g" },
    },
  },
  {
    slug: "paniri",
    title: { fa: "ترددیلا پنیری", en: "Tordilla Cheese" },
    image: "/home/flavors/chees1.jpg",
    shortDescription: {
      fa: "چیپس ترددیلا طعم پنیری: لذت دلچسب پنیر در ترددیلا.",
      en: "Tordilla cheese flavor chips: The delightful taste of cheese in Tordilla."
    },
    description: {
      fa: "خودتان را برای تجربه‌ی یک طعم پنیری غنی و دلچسب آماده کنید! چیپس ترتیلا با طعم پنیری، ترکیبی جذاب از تردی بی‌نظیر چیپس ترتیلا و مزه‌ی لذیذ پنیر است که هر ذائقه‌ای را به وجد می‌آورد.",
      en: "Get ready for a rich and delightful cheese flavor experience! Cheese-flavored tortilla chips offer an irresistible combination of the unique crunch of tortilla chips and the delicious taste of cheese that excites every palate."
    },
    features: {
      fa: ["طعم پنیری محبوب و همه‌پسند", "مناسب مصرف مستقیم یا همراه با سس", "انتخابی مناسب برای دورهمی و میان‌وعده"],
      en: ["Popular and crowd-pleasing cheese flavor", "Great on its own or with sauces", "Perfect for gatherings and snacks"]
    },
    packaging: { fa: "بسته آماده مصرف خرده‌فروشی", en: "Retail ready-to-eat package" },
    audience: { fa: "مصرف‌کنندگان عمومی و علاقه‌مندان طعم پنیری", en: "General consumers and cheese flavor lovers" },
    nutrition: {
      serving: { fa: "۳۰ گرم", en: "30g" },
      energy: { fa: "۱۴۹.۴ کیلوکالری", en: "149.4 kcal" },
      sugar: { fa: "۰.۶۵ گرم", en: "0.65g" },
      fat: { fa: "۷.۷۶ گرم", en: "7.76g" },
      salt: { fa: "۰.۵۵ گرم", en: "0.55g" },
      transFat: { fa: "۰ گرم", en: "0g" },
    },
  },
  {
    slug: "tanouri",
    title: { fa: "ترددیلا تنوری", en: "Tordilla Oven-Baked" },
    image: "/home/flavors/barbiq1.jpg",
    shortDescription: {
      fa: "چیپس ذرت با طعم تنوری، الهام‌گرفته از مزه‌های دودی و برشته.",
      en: "Corn chips with oven-baked flavor, inspired by smoky and roasted tastes."
    },
    description: {
      fa: "چیپس ترددیلا با طعم باربیکیو یک نمک‌گیری خوشمزه و پرطرفدار است که طعم دود را با مزه ترد و خوش‌طعم ترتیلا ترکیب می‌کند. این چیپس اغلب برای کسانی که عاشق طعم‌های دودی و باربیکیو هستند، گزینه‌ای مناسب است و مناسب برای مهمانی‌ها، پیک نیک یا لذت بردن در زمانی استراحت است.",
      en: "Tordilla chips with barbecue flavor offer a delicious and popular seasoning that combines smoky taste with the crunchy, flavorful tortilla. These chips are ideal for those who love smoky and barbecue flavors, perfect for parties, picnics, or enjoying during leisure time."
    },
    features: {
      fa: ["طعم برشته و تنوری", "رایحه متفاوت و جذاب", "مناسب پذیرایی و مصرف روزانه"],
      en: ["Roasted and oven-baked flavor", "Distinct and appealing aroma", "Great for entertaining and daily snacking"]
    },
    packaging: { fa: "بسته آماده مصرف خرده‌فروشی", en: "Retail ready-to-eat package" },
    audience: { fa: "علاقه‌مندان مزه‌های برشته و طعم‌های خاص", en: "Lovers of roasted flavors and unique tastes" },
    nutrition: {
      serving: { fa: "۳۰ گرم", en: "30g" },
      energy: { fa: "۱۴۹.۴ کیلوکالری", en: "149.4 kcal" },
      sugar: { fa: "۰.۶۵ گرم", en: "0.65g" },
      fat: { fa: "۷.۷۶ گرم", en: "7.76g" },
      salt: { fa: "۰.۵۵ گرم", en: "0.55g" },
      transFat: { fa: "۰ گرم", en: "0g" },
    },
  },
  {
    slug: "salsa",
    title: { fa: "ترددیلا سالسا", en: "Tordilla Salsa" },
    image: "/home/flavors/salsa1.jpg",
    shortDescription: {
      fa: "چیپس ذرت با طعم سالسا، ترکیبی از مزه تند و گوجه‌ای برای دوستداران طعم‌های هیجانی.",
      en: "Salsa-flavored corn chips, a blend of spicy and tomatoey taste for adventurous flavor lovers."
    },
    description: {
      fa: "چیپس ترددیلا با طعم سالسا، ترکیبی هیجان‌انگیز از طعم‌های ترش و شیرین گوجه‌فرنگی، تندی ملایم فلفل، و طراوت لیمو را با بافت ترد و دلپذیر چیپس ترتیلا آمیخته است. این چیپس برای کسانی که به دنبال طعمی تازه، کمی تند و پر از ادویه هستند، گزینه‌ای ایده‌آل است و می‌تواند همراه خوبی برای دورهمی‌ها و لحظات لذت‌بخش باشد.",
      en: "Tordilla salsa-flavored chips blend the exciting combination of sweet and sour tomato, mild pepper spiciness, and fresh lemon with the crunchy, pleasant texture of tortilla chips. These chips are ideal for those seeking a fresh, slightly spicy, and flavorful taste, making them a great companion for gatherings and enjoyable moments."
    },
    features: {
      fa: ["طعم سالسا با حس تندی و شادابی", "مناسب سرو کنار انواع دیپ", "انتخابی جذاب برای مهمانی و دورهمی"],
      en: ["Salsa flavor with a spicy and fresh kick", "Great for serving with various dips", "An attractive choice for parties and gatherings"]
    },
    packaging: { fa: "بسته آماده مصرف خرده‌فروشی", en: "Retail ready-to-eat package" },
    audience: { fa: "طرفداران طعم‌های تند و الهام‌گرفته از مزه‌های مکزیکی", en: "Fans of spicy flavors inspired by Mexican tastes" },
    nutrition: {
      serving: { fa: "۳۰ گرم", en: "30g" },
      energy: { fa: "۱۴۹.۵ کیلوکالری", en: "149.5 kcal" },
      sugar: { fa: "۰.۶۴ گرم", en: "0.64g" },
      fat: { fa: "۷.۷۷ گرم", en: "7.77g" },
      salt: { fa: "۰.۵۶ گرم", en: "0.56g" },
      transFat: { fa: "۰ گرم", en: "0g" },
    },
  },
  {
    slug: "mexican",
    title: { fa: "ترددیلا مکزیکی", en: "Tordilla Mexican" },
    image: "/home/flavors/mexican1.jpg",
    shortDescription: {
      fa: "چیپس ترددیلا طعم مکزیکی: هیجان تند و ترشِ سرزمین خوراکی‌ها.",
      en: "Tordilla Mexican flavor chips: The spicy and tangy excitement of the land of flavors."
    },
    description: {
      fa: "اگر عاشق طعم‌های پرانرژی، ادویه‌دار و متفاوت هستید، چیپس ترتیلا طعم مکزیکی دقیقا همان چیزی است که دنبالش می‌گردید! ترکیبی از ادویه‌های مخصوص مکزیکی، عطر دلپذیر فلفل و سبزی اورگانو، تردی فوق‌العاده ترتیلا، تجربه‌ای هیجان‌انگیز و جسورانه برای ذائقه شما می‌سازد.",
      en: "If you love energetic, spiced, and distinctive flavors, Mexican-flavored tortilla chips are exactly what you're looking for! A blend of special Mexican spices, the pleasant aroma of pepper and oregano, and the exceptional crunch of tortilla create an exciting and bold experience for your palate."
    },
    features: {
      fa: ["طعم ادویه‌ای و جسورانه", "بافت ترد و مناسب سرو مستقیم", "هماهنگ با ذائقه طرفداران طعم‌های پررنگ"],
      en: ["Spiced and bold flavor", "Crunchy texture great for eating on its own", "Perfect for fans of strong, distinctive flavors"]
    },
    packaging: { fa: "بسته آماده مصرف خرده‌فروشی", en: "Retail ready-to-eat package" },
    audience: { fa: "جوانان و علاقه‌مندان طعم‌های تند و ادویه‌ای", en: "Young people and fans of spicy, seasoned flavors" },
    nutrition: {
      serving: { fa: "۳۰ گرم", en: "30g" },
      energy: { fa: "۱۴۹.۴ کیلوکالری", en: "149.4 kcal" },
      sugar: { fa: "۰.۶۳ گرم", en: "0.63g" },
      fat: { fa: "۷.۷۶ گرم", en: "7.76g" },
      salt: { fa: "۰.۵۵ گرم", en: "0.55g" },
      transFat: { fa: "۰ گرم", en: "0g" },
    },
  },
  {
    slug: "piaz-jafari",
    title: { fa: "ترددیلا پیاز جعفری", en: "Tordilla Onion & Parsley" },
    image: "/home/flavors/piaz1.jpg",
    shortDescription: {
      fa: "چیپس ترددیلا با طعم پیاز و جعفری: طراوت سبز در کنار تردی لذت‌بخش",
      en: "Tordilla chips with onion and parsley flavor: Green freshness alongside delightful crunch"
    },
    description: {
      fa: "ترکیبی از عطر خوش پیاز تازه و طعم دل‌انگیز جعفری، در قالب تردترین چیپس‌های ترددیلا ذرت! این محصول خاص، انتخابی عالی برای کسانی است که به طعم‌های طبیعی و خوش‌عطر علاقه دارند",
      en: "A blend of fresh onion aroma and delightful parsley flavor, in the crunchiest Tordilla corn chips! This special product is an excellent choice for those who enjoy natural, aromatic flavors."
    },
    features: {
      fa: ["عطر خوش پیاز تازه و طعم دل‌انگیز جعفری", "طعم متعادل و ساده", "مناسب مصرف روزانه و پذیرایی سبک"],
      en: ["Fresh onion aroma and delightful parsley flavor", "Balanced and simple taste", "Great for daily snacking and light entertaining"]
    },
    packaging: { fa: "بسته آماده مصرف خرده‌فروشی", en: "Retail ready-to-eat package" },
    audience: { fa: "مصرف‌کنندگان علاقه‌مند به مزه‌های ساده‌تر و متعادل‌تر", en: "Consumers who prefer simpler, more balanced flavors" },
    nutrition: {
      serving: { fa: "۳۰ گرم", en: "30g" },
      energy: { fa: "۱۴۹.۳ کیلوکالری", en: "149.3 kcal" },
      sugar: { fa: "۰.۶۱ گرم", en: "0.61g" },
      fat: { fa: "۷.۷۵ گرم", en: "7.75g" },
      salt: { fa: "۰.۳۷ گرم", en: "0.37g" },
      transFat: { fa: "۰ گرم", en: "0g" },
    },
  },
  {
    slug: "sesame",
    title: { fa: "ترددیلا کنجدی", en: "Tordilla Sesame" },
    image: "/home/flavors/seseami.jpg",
    shortDescription: {
      fa: "چیپس ترتیلا طعم پنیری با کنجد: ترکیبی لطیف از تردی، پنیر و رایحه‌ی خاص کنجد.",
      en: "Cheese-flavored tortilla chips with sesame: A delicate blend of crunch, cheese, and the distinctive aroma of sesame."
    },
    description: {
      fa: "تجربه‌ای نوآورانه و خوش‌طعم برای عاشقان چیپس‌های خاص! چیپس ترتیلا پنیری با کنجد، تلفیقی از مزه‌ی غنی پنیر و عطر مطبوع کنجد است که در هر لقمه، شما را با طعمی گرم و دل‌نشین غافلگیر می‌کند.",
      en: "An innovative and delicious experience for lovers of unique chips! Cheese-flavored tortilla chips with sesame combine the rich taste of cheese with the pleasant aroma of sesame, surprising you with a warm and delightful flavor in every bite."
    },
    features: {
      fa: ["عطر و طعم متمایز کنجد", "بافت ترد با مزه‌ای متفاوت", "مناسب برای میان‌وعده و پذیرایی"],
      en: ["Distinct sesame aroma and taste", "Crunchy texture with a unique flavor", "Perfect for snacking and entertaining"]
    },
    packaging: { fa: "بسته آماده مصرف خرده‌فروشی", en: "Retail ready-to-eat package" },
    audience: { fa: "علاقه‌مندان طعم‌های معطر و متفاوت", en: "Fans of aromatic and distinctive flavors" },
    nutrition: {
      serving: { fa: "۳۰ گرم", en: "30g" },
      energy: { fa: "۱۴۹.۶ کیلوکالری", en: "149.6 kcal" },
      sugar: { fa: "۰.۶۴ گرم", en: "0.64g" },
      fat: { fa: "۷.۷۸ گرم", en: "7.78g" },
      salt: { fa: "۰.۵۵ گرم", en: "0.55g" },
      transFat: { fa: "۰ گرم", en: "0g" },
    },
  },
];

// Helper function to get localized product field
export function getLocalizedProduct(product: Product, locale: string) {
  return {
    ...product,
    title: product.title[locale as keyof typeof product.title],
    shortDescription: product.shortDescription[locale as keyof typeof product.shortDescription],
    description: product.description[locale as keyof typeof product.description],
    features: product.features[locale as keyof typeof product.features],
    packaging: product.packaging[locale as keyof typeof product.packaging],
    audience: product.audience[locale as keyof typeof product.audience],
    nutrition: {
      serving: product.nutrition.serving[locale as keyof typeof product.nutrition.serving],
      energy: product.nutrition.energy[locale as keyof typeof product.nutrition.energy],
      sugar: product.nutrition.sugar[locale as keyof typeof product.nutrition.sugar],
      fat: product.nutrition.fat[locale as keyof typeof product.nutrition.fat],
      salt: product.nutrition.salt[locale as keyof typeof product.nutrition.salt],
      transFat: product.nutrition.transFat[locale as keyof typeof product.nutrition.transFat],
    },
  };
}

export const posts: Post[] = [
  {
    slug: "why-tortilla-works-for-fast-food",
    title: "چرا ترددیلا برای منوی فست‌فود انتخاب خوبی است؟",
    excerpt:
      "تورتیلا باعث می‌شود منوی شما سریع‌تر، قابل‌تنوع‌تر و مناسب بسته‌بندی باشد.",
    publishedAt: "2026-04-16",
    content:
      "<p>تورتیلا برای کسب‌وکارهایی مفید است که هم سرعت سرو و هم تنوع منو برایشان مهم است. با یک پایه ثابت می‌توان چندین آیتم مختلف تعریف کرد و فشار عملیاتی آشپزخانه را پایین آورد.</p><p>در مدل‌های فروش بیرون‌بر و دلیوری نیز این محصول عملکرد خوبی دارد، چون ظاهر و ساختار آن در مسیر حمل بهتر حفظ می‌شود.</p>",
  },
  {
    slug: "cinema-food-concepts",
    title: "ایده‌های منوی سینمایی با تورتیلا و تاکو",
    excerpt:
      "برای بوفه سینما باید آیتمی داشت که سریع، تمیز و قابل فهم برای مشتری باشد.",
    publishedAt: "2026-04-16",
    content:
      "<p>در فضای سینما و مراکز تفریحی، آیتم باید سریع سرو شود و خوردن آن برای مشتری ساده باشد. ترکیب تاکو و رپ این ویژگی را دارد و می‌تواند در قالب منوی دو یا سه‌گزینه‌ای ارائه شود.</p><p>اگر با نوشیدنی و قیمت‌گذاری مناسب همراه شود، ظرفیت خوبی برای کمپین‌های فروش دارد.</p>",
  },
];

export const cinemaPartners: CinemaPartner[] = [
  {
    city: "تهران",
    venue: "مجتمع سینمایی نمونه",
    note: "مدل پیشنهادی برای فروش ترکیبی بوفه و منوی مناسبتی",
  },
  {
    city: "کرج",
    venue: "فودکورت و مجموعه تفریحی",
    note: "مناسب ترافیک فروش بالا و سرو سریع",
  },
  {
    city: "اصفهان",
    venue: "سینما و کافه مجاور",
    note: "قابل توسعه به منوی مشترک میان کافه و بوفه",
  },
];

export const aboutCopy = {
  intro:
    "ترددیلا بر تولید و عرضه چیپس ذرت در طعم‌های متنوع تمرکز دارد. جهت‌گیری برند، ساخت میان‌وعده‌ای خوش‌مزه و باکیفیت است که بتواند برای سلیقه‌های مختلف انتخابی محبوب باشد.",
  points: [
    "تنوع طعم برای سلیقه‌های مختلف از ساده تا ادویه‌ای",
    "تمرکز بر کیفیت بافت، تردی و مزه ماندگار",
    "آمادگی برای توسعه سایت به فروش و معرفی کامل‌تر محصولات",
  ],
};

export const contactCards = [
  {
    title: "وب‌سایت اصلی",
    value: "tordillafood.com",
    href: "https://tordillafood.com",
  },
  {
    title: "دامنه جایگزین",
    value: "www.tordilla.ir",
    href: "https://www.tordilla.ir",
  },
  {
    title: "همکاری و ارتباط",
    value: "info@TordillaFood.com",
    href: "mailto:info@tordillafood.com",
  },
];