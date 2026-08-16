"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";

type HomeSliderProps = {
  images: string[];
  className?: string;
  alt?: string;
};

export function HomeSlider({ images, className = "", alt = "Tordilla" }: HomeSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const go = useCallback(
    (direction: 1 | -1) =>
      setActiveIndex((current) => (current + direction + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (images.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [images.length]);

  if (images.length === 0) {
    return null;
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-card-lg bg-leaf-800 shadow-lift ring-1 ring-white/10 ${className}`}
    >
      <div className="relative h-full w-full">
        {images.map((image, index) => (
          <Image
            alt={`${alt} ${index + 1}`}
            className={`object-cover transition-all duration-[900ms] ease-out ${
              activeIndex === index ? "scale-100 opacity-100" : "scale-105 opacity-0"
            }`}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 620px"
            key={image}
            src={image}
          />
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-leaf-900/70 via-leaf-900/5 to-transparent" />
      </div>

      <button
        aria-label="prev"
        className="absolute end-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-lg font-black text-leaf-700 opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
        onClick={() => go(-1)}
        type="button"
      >
        <span className="rtl:rotate-180">‹</span>
      </button>
      <button
        aria-label="next"
        className="absolute start-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-white/85 text-lg font-black text-leaf-700 opacity-0 shadow-soft backdrop-blur transition-all duration-300 hover:bg-white group-hover:opacity-100 focus-visible:opacity-100"
        onClick={() => go(1)}
        type="button"
      >
        <span className="rtl:rotate-180">›</span>
      </button>

      <div className="absolute inset-x-0 bottom-4 flex items-center justify-center gap-2">
        {images.map((image, index) => (
          <button
            aria-label={`slide ${index + 1}`}
            className={`h-1.5 rounded-full transition-all duration-400 ${
              activeIndex === index ? "w-8 bg-corn-400" : "w-1.5 bg-white/55 hover:bg-white/80"
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
