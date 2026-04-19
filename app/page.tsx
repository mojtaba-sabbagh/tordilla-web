import Link from "next/link";
import { HomeSlider } from "@/components/home-slider";

const flavors = [
  {
    title: "ترددیلا ماست موسیر",
    image: "/home/flavors/18.jpg",
    href: "/products/mast-o-musir",
    highlighted: true,
  },
  {
    title: "",
    image: "/home/flavors/photo_2019-12-21_08-21-09.jpg",
  },
  {
    title: "ترددیلا پنیری",
    image: "/home/flavors/17.jpg",
    href: "/products/paniri",
    highlighted: true,
  },
  {
    title: "",
    image: "/home/flavors/photo_2019-12-21_08-21-09.jpg",
  },
  {
    title: "ترددیلا تنوری",
    image: "/home/flavors/16.jpg",
    href: "/products/tanouri",
    highlighted: true,
  },
  {
    title: "",
    image: "/home/flavors/photo_2019-12-21_08-21-09.jpg",
  },
  {
    title: "ترددیلا سالسا",
    image: "/home/flavors/14.jpg",
    href: "/products/salsa",
    highlighted: true,
  },
  {
    title: "",
    image: "/home/flavors/photo_2019-12-21_08-21-09.jpg",
  },
  {
    title: "ترددیلا مکزیکی",
    image: "/home/flavors/13.jpg",
    href: "/products/mexican",
    highlighted: true,
  },
  {
    title: "ترددیلا کم نمک",
    image: "/home/flavors/1.jpg",
    href: "/products/low-salt",
    highlighted: true,
  },
  {
    title: "",
    image: "/home/flavors/photo_2019-12-21_08-21-09.jpg",
  },
  {
    title: "ترددیلا کنجدی",
    image: "/home/flavors/15.jpg",
    href: "/products/sesame",
    highlighted: true,
  },
];

const retailers = [
  { name: "دیجی‌کالا", image: "/home/brands/digikala.png", href: "#" },
  { name: "مزبار", image: "/home/brands/mazbar.png", href: "#" },
  { name: "شهروند", image: "/home/brands/shahrvand.png", href: "#" },
  { name: "کنبو", image: "/home/brands/canbo.png", href: "#" },
  { name: "پالادیوم", image: "/home/brands/paladium.png", href: "#" },
  { name: "روکو", image: "/home/brands/roco.png", href: "#" },
];

const blogPosts = [
  {
    title: "ترددیلا در دیجیکالا",
    category: "بدانیم",
    date: "11 اکتبر 2018",
    image: "/home/blog/digikala-logo-1200x480-760x180.jpg",
    href: "/blog/tordilla-in-digikala",
    featured: true,
  },
  {
    title: "ناچو ترددیلا در سینماهای سراسر کشور عرضه خواهد شد.",
    category: "بدانیم",
    date: "26 آگوست 2018",
    image: "/home/blog/b4fd571f4b9de34a1599ffdd904f3295-380x180.jpg",
    href: "/blog/cinema-nacho",
  },
  {
    title: "طرز تهیه تاکو مکزیکی (مرحله به مرحله با عکس)",
    category: "طرز تهیه غذا",
    date: "13 آگوست 2018",
    image: "/home/blog/1520956952-chicken-tacos-horizontal-380x180.jpg",
    href: "/blog/mexican-taco",
  },
  {
    title: "بهترین دستور تهیه نان ترتیلا مرحله به مرحله",
    category: "طرز تهیه غذا",
    date: "13 آگوست 2018",
    image: "/home/blog/lionel-gustave-171881-unsplash-380x180.jpg",
    href: "/blog/tortilla-bread",
  },
  {
    title: "طرز تهیه سالسا با طعم‌های متفاوت",
    category: "طرز تهیه دیپ",
    date: "13 آگوست 2018",
    image: "/home/blog/OG0A1062-380x180.jpg",
    href: "/blog/salsa-recipes",
  },
];

const socials = [
  {
    label: "اینستاگرام ترددیلا",
    href: "https://instagram.com/tordillachips/",
    viewBox: "0 0 107.47 107.47",
    paths: [
      "M82.58,40.58A15.71,15.71,0,0,0,66.89,24.89H40.58a15.72,15.72,0,0,0-15.7,15.69V66.89a15.72,15.72,0,0,0,15.7,15.69H66.89A15.71,15.71,0,0,0,82.58,66.89ZM72.77,30.23A4.47,4.47,0,1,1,68.3,34.7,4.47,4.47,0,0,1,72.77,30.23Zm-19,40.67A17.17,17.17,0,1,1,70.9,53.73,17.18,17.18,0,0,1,53.73,70.9Z",
      "M53.73,41.77a12,12,0,1,0,12,12A12,12,0,0,0,53.73,41.77Z",
      "M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM87.66,66.89A20.8,20.8,0,0,1,66.89,87.66H40.58A20.8,20.8,0,0,1,19.8,66.89V40.58A20.8,20.8,0,0,1,40.58,19.8H66.89A20.8,20.8,0,0,1,87.66,40.58Z",
    ],
  },
  {
    label: "توییتر ترددیلا",
    href: "https://twitter.com/tordillachips",
    viewBox: "0 0 107.47 107.47",
    paths: [
      "M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM82.37,40.55a15.28,15.28,0,0,1-3.16,2.65l0,0C78.6,61.32,66.46,79.8,45,80.93c-8.1.43-15.56-2.87-21.36-7.65a23,23,0,0,0,6.57,1,19.66,19.66,0,0,0,12-4.37s-12-3.32-11.72-8.9l5.75-.17a18.12,18.12,0,0,1-5.69-2.95c-3.46-3.12-5.46-7.46-4.47-9.89a7.41,7.41,0,0,0,2.32,1.13,10.73,10.73,0,0,0,3.27.54S28.06,47.09,27,44.25c-1.62-4.42-.8-10.06.81-11.76,0,0,.64,3.58,10.85,8.75,5.18,2.63,11,4.49,15.53,4.61a16.67,16.67,0,0,1-.52-4.2c0-6.16,5.71-11.15,12.76-11.15a13.54,13.54,0,0,1,9.84,4L79.68,33l4-1.72h0s.21.24,0,.85c-.41,1.45-3.59,4.54-4.84,5.54l0,.26a8.19,8.19,0,0,0,2.42-.32c1.35-.37,4.57-1.77,4.57-1.77A22.44,22.44,0,0,1,82.37,40.55Z",
    ],
  },
  {
    label: "فیسبوک ترددیلا",
    href: "https://www.facebook.com/tordillachips",
    viewBox: "0 0 107.47 107.47",
    paths: [
      "M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM71.82,30.46H65.27c-5.15,0-6.14,2.44-6.14,6V44.4H71.39l-1.6,12.39H59.13V88.57H46.34V56.79H35.64V44.4h10.7V35.27c0-10.6,6.47-16.37,15.93-16.37a88.45,88.45,0,0,1,9.55.48Z",
    ],
  },
  {
    label: "آپارات ترددیلا",
    href: "https://www.aparat.com/tordilla.chips",
    viewBox: "0 0 107.47 107.47",
    circles: [
      { cx: "45.33", cy: "41.28", r: "8.18", transform: "translate(-15.92 44.14) rotate(-45)" },
      { cx: "61.68", cy: "66.91", r: "8.18", transform: "translate(-29.25 63.21) rotate(-45)" },
      { cx: "41.05", cy: "62.95", r: "8.18", transform: "translate(-32.49 47.47) rotate(-45)" },
      { cx: "65.74", cy: "45.03", r: "8.18", transform: "translate(-8.59 16.31) rotate(-13.28)" },
    ],
    paths: [
      "M57.46,54a3.82,3.82,0,1,0-3.81,3.82A3.82,3.82,0,0,0,57.46,54Z",
      "M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0Zm-25,29.55A13.55,13.55,0,0,1,45.4,20.1l5.43,1.5A32.27,32.27,0,0,0,27,35.65Zm.56,48.72a13.59,13.59,0,0,1-9.45-16.71l1.7-6.12A32.23,32.23,0,0,0,34.68,79.77Zm49.51-.35a13.59,13.59,0,0,1-16.71,9.45l-5.42-1.51a32.21,32.21,0,0,0,23.82-14Zm-25,4.67A28.86,28.86,0,1,1,82.59,53.73,28.86,28.86,0,0,1,53.73,82.59ZM87.65,45.91,86,52A32.26,32.26,0,0,0,72.79,27.69L78.2,29.2A13.56,13.56,0,0,1,87.65,45.91Z",
    ],
  },
];

const sliderImages = [
  "/home/slider/where-1024x447.jpg",
  "/home/slider/tamas-ba-ma-small-size-min-1024x447.jpg"
];

export default function HomePage() {
  return (
    <div className="bg-white">
      <section className="w-full pt-0">
        <HomeSlider images={sliderImages} />
      </section>

      <section className="mx-auto max-w-[1120px] px-4 py-12 text-center md:px-6">
        <h1 className="text-3xl font-black text-[#8f1d1d] md:text-5xl">
          چیپس ذرت ترددیلا
        </h1>
        <img
          alt="لوگوی ترددیلا"
          className="mx-auto mt-6 h-auto w-[150px] md:w-[190px]"
          src="/home/logo.png"
        />
        <p className="mx-auto mt-6 max-w-[720px] text-lg leading-9 text-neutral-700">
          ترددیلا میان وعده‌ای خوشمزه، ساخته شده از ذرت تازه.
          <br />
          در طعم‌های مختلف که می‌تواند برای هر سن و سلیقه‌ای محبوب باشد.
        </p>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 pb-12 md:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {flavors.map((item, index) => (
            <article
              className="group relative overflow-hidden rounded-[24px] bg-neutral-100"
              key={`${item.image}-${index}`}
            >
              <img
                alt={item.title || `تصویر محصول ${index + 1}`}
                className="h-full min-h-[220px] w-full object-cover transition duration-500 group-hover:scale-[1.02] md:min-h-[240px]"
                src={item.image}
              />

              {item.highlighted ? (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-6 text-white">
                  <h2 className="text-2xl font-extrabold">{item.title}</h2>
                  <Link
                    className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[#39a845] px-5 text-sm font-bold text-white transition hover:bg-[#2f8d39]"
                    href={item.href ?? "/products"}
                  >
                    آشنایی با این طعم
                  </Link>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#8f1d1d] py-6 text-white md:py-8">
        <div className="mx-auto max-w-[760px] px-4 md:px-5">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="overflow-hidden rounded-[16px] bg-white/10 p-1.5">
              <img
                alt="همکاری ترددیلا با سینماها"
                className="h-auto w-full rounded-[12px] object-cover"
                src="/home/cinema/cinema-01.png"
              />
            </div>
            <div className="overflow-hidden rounded-[16px] bg-white/10 p-1.5">
              <img
                alt="راهکار سینمایی ترددیلا"
                className="h-auto w-full rounded-[12px] object-cover"
                src="/home/cinema/cinema-02.png"
              />
            </div>
          </div>

          <div className="mt-4 text-center">
            <Link
              className="inline-flex min-h-9 items-center rounded-full bg-[#39a845] px-5 text-sm font-bold text-white transition hover:bg-[#2f8d39]"
              href="/cinema"
            >
              لیست سینماها
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f1ec] py-14">
        <div className="mx-auto max-w-[1240px] px-4 md:px-6 lg:px-8">
          <h3 className="text-center text-3xl font-black text-[#8f1d1d]">
            ترددیلا کجاست؟
          </h3>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {retailers.map((item) => (
              <a
                className="flex min-h-[180px] items-center justify-center rounded-[26px] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] transition hover:-translate-y-1"
                href={item.href}
                key={item.name}
              >
                <img
                  alt={item.name}
                  className="max-h-[92px] w-auto object-contain"
                  src={item.image}
                />
              </a>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              className="inline-flex min-h-12 items-center rounded-full bg-[#1f86c7] px-8 text-base font-extrabold text-white transition hover:bg-[#15689b]"
              href="/contact"
            >
              ترددیلا یاب
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1240px] px-4 py-14 md:px-6 lg:px-8">
        <h3 className="mb-8 text-center text-3xl font-black text-[#8f1d1d]">
          وبلاگ ترددیلا
        </h3>

        <div className="grid gap-6 md:grid-cols-12">
          {blogPosts.map((post) => (
            <article
              className={`overflow-hidden rounded-[24px] border border-neutral-200 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)] ${
                post.featured ? "md:col-span-8" : "md:col-span-4"
              }`}
              key={post.title}
            >
              <img
                alt={post.title}
                className={`w-full object-cover ${post.featured ? "h-[240px]" : "h-[210px]"}`}
                src={post.image}
              />
              <div className="p-6">
                <h2 className="text-xl font-extrabold leading-9 text-neutral-900">
                  <Link href={post.href}>{post.title}</Link>
                </h2>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-neutral-500">
                  <span>{post.category}</span>
                  <span>{post.date}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-[#8f1d1d] py-12 text-white">
        <div className="mx-auto max-w-[1240px] px-4 text-center md:px-6 lg:px-8">
          <h4 className="text-2xl font-black md:text-[32px]">
            ترددیلا در شبکه های اجتماعی
          </h4>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-5 md:gap-7">
            {socials.map((item) => (
              <a
                aria-label={item.label}
                className="group inline-flex h-[72px] w-[72px] items-center justify-center rounded-full transition hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-[#8f1d1d] md:h-[84px] md:w-[84px]"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                <svg
                  aria-hidden="true"
                  className="h-full w-full"
                  fill="none"
                  viewBox={item.viewBox}
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {item.circles?.map((circle, index) => (
                    <circle
                      cx={circle.cx}
                      cy={circle.cy}
                      fill="#fff"
                      key={`${item.label}-circle-${index}`}
                      r={circle.r}
                      transform={circle.transform}
                    />
                  ))}
                  {item.paths.map((path, index) => (
                    <path d={path} fill="#fff" key={`${item.label}-path-${index}`} />
                  ))}
                </svg>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
