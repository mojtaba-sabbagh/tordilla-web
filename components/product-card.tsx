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
    <article className="group relative flex flex-col overflow-hidden rounded-[32px] bg-[var(--surface-strong)] shadow-[0_10px_32px_rgba(143,66,29,0.12)] transition-all duration-350 hover:-translate-y-2 hover:shadow-[0_28px_64px_rgba(206,74,40,0.28)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#f5ede6]">
        <Image
          src={image}
          alt={title}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 320px"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-350 group-hover:opacity-100" />
        <span className="absolute top-4 right-4 rounded-full bg-gradient-to-br from-[#e05a30] to-[#8f2e18] px-3.5 py-1 text-xs font-bold text-white shadow-[0_4px_14px_rgba(0,0,0,0.2)] backdrop-blur">
          {badgeLabel}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="mb-2.5 text-xl font-extrabold tracking-tight text-[var(--text)]">{title}</h3>
        <p className="flex-1 text-sm leading-[1.85] text-[var(--muted)]">{description}</p>

        {features.length > 0 && (
          <div className="mt-3.5 flex flex-wrap gap-1.5">
            {features.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="rounded-full bg-[rgba(206,74,40,0.07)] px-2.5 py-1 text-xs font-semibold text-[#8f2e18]"
              >
                {feature}
              </span>
            ))}
          </div>
        )}

        <Link
          href={href}
          className="mt-4.5 inline-flex w-fit items-center gap-1.5 rounded-full bg-gradient-to-br from-[#e05a30] to-[#8f2e18] px-5 py-2.5 text-sm font-bold text-white shadow-[0_6px_18px_rgba(206,74,40,0.3)] transition-all duration-200 hover:shadow-[0_10px_24px_rgba(206,74,40,0.4)] rtl:group-hover:-translate-x-1 ltr:group-hover:translate-x-1"
        >
          {ctaLabel}
          <span className="text-base leading-none rtl:rotate-180">›</span>
        </Link>
      </div>
    </article>
  );
}
