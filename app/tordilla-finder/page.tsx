// app/tordilla-finder/page.tsx
import Link from "next/link";
import { MapPin, Navigation, Store } from "lucide-react";

export const metadata = {
  title: "ترددیلا یاب | چیپس ذرت ترددیلا",
  description:
    "نقشه فروشگاه‌های دارای محصولات ترددیلا - پیدا کردن نزدیک‌ترین فروشنده چیپس ذرت ترددیلا",
};

export default function TordillaFinderPage() {
  return (
    <div className="bg-white">
      {/* Hero Section with Breadcrumb */}
      <section className="bg-[#f6f1ec] pt-8 pb-4">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 lg:px-8">
          <div className="text-sm text-neutral-500 mb-4">
            <Link href="/" className="hover:text-[#8f1d1d] transition">
              چیپس ذرت ترددیلا
            </Link>{" "}
            &gt; <span className="text-[#8f1d1d]">ترددیلا یاب</span>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8f1d1d]/10 mb-6">
              <Navigation className="w-10 h-10 text-[#8f1d1d]" />
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#8f1d1d] mb-4">
              ترددیلا یاب
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              نزدیک‌ترین فروشنده محصولات ترددیلا را پیدا کنید
            </p>
          </div>
        </div>
      </section>

      {/* Google Maps Section */}
      <section className="mx-auto max-w-[1240px] px-4 py-12 md:px-6 lg:px-8">
        <div className="bg-white rounded-[24px] overflow-hidden shadow-[0_18px_40px_rgba(0,0,0,0.08)] border border-neutral-100">
          <div className="aspect-video w-full">
            <iframe
              src="https://www.google.com/maps/d/embed?mid=1XXtufbZufrihTNWzWRG8mugSpE9cAkCT"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              title="نقشه فروشگاه‌های ترددیلا"
              className="w-full h-full min-h-[500px]"
            />
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[#f6f1ec] py-16">
        <div className="mx-auto max-w-[1240px] px-4 text-center md:px-6 lg:px-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8f1d1d]/10 mb-4">
            <Store className="w-8 h-8 text-[#8f1d1d]" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-[#8f1d1d] mb-3">
            فروشگاه مورد نظر خود را پیدا نکردید؟
          </h3>
          <p className="text-neutral-600 leading-relaxed max-w-2xl mx-auto">
            نقشه فروشگاه‌ها به‌روزرسانی می‌شود. برای اطلاع از جدیدترین فروشگاه‌های دارای
            محصولات ترددیلا، ما را در شبکه‌های اجتماعی دنبال کنید.
          </p>
          <div className="mt-8">
            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center rounded-full bg-[#1f86c7] px-8 text-base font-extrabold text-white transition hover:bg-[#15689b]"
            >
              تماس با ما
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section similar to home page cinema section */}
      <section className="bg-[#8f1d1d] py-6 md:py-8">
        <div className="mx-auto max-w-[760px] px-4 md:px-5 text-center">
          <h4 className="text-xl md:text-2xl font-black text-white mb-4">
            ترددیلا در شبکه‌های اجتماعی
          </h4>
          <p className="text-white/80 mb-6">
            برای اطلاع از جدیدترین فروشگاه‌ها و محصولات، ما را دنبال کنید
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-10 items-center rounded-full bg-white px-5 text-sm font-bold text-[#8f1d1d] transition hover:bg-gray-100"
            >
              اینستاگرام ترددیلا
            </a>
            <Link
              href="/contact"
              className="inline-flex min-h-10 items-center rounded-full border-2 border-white px-5 text-sm font-bold text-white transition hover:bg-white hover:text-[#8f1d1d]"
            >
              ارتباط با ما
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}