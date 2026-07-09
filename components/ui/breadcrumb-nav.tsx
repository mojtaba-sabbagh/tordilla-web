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
      className={`mx-auto flex max-w-[1080px] flex-wrap items-center gap-2 border-b-[1.5px] border-[rgba(206,74,40,0.08)] px-6 py-5 text-[13px] text-[#a07060] ${className}`}
    >
      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="text-[#cbb0a0]">›</span>}
          {item.href ? (
            <Link href={item.href} className="font-semibold text-[#8f2e18] hover:underline">
              {item.label}
            </Link>
          ) : (
            <span>{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
