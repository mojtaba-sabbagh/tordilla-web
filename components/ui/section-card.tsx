type SectionCardProps = {
  children: React.ReactNode;
  className?: string;
};

export function SectionCard({ children, className = "" }: SectionCardProps) {
  return (
    <div className={`rounded-[26px] bg-white p-7 shadow-[0_8px_32px_rgba(206,74,40,0.07)] md:p-10 ${className}`}>
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
    <div className={`mb-6 flex items-center gap-3 ${className}`}>
      <span className="h-9 w-1.5 flex-shrink-0 rounded-full bg-gradient-to-b from-[#8f2e18] to-[#ce4a28]" />
      <h2 className="text-[clamp(20px,2.8vw,28px)] font-black text-[#2c1810]">{children}</h2>
    </div>
  );
}
