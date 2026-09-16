"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { X } from "lucide-react";

type CatalogImage = {
  src: string;
  alt: string;
};

type CatalogGalleryProps = {
  images: CatalogImage[];
  closeAria: string;
  prevAria: string;
  nextAria: string;
};

export function CatalogGallery({ images, closeAria, prevAria, nextAria }: CatalogGalleryProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);
  const go = useCallback(
    (direction: 1 | -1) =>
      setOpenIndex((current) =>
        current === null ? current : (current + direction + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [openIndex, close, go]);

  if (images.length === 0) {
    return null;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
        {images.map((image, index) => (
          <button
            key={image.src}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="group relative aspect-[706/1000] overflow-hidden rounded-card border border-line bg-cream shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift"
          >
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 180px"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {openIndex !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          onClick={close}
        >
          <button
            type="button"
            aria-label={closeAria}
            onClick={close}
            className="absolute end-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            type="button"
            aria-label={prevAria}
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
            }}
            className="absolute start-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl font-black text-white transition-colors hover:bg-white/20"
          >
            <span className="rtl:rotate-180">‹</span>
          </button>
          <button
            type="button"
            aria-label={nextAria}
            onClick={(event) => {
              event.stopPropagation();
              go(1);
            }}
            className="absolute end-4 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-2xl font-black text-white transition-colors hover:bg-white/20"
          >
            <span className="rtl:rotate-180">›</span>
          </button>

          <div
            className="relative h-[85vh] w-full max-w-[600px]"
            onClick={(event) => event.stopPropagation()}
          >
            <Image
              src={images[openIndex].src}
              alt={images[openIndex].alt}
              fill
              sizes="600px"
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </>
  );
}
