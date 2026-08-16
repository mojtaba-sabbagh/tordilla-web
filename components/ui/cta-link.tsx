import Link from "next/link";

type CtaLinkProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "accent" | "outline" | "invert";
  size?: "md" | "lg";
  className?: string;
};

const variantClasses: Record<NonNullable<CtaLinkProps["variant"]>, string> = {
  primary:
    "bg-leaf-600 text-white shadow-glow hover:bg-leaf-700",
  accent:
    "bg-corn-400 text-leaf-900 shadow-glow-corn hover:bg-corn-300",
  outline:
    "border-2 border-leaf-200 bg-white/70 text-leaf-700 hover:border-leaf-400 hover:bg-white",
  invert:
    "border-2 border-white/40 bg-white/10 text-white backdrop-blur hover:bg-white hover:text-leaf-800",
};

const sizeClasses: Record<NonNullable<CtaLinkProps["size"]>, string> = {
  md: "min-h-[46px] px-6 text-[14px]",
  lg: "min-h-[54px] px-8 text-[15px]",
};

export function CtaLink({
  href,
  children,
  variant = "primary",
  size = "lg",
  className = "",
}: CtaLinkProps) {
  return (
    <Link
      href={href}
      className={`group/cta inline-flex items-center justify-center gap-2 rounded-full font-extrabold tracking-tight transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
