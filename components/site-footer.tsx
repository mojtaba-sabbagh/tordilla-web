// components/site-footer.tsx
import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[rgba(76,50,33,0.12)] text-[#675247]">
      {/* Main Footer */}
      <div className="container mx-auto px-4 md:px-6 py-12">
        <div className="grid gap-8 md:grid-cols-2">
          {/* About Section */}
          <div>
            <h5 className="text-lg font-bold text-[#1f140f] mb-4">درباره ترددیلا</h5>
            <p className="text-sm leading-relaxed">
              برگه ذرت ترتیلا، میان‌وعده‌ا‌ی سالم، تهیه شده از دانه ذرت، آب، روغن، نمک
              و ادویه‌های مختلف است. این محصول اولین بار در کشور مکزیک تهیه شده است و
              به واسطه طعم متفاوت، شکل منحصر به فرد سه‌گوش، کاربرد زیاد در غذاهای
              مختلف و جذب کمتر روغن نسبت به سایر چیپس‌ها، جایگاه خاصی در فرهنگ غذایی
              کشورهای مختلف، خصوصا کشورهای آمریکای لاتین و ایالات متحده دارد.
            </p>
          </div>

          {/* Instagram Section 
          <div>
            <h5 className="text-lg font-bold text-[#1f140f] mb-4">اینستاگرام</h5>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <a
                  key={i}
                  href="https://instagram.com/tordillachips/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="aspect-square bg-neutral-200 rounded-lg overflow-hidden"
                >
                  <img
                    src={`/home/blog/insta.jpg`}
                    alt="اینستاگرام ترددیلا"
                    className="w-full h-full object-cover"
                  />
                </a>
              ))}
            </div>
          </div> */}

          {/* Contact Section */}
          <div>
            <h5 className="text-lg font-bold text-[#1f140f] mb-4">ارتباط با ما</h5>
            <div className="space-y-3 text-sm">
              <p className="flex gap-2">
                <span>📍</span>
                <span>تهران، خیابان تیموری، نبش ابراهیمی، ساختمان مهرنگار، واحد ۱۴</span>
              </p>
              <p className="flex gap-2">
                <span>📞</span>
                <a href="tel:02191072667" className="hover:text-[#ce4a28] transition">
                  ۰۲۱-۹۱۰۷۲۶۶۷
                </a>
              </p>
              <p className="flex gap-2">
                <span>✉️</span>
                <a href="mailto:info@TordillaFood.com" className="hover:text-[#ce4a28] transition">
                  info@TordillaFood.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Networks Section */}
      <div className="bg-[#8f1d1d] py-8 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h4 className="text-xl font-black md:text-2xl mb-6">
            ترددیلا در شبکه های اجتماعی
          </h4>
          <div className="flex flex-wrap items-center justify-center gap-5 md:gap-7">
            <a
              aria-label="اینستاگرام ترددیلا"
              className="inline-flex h-14 w-14 md:h-[72px] md:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://instagram.com/tordillachips/"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
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
              className="inline-flex h-14 w-14 md:h-[72px] md:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://twitter.com/tordillachips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM82.37,40.55a15.28,15.28,0,0,1-3.16,2.65l0,0C78.6,61.32,66.46,79.8,45,80.93c-8.1.43-15.56-2.87-21.36-7.65a23,23,0,0,0,6.57,1,19.66,19.66,0,0,0,12-4.37s-12-3.32-11.72-8.9l5.75-.17a18.12,18.12,0,0,1-5.69-2.95c-3.46-3.12-5.46-7.46-4.47-9.89a7.41,7.41,0,0,0,2.32,1.13,10.73,10.73,0,0,0,3.27.54S28.06,47.09,27,44.25c-1.62-4.42-.8-10.06.81-11.76,0,0,.64,3.58,10.85,8.75,5.18,2.63,11,4.49,15.53,4.61a16.67,16.67,0,0,1-.52-4.2c0-6.16,5.71-11.15,12.76-11.15a13.54,13.54,0,0,1,9.84,4L79.68,33l4-1.72h0s.21.24,0,.85c-.41,1.45-3.59,4.54-4.84,5.54l0,.26a8.19,8.19,0,0,0,2.42-.32c1.35-.37,4.57-1.77,4.57-1.77A22.44,22.44,0,0,1,82.37,40.55Z"
                  fill="#fff"
                />
              </svg>
            </a>
            <a
              aria-label="فیسبوک ترددیلا"
              className="inline-flex h-14 w-14 md:h-[72px] md:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://www.facebook.com/tordillachips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
                <path
                  d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM71.82,30.46H65.27c-5.15,0-6.14,2.44-6.14,6V44.4H71.39l-1.6,12.39H59.13V88.57H46.34V56.79H35.64V44.4h10.7V35.27c0-10.6,6.47-16.37,15.93-16.37a88.45,88.45,0,0,1,9.55.48Z"
                  fill="#fff"
                />
              </svg>
            </a>
            <a
              aria-label="آپارات ترددیلا"
              className="inline-flex h-14 w-14 md:h-[72px] md:w-[72px] items-center justify-center rounded-full transition hover:scale-105"
              href="https://www.aparat.com/tordilla.chips"
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg className="h-full w-full" fill="none" viewBox="0 0 107.47 107.47">
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
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex gap-6">
            <Link href="/blog" className="hover:text-[#ce4a28] transition">
              وبلاگ
            </Link>
            <Link href="/contact" className="hover:text-[#ce4a28] transition">
              تماس با ما
            </Link>
            <Link href="/about" className="hover:text-[#ce4a28] transition">
              درباره ما
            </Link>
          </div>
          <div className="text-center">
            <span>
              تمام حقوق محفوظ برای ترددیلا © {currentYear}{" "}
              <a
                href="https://www.joorchin.co/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ce4a28] transition"
              >
                طراحی توسط جورچین
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}