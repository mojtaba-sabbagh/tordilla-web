// app/about/page.tsx
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Leaf, Package } from "lucide-react";

export const metadata = {
  title: "درباره ترددیلا | چیپس ذرت ترددیلا",
  description:
    "آشنایی با ترددیلا، محصولات، نام تجاری و شرکت کوثر کویر رفسنجان - تولید کننده چیپس ذرت با کیفیت",
};

export default function AboutPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#8f1d1d] mb-4">
              درباره ترددیلا
            </h1>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              آشنایی با برند ترددیلا، محصولات با کیفیت و شرکت کوثر کویر رفسنجان
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#8f1d1d] transition">
            چیپس ذرت ترددیلا
          </Link>{" "}
          &gt; <span className="text-[#8f1d1d]">درباره ترددیلا</span>
        </div>
      </div>

      {/* Hero Image Section - Fixed */}
      <section className="container mx-auto px-4 md:px-6 py-0">
        <div className="flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-30">
            <Image
              src="/home/logo.png"
              alt="لوگوی ترددیلا"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 256px, 320px"
              priority
            />
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8f1d1d] mb-6 text-center md:text-right border-r-4 border-[#8f1d1d] pr-4">
              محصولات ترددیلا
            </h2>
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-4">
              <p>
                برگه ذرت ترتیلا، میان‌وعده‌ا‌ی سالم، تهیه شده از دانه ذرت، آب، روغن، نمک و ادویه‌های مختلف است. 
                این محصول اولین بار در کشور مکزیک تهیه شده است و به واسطه طعم متفاوت، شکل منحصر به فرد سه‌گوش، 
                کاربرد زیاد در غذاهای مختلف و جذب کمتر روغن نسبت به سایر چیپس‌ها، جایگاه خاصی در فرهنگ غذایی 
                کشورهای مختلف، خصوصا کشورهای آمریکای لاتین و ایالات متحده دارد.
              </p>
              <p>
                ترتیلا به تنهایی، با انواع سس یا به عنوان جزئی از غذاهای مختلف سرو می‌شود. ترتیلا در ایران با نام 
                <span className="font-bold text-[#8f1d1d]"> ترددیلا </span> 
                شناخته می‌شود.
              </p>
              <p>
                تلاشمان در تولید محصولات ترددیلا این بوده‌ است که کیفیت و سلامت محصولمان را با تهیه بهترین مواد اولیه 
                و ادویه‌ها، کنترل کیفیت تولید در تمام مراحل و بسته‌بندی محصول با کیفیت بالا تضمین کنیم. 
                «ترددیلا» با یکی از بهترین انواع ذرت ایرانی تهیه می‌شود.
              </p>
              <p>
                تنوع طعم‌ها یکی از خواسته‌های مهم مصرف‌کنندگان است و به همین جهت، ترددیلا با بهترین ادویه‌های وارداتی 
                از کشور هلند، در هشت طعم مختلف تولید و به بازار عرضه می‌شود. در تولید ترددیلا از هیچ‌گونه مواد نگهدارنده 
                استفاده نمی شود و بسته‌بندی سه لایه و غیرقابل نفوذ، ضامن تازگی و سلامت آن است.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-[#f6f1ec] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">مواد اولیه مرغوب</h3>
              <p className="text-sm text-neutral-600">تهیه شده از بهترین ذرت ایرانی</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">بسته‌بندی سه لایه</h3>
              <p className="text-sm text-neutral-600">ضامن تازگی و سلامت محصول</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">بدون مواد نگهدارنده</h3>
              <p className="text-sm text-neutral-600">محصولی سالم و طبیعی</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">هشت طعم متنوع</h3>
              <p className="text-sm text-neutral-600">مناسب برای همه سلیقه‌ها</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8f1d1d] mb-6 text-center md:text-right border-r-4 border-[#8f1d1d] pr-4">
              نام تجاری ترددیلا
            </h2>
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
              <p>
                باعث افتخارمان است که از سال ۱۳۷۲ تا کنون با تولید انواع میان‌وعده، چیپس و پاپ‌کرن با نام تجاری 
                ترددیلا توانسته‌ایم در کنار هواداران‌مان باشیم. زمانی با شعار 
                <span className="font-bold text-[#8f1d1d]"> «رنگین‌کمان مزه‌ها» </span> 
                اقدام به معرفی هشت طعم مختلف برای سلیقه‌های گوناگون کردیم و اکنون با شعار 
                <span className="font-bold text-[#8f1d1d]"> «مزه‌ی دورهمی‌های بامزه» </span> 
                با بسته‌بندی جدید و طعم‌های با کیفیت‌تر از قبل در کنار شما هستیم.
              </p>
              <p className="mt-4">
                امیدواریم که بتوانیم در سال‌های پیش‌رو، با ورود به بازارهای منطقه‌ای، نقشی در افزایش صادرات کشور 
                بر عهده بگیریم و توانمان را در رقابت با برندهای بین‌المللی اثبات کنیم.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Company Section */}
      <section className="bg-[#f6f1ec] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8f1d1d] mb-6 text-center md:text-right border-r-4 border-[#8f1d1d] pr-4">
              درباره شرکت
            </h2>
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-4">
              <p>
                شرکت کوثر کویر رفسنجان واقع شده در شهر طلای سبز، واحد نمونه صنعتی در استان کرمان می‌باشد. 
                این شرکت به فعالیت‌های متعددی از جمله تولید و بسته‌بندی چیپس و اسنک، فرآوری و بسته‌بندی انواع 
                خشکبار خصوصا پسته، واردات و صادرات محصولات خود به سایر شرکت‌های همکار، می‌پردازد.
              </p>
              <p>
                شرکت کوثر کویر رفسنجان، دفتر مرکزی خود را در تهران از سال ۱۳۸۷ راه‌اندازی نمود، کلیه امور بازرگانی 
                و فروش از جمله فروش مویرگی در تهران، مدیریت فروش شهرستان‌ها، صادرات محصولات با برند تجاری ترددیلا 
                و واردات و صادرات انواع خشکبار، ذرت و سایر اقلام مورد نیاز شرکت را بر عهده دارد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3 max-w-3xl mx-auto text-center">
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#8f1d1d]">۱۳۷۲</div>
              <p className="text-neutral-600 mt-2">سال تاسیس</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#8f1d1d]">۸</div>
              <p className="text-neutral-600 mt-2">طعم متنوع</p>
            </div>
            <div>
              <div className="text-3xl md:text-4xl font-black text-[#8f1d1d]">۱۰۰%</div>
              <p className="text-neutral-600 mt-2">طبیعی و سالم</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8f1d1d] py-12 md:py-16 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">با ترددیلا همراه شوید</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            برای اطلاع از محصولات جدید و طعم‌های متنوع، ما را در شبکه‌های اجتماعی دنبال کنید
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white text-[#8f1d1d] px-6 py-3 font-bold transition hover:bg-gray-100"
            >
              تماس با ما
            </Link>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border-2 border-white px-6 py-3 font-bold transition hover:bg-white hover:text-[#8f1d1d]"
            >
              اینستاگرام ترددیلا
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}