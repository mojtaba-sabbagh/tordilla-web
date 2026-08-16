import type { FeatureItem } from "@/lib/health-pillars";

type HealthPillarsProps = {
  items: FeatureItem[];
  className?: string;
  variant?: "raised" | "flat";
};

const accents = [
  {
    ring: "ring-leaf-100",
    halo: "bg-leaf-50",
    bar: "from-leaf-400 to-leaf-600",
    text: "text-leaf-700",
    glow: "bg-leaf-300/35",
  },
  {
    ring: "ring-corn-200",
    halo: "bg-corn-100",
    bar: "from-corn-300 to-corn-500",
    text: "text-corn-700",
    glow: "bg-corn-300/40",
  },
  {
    ring: "ring-paprika-100",
    halo: "bg-paprika-100",
    bar: "from-paprika-300 to-paprika-500",
    text: "text-paprika-600",
    glow: "bg-paprika-200/45",
  },
];

export function HealthPillars({ items, className = "", variant = "raised" }: HealthPillarsProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className={`grid gap-4 sm:grid-cols-3 sm:gap-5 ${className}`}>
      {items.map((item, index) => {
        const accent = accents[index % accents.length];
        return (
          <div
            key={item.title ?? index}
            className={`group relative overflow-hidden rounded-card-lg bg-surface p-7 text-center ring-1 ${accent.ring} ${
              variant === "raised" ? "shadow-lift" : "shadow-soft"
            } transition-all duration-400 hover:-translate-y-1.5`}
          >
            <span
              className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${accent.bar}`}
              aria-hidden
            />
            <span
              className={`pointer-events-none absolute -bottom-16 start-1/2 h-40 w-40 -translate-x-1/2 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${accent.glow} opacity-0`}
              aria-hidden
            />

            <span
              className={`relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full text-[30px] ${accent.halo} transition-transform duration-400 group-hover:scale-110`}
            >
              {item.icon}
            </span>

            <h3 className={`relative mb-2 text-[17px] font-black tracking-tight ${accent.text}`}>
              {item.title}
            </h3>
            <p className="relative text-[13px] leading-[1.95] text-ink-mute">{item.desc}</p>
          </div>
        );
      })}
    </div>
  );
}
