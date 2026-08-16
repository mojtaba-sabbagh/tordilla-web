type SectionBadgeProps = {
  children: React.ReactNode;
  tone?: "brand" | "invert" | "corn";
  className?: string;
};

const toneClasses: Record<NonNullable<SectionBadgeProps["tone"]>, string> = {
  brand: "border-leaf-200 bg-leaf-50 text-leaf-700",
  invert: "border-white/20 bg-white/12 text-white backdrop-blur-sm",
  corn: "border-corn-300 bg-corn-100 text-corn-700",
};

export function SectionBadge({ children, tone = "brand", className = "" }: SectionBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-[13px] font-bold tracking-tight ${toneClasses[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
