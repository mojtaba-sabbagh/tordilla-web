import Image from "next/image";
import Link from "next/link";

type ProductCardProps = {
  href: string;
  image: string;
  title: string;
  description: string;
  features?: string[];
  badgeLabel: string;
  ctaLabel: string;
  priority?: boolean;
};

export function ProductCard({
  href,
  image,
  title,
  description,
  features = [],
  badgeLabel,
  ctaLabel,
  priority = false,
}: ProductCardProps) {
  return (
    <article className="surface surface-hover group relative flex h-full flex-col overflow-hidden p-2.5">
      <Link href={href} className="flex h-full flex-col">
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-tile bg-cream-warm">
          <Image
            src={image}
            alt={title}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-107"
          />
          <span className="absolute end-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-black text-leaf-700 shadow-sm backdrop-blur">
            {badgeLabel}
          </span>
        </div>

        <div className="flex flex-1 flex-col px-3.5 pb-3 pt-5">
          <h3 className="mb-2 text-[17px] font-black tracking-tight text-ink transition-colors duration-200 group-hover:text-leaf-600">
            {title}
          </h3>
          <p className="flex-1 text-[13.5px] leading-[1.95] text-ink-mute">{description}</p>

          {features.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {features.slice(0, 3).map((feature) => (
                <span
                  key={feature}
                  className="rounded-full bg-leaf-50 px-2.5 py-1 text-[11px] font-bold text-leaf-600"
                >
                  {feature}
                </span>
              ))}
            </div>
          )}

          <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-black text-leaf-600">
            {ctaLabel}
            <span className="grid h-6 w-6 place-items-center rounded-full bg-leaf-50 text-leaf-600 transition-all duration-300 group-hover:bg-corn-400 group-hover:text-leaf-900 rtl:rotate-180">
              ›
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
