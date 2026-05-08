// app/about/page.tsx (no "use client" directive)
import Image from "next/image";
import Link from "next/link";
import { CheckCircle, Award, Leaf, Package, Sprout, ChevronLeft } from "lucide-react";

export const metadata = {
  title: "درباره ترددیلا | چیپس ذرت ترددیلا",
  description:
    "آشنایی با ترددیلا، محصولات، نام تجاری و شرکت کوثر کویر رفسنجان - تولید کننده چیپس ذرت با کیفیت",
};

export default function AboutPage() {
  return (
    <main className="bg-white" dir="rtl">
      {/* Hero Section with decorative wave */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] via-[#fef9f4] to-white py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-block mb-4">
              <div className="h-1 w-12 bg-[#8f1d1d] rounded-full mx-auto"></div>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#8f1d1d] mb-4">
              درباره ترددیلا
            </h1>
            <p className="text-base md:text-lg text-neutral-600 max-w-2xl mx-auto">
              آشنایی با برند ترددیلا، محصولات با کیفیت و شرکت کوثر کویر رفسنجان
            </p>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-12 text-white fill-current"
            viewBox="0 0 1200 120"
            preserveAspectRatio="none"
          >
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-6 py-4 border-b border-neutral-100">
        <div className="flex items-center gap-2 text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#8f1d1d] transition duration-200">
            چیپس ذرت ترددیلا
          </Link>
          <ChevronLeft className="w-4 h-4" />
          <span className="text-[#8f1d1d] font-medium">درباره ترددیلا</span>
        </div>
      </div>

      <section className="container mx-auto px-4 md:px-6 py-8 md:py-6">
        <div className="flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
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

      <section className="py-12 md:py-16 animate-fade-in">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-[#8f1d1d] rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#8f1d1d]">
                محصولات ترددیلا
              </h2>
            </div>
            <div className="text-sm md:text-sm font-bold text-[#8f1d1d] mb-4 pr-2">
              چیپس ترتیلا ذرت: تردی اصیل، طعمی دلنشین
            </div>
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed space-y-4">
              <p>
                لذت یک میان‌وعده بی‌نظیر را با چیپس ترتیلا ذرت تجربه کنید. این چیپس‌های ترد و خوش‌طعم، که از بهترین مواد اولیه و دانه‌های ذرت مرغوب تهیه شده‌اند، همراهی عالی برای لحظات شاد شما هستند. برش‌های مثلثی و فرآوری دقیق، تردی فوق‌العاده‌ای به این چیپس‌ها می‌بخشد که هر کسی را شیفته خود می‌کند. چیپس ترتیلا ذرت، چه به تنهایی و چه در کنار انواع دیپ، سس سالسا، گواکاموله یا پنیر، تجربه‌ای فراموش‌نشدنی خلق می‌کند.
              </p>
              <p>انتخاب ایده‌آل برای مهمانی‌ها، تماشای فیلم یا هر جمع دوستانه.</p>
              <p>با چیپس ترتیلا ذرت، لحظات خود را طعم‌دار کنید و شادی را به اشتراک بگذارید.</p>
              <p>
                محصول چیپس ترتیلا ما، نتیجه تلاش و تخصص تیمی مجرب و حرفه‌ای است. کیفیت بی‌نظیر این محصول توسط کارشناسان و متخصصان فنی ما تضمین می‌شود، تا شما همیشه بهترین و تازه‌ترین اسنک را تجربه کنید. با ما، لذت را در هر ترد و خوش‌طعم بودن چیپس ترتیلا احساس کنید.
              </p>
              <p>
                تنوع طعم‌ها یکی از خواسته‌های مهم مصرف‌کنندگان است و به همین جهت، ترددیلا با بهترین طعم دهنده های وارداتی از کشورهای سوئیس و اسپانیا، در هشت طعم مختلف تولید و به بازار عرضه می‌شود. در تولید ترددیلا از هیچ‌گونه مواد نگهدارنده استفاده نمی شود و بسته‌بندی سه لایه و غیرقابل نفوذ، ضامن تازگی و سلامت آن است.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1ec] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="text-center p-6 bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Leaf className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">مواد اولیه مرغوب</h3>
              <p className="text-sm text-neutral-600">تهیه شده از بهترین ذرت ایرانی</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">بسته‌بندی سه لایه</h3>
              <p className="text-sm text-neutral-600">ضامن تازگی و سلامت محصول</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">بدون مواد نگهدارنده</h3>
              <p className="text-sm text-neutral-600">محصولی سالم و طبیعی</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">هشت طعم متنوع</h3>
              <p className="text-sm text-neutral-600">مناسب برای همه سلیقه‌ها</p>
            </div>
            <div className="text-center p-6 bg-white rounded-2xl shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <div className="w-16 h-16 bg-[#8f1d1d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sprout className="w-8 h-8 text-[#8f1d1d]" />
              </div>
              <h3 className="font-bold text-lg mb-2">رنگ طبیعی</h3>
              <p className="text-sm text-neutral-600">آنتی‌اکسیدان طبیعی، سالم و لذت‌بخش</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16 animate-fade-in">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-[#8f1d1d] rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#8f1d1d]">
                نام تجاری ترددیلا
              </h2>
            </div>
            <div className="prose prose-lg max-w-none text-neutral-700 leading-relaxed">
              <p>
                باعث افتخارمان است که از سال ۱۳۷۲ تا کنون با تولید انواع میان‌وعده، چیپس و پاپ‌کرن با نام تجاری
                ترددیلا توانسته‌ایم در کنار هواداران‌مان باشیم. زمانی با شعار
                <span className="font-bold text-[#8f1d1d] mx-1">«رنگین‌کمان مزه‌ها»</span>
                اقدام به معرفی هشت طعم مختلف برای سلیقه‌های گوناگون کردیم و اکنون با شعار
                <span className="font-bold text-[#8f1d1d] mx-1">«مزه‌ی دورهمی‌های بامزه»</span>
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

      <section className="bg-[#f6f1ec] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-8 w-1 bg-[#8f1d1d] rounded-full"></div>
              <h2 className="text-2xl md:text-3xl font-bold text-[#8f1d1d]">
                درباره شرکت
              </h2>
            </div>
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

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-neutral-100">
              <div className="text-4xl md:text-5xl font-black text-[#8f1d1d]">۱۳۷۲</div>
              <p className="text-neutral-600 mt-2 font-medium">سال تاسیس</p>
              <div className="w-12 h-0.5 bg-[#8f1d1d]/30 mx-auto mt-3"></div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-neutral-100">
              <div className="text-4xl md:text-5xl font-black text-[#8f1d1d]">۸</div>
              <p className="text-neutral-600 mt-2 font-medium">طعم متنوع</p>
              <div className="w-12 h-0.5 bg-[#8f1d1d]/30 mx-auto mt-3"></div>
            </div>
            <div className="bg-white rounded-2xl p-6 text-center shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-neutral-100">
              <div className="text-4xl md:text-5xl font-black text-[#8f1d1d]">۱۰۰%</div>
              <p className="text-neutral-600 mt-2 font-medium">طبیعی و سالم</p>
              <div className="w-12 h-0.5 bg-[#8f1d1d]/30 mx-auto mt-3"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#8f1d1d] py-12 md:py-16 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3"></div>
        <div className="container mx-auto px-4 md:px-6 text-center relative z-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">با ترددیلا همراه شوید</h2>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            برای اطلاع از محصولات جدید و طعم‌های متنوع، ما را در شبکه‌های اجتماعی دنبال کنید
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-bold transition-all duration-300 hover:bg-gray-400 hover:scale-105 shadow-md"
            >
              تماس با ما
            </Link>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border-2 border-white px-8 py-3 font-bold transition-all duration-300 hover:bg-gray-400 hover:text-[#8f1d1d] hover:scale-105"
            >
              اینستاگرام ترددیلا
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}