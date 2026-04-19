// app/shop/page.tsx
import Link from "next/link";
import { ShoppingBag, Clock, Mail } from "lucide-react";

export const metadata = {
  title: "فروشگاه | چیپس ذرت ترددیلا",
  description: "خرید آنلاین چیپس ذرت ترددیلا - به زودی",
};

export default function ShopPage() {
  return (
    <main className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py-20 md:py-28">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8f1d1d]/10 mb-6">
              <ShoppingBag className="w-10 h-10 text-[#8f1d1d]" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#8f1d1d] mb-4">
              فروشگاه آنلاین ترددیلا
            </h1>
            <p className="text-lg md:text-xl text-neutral-600">
              به زودی با بهترین قیمت‌ها و طعم‌های متنوع در خدمت شما خواهیم بود
            </p>
          </div>
        </div>
      </section>

      {/* Coming Soon Content */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-[#8f1d1d]/5">
                <Clock className="w-12 h-12 text-[#8f1d1d]" />
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold text-neutral-800 mb-4">
              در حال راه‌اندازی فروشگاه اینترنتی
            </h2>
            
            <p className="text-neutral-600 leading-relaxed mb-8">
              فروشگاه آنلاین ترددیلا به زودی افتتاح خواهد شد. در این فروشگاه می‌توانید 
              انواع چیپس ذرت ترددیلا را با طعم‌های متنوع و بهترین قیمت تهیه کنید.
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-[#8f1d1d] px-6 py-3 text-white font-bold transition hover:bg-[#6b1616]"
              >
                <Mail className="w-4 h-4" />
                تماس با ما
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}