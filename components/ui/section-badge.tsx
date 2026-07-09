type SectionBadgeProps = {
  children: React.ReactNode;
  tone?: "brand" | "invert";
  className?: string;
};

export function SectionBadge({ children, tone = "brand", className = "" }: SectionBadgeProps) {
  const toneClasses =
    tone === "invert"
      ? "border-white/25 bg-white/10 text-white"
      : "border-[rgba(206,74,40,0.2)] bg-[rgba(206,74,40,0.06)] text-[#8f2e18]";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-sm font-bold ${toneClasses} ${className}`}
    >
      {children}
    </span>
  );
}
