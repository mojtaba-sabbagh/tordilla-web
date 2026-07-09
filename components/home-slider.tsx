"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type HomeSliderProps = {
  images: string[];
};

export function HomeSlider({ images }: HomeSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 4000);

    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="relative w-full overflow-hidden bg-neutral-100 shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
        <div className="relative h-[40vh] min-h-[280px] w-full sm:h-[48vh] md:h-[56vh] lg:h-[62vh]">
          {images.map((image, index) => (
            <Image
              alt={`اسلاید ${index + 1}`}
              className={`object-cover transition-opacity duration-700 ${
                activeIndex === index ? "opacity-100" : "opacity-0"
              }`}
              fill
              priority={index === 0}
              sizes="100vw"
              key={image}
              src={image}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
        </div>

        <button
          aria-label="اسلاید قبلی"
          className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg font-black text-[#8f2e18] shadow transition hover:bg-white md:right-5 md:h-12 md:w-12"
          onClick={() =>
            setActiveIndex((current) => (current - 1 + images.length) % images.length)
          }
          type="button"
        >
          ›
        </button>
        <button
          aria-label="اسلاید بعدی"
          className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-lg font-black text-[#8f2e18] shadow transition hover:bg-white md:left-5 md:h-12 md:w-12"
          onClick={() => setActiveIndex((current) => (current + 1) % images.length)}
          type="button"
        >
          ‹
        </button>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 px-4">
        {images.map((image, index) => (
          <button
            aria-label={`رفتن به اسلاید ${index + 1}`}
            className={`h-2.5 rounded-full transition ${
              activeIndex === index ? "w-8 bg-[#ce4a28]" : "w-2.5 bg-neutral-300"
            }`}
            key={image}
            onClick={() => setActiveIndex(index)}
            type="button"
          />
        ))}
      </div>
    </div>
  );
}
