type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: SectionCardProps) {
  return (
    <div
      className={`rounded-card-lg border border-line bg-surface p-7 shadow-soft md:p-10 ${className}`}
    >
      {children}
    </div>
  );
}

type SectionHeadingProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionHeading({ children, className = "" }: SectionHeadingProps) {
  return (
    <div className={`mb-7 flex items-center gap-3.5 ${className}`}>
      <span className="h-8 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-leaf-400 to-leaf-700" />
      <h2 className="display text-[clamp(20px,2.8vw,28px)] text-ink">{children}</h2>
    </div>
  );
}
