// app/contact/page.tsx
'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";

export default function ContactPage() {
    const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (response.ok) {
        setSubmitStatus({ type: 'success', message: 'پیام شما با موفقیت ارسال شد. با تشکر!' });
        e.currentTarget.reset();
      } else {
        setSubmitStatus({ type: 'error', message: 'خطا در ارسال پیام. لطفاً مجدد تلاش کنید.' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'خطا در ارتباط با سرور.' });
    } finally {
      setIsSubmitting(false);
    }
  }
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#fbf5ec] to-white py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-4xl font-black text-[#8f1d1d] md:text-5xl lg:text-6xl">
              تماس با ما
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-600 md:text-xl">
              خوشحال می‌شویم نظرات، پیشنهادات و سوالات شما را بشنویم
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto -mt-8 px-4 md:px-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Address Card */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#8f1d1d]/10">
              <MapPin className="h-7 w-7 text-[#8f1d1d]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800">آدرس</h3>
            <p className="text-neutral-600 leading-relaxed">
              تهران، خیابان تیموری،
              <br />
              نبش ابراهیمی، ساختمان مهرنگار، واحد ۱۴
            </p>
          </div>

          {/* Phone Card */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#8f1d1d]/10">
              <Phone className="h-7 w-7 text-[#8f1d1d]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800">تلفن</h3>
            <p className="text-neutral-600">
              <a href="tel:09426002408" className="hover:text-[#8f1d1d] transition">
                ۰۹۴۲۶۰۰۲۴۰۸ - 
                داخلی  : ۲۰
              </a>
            </p>
          </div>

          {/* Email Card */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#8f1d1d]/10">
              <Mail className="h-7 w-7 text-[#8f1d1d]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800">ایمیل</h3>
            <p className="text-neutral-600">
              <a href="mailto:info@TordillaFood.com" className="hover:text-[#8f1d1d] transition">
                it@tordilla.ir
              </a>
            </p>
          </div>

          {/* Hours Card */}
          <div className="rounded-2xl bg-white p-6 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#8f1d1d]/10">
              <Clock className="h-7 w-7 text-[#8f1d1d]" />
            </div>
            <h3 className="mb-2 text-xl font-bold text-neutral-800">ساعت کاری</h3>
            <p className="text-neutral-600">
              شنبه تا چهارشنبه: ۹ تا ۱۷
              <br />
              پنجشنبه: ۹ تا ۱۳
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form & Map Section */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Form */}
            <div className="rounded-3xl bg-[#f6f1ec] p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-[#8f1d1d] md:text-3xl">
                ارسال پیام
              </h2>
              <form action="#" method="POST" className="space-y-5">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-neutral-700">
                    نام و نام خانوادگی *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20 transition"
                    placeholder="نام خود را وارد کنید"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium text-neutral-700">
                    ایمیل *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20 transition"
                    placeholder="example@domain.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="mb-2 block text-sm font-medium text-neutral-700">
                    تلفن تماس
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20 transition"
                    placeholder="۰۲۱-XXXXX"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium text-neutral-700">
                    موضوع *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20 transition"
                    placeholder="موضوع پیام"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-neutral-700">
                    پیام شما *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 focus:border-[#8f1d1d] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d]/20 transition resize-none"
                    placeholder="متن پیام خود را بنویسید..."
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8f1d1d] px-6 py-3 text-lg font-bold text-white transition hover:bg-[#6b1616] focus:outline-none focus:ring-2 focus:ring-[#8f1d1d] focus:ring-offset-2 md:w-auto"
                >
                  <Send className="h-5 w-5" />
                  ارسال پیام
                </button>
              </form>
            </div>

            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3239.123456789012!2d51.3890!3d35.6892!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e0143e6b3c0e1%3A0x2b9a8f0b1c2d3e4f!2sTehran%2C%20Teymouri%20Street!5e0!3m2!1sen!2sir!4v1234567890123!5m2!1sen!2sir"
                width="100%"
                height="100%"
                style={{ minHeight: "400px", border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="موقعیت دفتر ترددیلا"
                className="w-full h-full min-h-[450px] lg:min-h-[550px]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company Info Section */}
      <section className="bg-[#f6f1ec] py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="mb-8 text-3xl font-bold text-[#8f1d1d] md:text-4xl">
              درباره شرکت
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-neutral-800">
                شرکت کوثر کویر رفسنجان
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                شرکت کوثر کویر رفسنجان واقع شده در شهر طلای سبز، واحد نمونه صنعتی در استان کرمان
                می‌باشد. این شرکت به فعالیت‌های متعددی از جمله تولید و بسته‌بندی چیپس و اسنک،
                فرآوری و بسته‌بندی انواع خشکبار خصوصا پسته، واردات و صادرات محصولات خود به
                سایر شرکت‌های همکار، می‌پردازد.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-6 shadow-md">
              <h3 className="mb-4 text-xl font-bold text-neutral-800">
                دفتر مرکزی تهران
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                شرکت کوثر کویر رفسنجان، دفتر مرکزی خود را در تهران از سال ۱۳۸۷ راه‌اندازی نمود،
                کلیه امور بازرگانی و فروش از جمله فروش مویرگی در تهران، مدیریت فروش شهرستان‌ها،
                صادرات محصولات با برند تجاری ترددیلا و واردات و صادرات انواع خشکبار، ذرت و
                سایر اقلام مورد نیاز شرکت را بر عهده دارد.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center">
            <h2 className="mb-4 text-3xl font-bold text-[#8f1d1d] md:text-4xl">
              اینستاگرام ترددیلا
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-neutral-600">
              برای دیدن جدیدترین محصولات و تخفیف‌ها، ما را در اینستاگرام دنبال کنید
            </p>
            <a
              href="https://instagram.com/tordillachips/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] px-8 py-3 font-bold text-white transition hover:scale-105"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm4.965-10.405a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z"/>
              </svg>
              دنبال کنید
            </a>
          </div>
        </div>
      </section>

      {/* Social Networks Section */}
      <section className="bg-[#8f1d1d] py-12 text-white">
        <div className="container mx-auto px-4 text-center md:px-6">
          <h4 className="text-2xl font-black md:text-[32px]">
            ترددیلا در شبکه های اجتماعی
          </h4>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:gap-7">
            <a
              aria-label="اینستاگرام ترددیلا"
              className="group inline-flex h-[72px] w-[72px] items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8f1d1d] md:h-[84px] md:w-[84px]"
              href="https://instagram.com/tordillachips/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="h-full w-full"
                fill="none"
                viewBox="0 0 107.47 107.47"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M82.58,40.58A15.71,15.71,0,0,0,66.89,24.89H40.58a15.72,15.72,0,0,0-15.7,15.69V66.89a15.72,15.72,0,0,0,15.7,15.69H66.89A15.71,15.71,0,0,0,82.58,66.89ZM72.77,30.23A4.47,4.47,0,1,1,68.3,34.7,4.47,4.47,0,0,1,72.77,30.23Zm-19,40.67A17.17,17.17,0,1,1,70.9,53.73,17.18,17.18,0,0,1,53.73,70.9Z"
                  fill="#fff"
                />
                <path
                  d="M53.73,41.77a12,12,0,1,0,12,12A12,12,0,0,0,53.73,41.77Z"
                  fill="#fff"
                />
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM87.66,66.89A20.8,20.8,0,0,1,66.89,87.66H40.58A20.8,20.8,0,0,1,19.8,66.89V40.58A20.8,20.8,0,0,1,40.58,19.8H66.89A20.8,20.8,0,0,1,87.66,40.58Z"
                  fill="#fff"
                />
              </svg>
            </a>

            <a
              aria-label="توییتر ترددیلا"
              className="group inline-flex h-[72px] w-[72px] items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8f1d1d] md:h-[84px] md:w-[84px]"
              href="https://twitter.com/tordillachips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="h-full w-full"
                fill="none"
                viewBox="0 0 107.47 107.47"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM82.37,40.55a15.28,15.28,0,0,1-3.16,2.65l0,0C78.6,61.32,66.46,79.8,45,80.93c-8.1.43-15.56-2.87-21.36-7.65a23,23,0,0,0,6.57,1,19.66,19.66,0,0,0,12-4.37s-12-3.32-11.72-8.9l5.75-.17a18.12,18.12,0,0,1-5.69-2.95c-3.46-3.12-5.46-7.46-4.47-9.89a7.41,7.41,0,0,0,2.32,1.13,10.73,10.73,0,0,0,3.27.54S28.06,47.09,27,44.25c-1.62-4.42-.8-10.06.81-11.76,0,0,.64,3.58,10.85,8.75,5.18,2.63,11,4.49,15.53,4.61a16.67,16.67,0,0,1-.52-4.2c0-6.16,5.71-11.15,12.76-11.15a13.54,13.54,0,0,1,9.84,4L79.68,33l4-1.72h0s.21.24,0,.85c-.41,1.45-3.59,4.54-4.84,5.54l0,.26a8.19,8.19,0,0,0,2.42-.32c1.35-.37,4.57-1.77,4.57-1.77A22.44,22.44,0,0,1,82.37,40.55Z"
                  fill="#fff"
                />
              </svg>
            </a>

            <a
              aria-label="فیسبوک ترددیلا"
              className="group inline-flex h-[72px] w-[72px] items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8f1d1d] md:h-[84px] md:w-[84px]"
              href="https://www.facebook.com/tordillachips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="h-full w-full"
                fill="none"
                viewBox="0 0 107.47 107.47"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM71.82,30.46H65.27c-5.15,0-6.14,2.44-6.14,6V44.4H71.39l-1.6,12.39H59.13V88.57H46.34V56.79H35.64V44.4h10.7V35.27c0-10.6,6.47-16.37,15.93-16.37a88.45,88.45,0,0,1,9.55.48Z"
                  fill="#fff"
                />
              </svg>
            </a>

            <a
              aria-label="آپارات ترددیلا"
              className="group inline-flex h-[72px] w-[72px] items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8f1d1d] md:h-[84px] md:w-[84px]"
              href="https://www.aparat.com/tordilla.chips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                aria-hidden="true"
                className="h-full w-full"
                fill="none"
                viewBox="0 0 107.47 107.47"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="45.33" cy="41.28" fill="#fff" r="8.18" transform="translate(-15.92 44.14) rotate(-45)" />
                <path d="M57.46,54a3.82,3.82,0,1,0-3.81,3.82A3.82,3.82,0,0,0,57.46,54Z" fill="#fff" />
                <circle cx="61.68" cy="66.91" fill="#fff" r="8.18" transform="translate(-29.25 63.21) rotate(-45)" />
                <circle cx="41.05" cy="62.95" fill="#fff" r="8.18" transform="translate(-32.49 47.47) rotate(-45)" />
                <circle cx="65.74" cy="45.03" fill="#fff" r="8.18" transform="translate(-8.59 16.31) rotate(-13.28)" />
                <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0Zm-25,29.55A13.55,13.55,0,0,1,45.4,20.1l5.43,1.5A32.27,32.27,0,0,0,27,35.65Zm.56,48.72a13.59,13.59,0,0,1-9.45-16.71l1.7-6.12A32.23,32.23,0,0,0,34.68,79.77Zm49.51-.35a13.59,13.59,0,0,1-16.71,9.45l-5.42-1.51a32.21,32.21,0,0,0,23.82-14Zm-25,4.67A28.86,28.86,0,1,1,82.59,53.73,28.86,28.86,0,0,1,53.73,82.59ZM87.65,45.91,86,52A32.26,32.26,0,0,0,72.79,27.69L78.2,29.2A13.56,13.56,0,0,1,87.65,45.91Z" fill="#fff" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}