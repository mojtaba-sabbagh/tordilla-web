import Link from "next/link";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "accent" | "outline";
  className?: string;
};

const variantClasses: Record<NonNullable<CtaLinkProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-br from-[#e05a30] via-[#ce4a28] to-[#8f2e18] text-white shadow-[0_10px_28px_rgba(206,74,40,0.35)] hover:shadow-[0_16px_36px_rgba(206,74,40,0.45)] hover:brightness-105",
  accent:
    "bg-gradient-to-br from-[#2a5c4c] to-[#173630] text-white shadow-[0_10px_28px_rgba(33,76,63,0.32)] hover:shadow-[0_16px_36px_rgba(33,76,63,0.42)] hover:brightness-110",
  outline:
    "border-2 border-[rgba(206,74,40,0.3)] text-[#8f2e18] hover:border-[#ce4a28] hover:bg-[rgba(206,74,40,0.06)]",
};

export function CtaLink({ href, children, variant = "primary", className = "" }: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-8 text-[15px] font-extrabold tracking-tight transition-all duration-250 hover:-translate-y-1 hover:scale-[1.03] active:scale-[0.98] ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
