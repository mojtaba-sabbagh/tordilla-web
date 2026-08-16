import Link from "next/link";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbNavProps = {
  items: BreadcrumbItem[];
  className?: string;
};

export function BreadcrumbNav({ items, className = "" }: BreadcrumbNavProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={`mx-auto flex max-w-[1120px] flex-wrap items-center gap-2 px-6 py-4 text-[13px] text-ink-mute ${className}`}
    >
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-leaf-300 rtl:rotate-180">›</span>}
          {item.href ? (
            <Link
              href={item.href}
              className="font-bold text-leaf-600 transition-colors hover:text-leaf-800"
            >
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-ink-soft">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
