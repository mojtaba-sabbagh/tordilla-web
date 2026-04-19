// app/cinema/page.tsx - Alternative without images
import Link from "next/link";
import { MapPin, Ticket, Popcorn } from "lucide-react";

export const metadata = {
  title: "سینما ترددیلا | چیپس ذرت ترددیلا",
  description:
    "لیست سینماهای ارائه دهنده ناچو چیپس ذرت ترددیلا به همراه سس - تجربه لذیذ تماشای فیلم با ترددیلا",
};

const cinemas = [
  {
    name: "پردیس سینمایی باغ کتاب",
    address: "بزرگراه شهید حقانی - ورودی کتابخانه ملی - باغ کتاب تهران",
    ticketUrl: "https://cinematicket.org/?p=ncinemadet&cid=524",
  },
  {
    name: "بولینگ عبدو",
    address: "بزرگراه صدر - خیابان شریعتی - مترو صدر",
    ticketUrl: "https://cinematicket.org/?p=ncinemadet&cid=73",
  },
  {
    name: "سینما فرهنگ",
    address: "خیابان شریعتی - بالاتر از خیابان دولت",
    ticketUrl: "",
  },
  {
    name: "پردیس سینمایی کورش",
    address: "بزرگراه شهید ستاری - نبش پیامبر مرکزی",
    ticketUrl: "https://cinematicket.org/?p=ncinemadet&cid=448",
  },
  {
    name: "پردیس سینمایی ملت",
    address: "پارک ملت - خیابان ولیعصر - خیابان دستگردی",
    ticketUrl: "",
  },
];

export default function CinemaPage() {
  return (
    <main className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#8f1d1d]/10 mb-6">
              <Popcorn className="w-10 h-10 text-[#8f1d1d]" />
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-[#8f1d1d] mb-4">
              سینما ترددیلا
            </h1>
            <p className="text-base md:text-lg text-neutral-600">
              تجربه لذیذ تماشای فیلم با ناچو ترددیلا و سس مخصوص
            </p>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <div className="container mx-auto px-4 md:px-6 py-3">
        <div className="text-sm text-neutral-500">
          <Link href="/" className="hover:text-[#8f1d1d] transition">
            چیپس ذرت ترددیلا
          </Link>{" "}
          &gt; <span className="text-[#8f1d1d]">سینما ترددیلا</span>
        </div>
      </div>

      {/* Title Section */}
      <section className="container mx-auto px-4 md:px-6 py-4">
        <div className="text-center">
          <h2 className="text-xl md:text-2xl font-bold text-[#8f1d1d]">
            لیست سینماهای ارائه دهنده ناچو چیپس ذرت ترددیلا به همراه سس
          </h2>
        </div>
      </section>

      {/* Cinemas List */}
      <section className="container mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-4">
          {cinemas.map((cinema) => (
            <div
              key={cinema.name}
              className="bg-white rounded-xl shadow-md overflow-hidden border border-neutral-100 transition hover:shadow-lg"
            >
              <div className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-bold text-[#8f1d1d] mb-2">
                  {cinema.name}
                </h3>
                <div className="flex items-start gap-2 text-neutral-600 text-sm mb-4">
                  <MapPin className="w-4 h-4 text-[#8f1d1d] flex-shrink-0 mt-0.5" />
                  <p>{cinema.address}</p>
                </div>
                {cinema.ticketUrl ? (
                  <a
                    href={cinema.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-[#8f1d1d] !text-white px-4 py-2 rounded-full text-sm font-bold transition hover:bg-[#6b1616]"
                  >
                    <Ticket className="w-4 h-4 text-white" />
                    خرید بلیط
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-500 px-4 py-2 rounded-full text-sm font-bold">
                    <Ticket className="w-4 h-4" />
                    خرید بلیط
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-[#f6f1ec] py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#8f1d1d]/10 mb-4">
              <span className="text-2xl">🎬</span>
            </div>
            <h3 className="text-xl md:text-2xl font-bold text-[#8f1d1d] mb-3">
              تجربه متفاوت در سینما
            </h3>
            <p className="text-neutral-600 leading-relaxed">
              ناچو ترددیلا به همراه سس مخصوص، بهترین همراه برای تماشای فیلم در سینماهای 
              منتخب سراسر کشور است. با ترددیلا، لحظات تماشای فیلم خود را لذیذتر کنید.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#8f1d1d] py-12 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h4 className="text-xl md:text-2xl font-black mb-4">
            سینما مورد نظر خود را پیدا نکردید؟
          </h4>
          <p className="text-white/80 mb-6 max-w-2xl mx-auto">
            لیست سینماها به‌روزرسانی می‌شود. برای اطلاع از جدیدترین سینماهای دارای ترددیلا،
            ما را در شبکه‌های اجتماعی دنبال کنید.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-block rounded-full bg-white text-[#8f1d1d] px-6 py-2.5 font-bold transition hover:bg-gray-100"
            >
              تماس با ما
            </Link>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full border-2 border-white px-6 py-2.5 font-bold transition hover:bg-white hover:text-[#8f1d1d]"
            >
              اینستاگرام ترددیلا
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}