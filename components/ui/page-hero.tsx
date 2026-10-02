import { SectionBadge } from "./section-badge";

type PageHeroProps = {
  badge?: string;
  title: string;
  text?: string;
  waveColor?: string;
};

export function PageHero({
  badge,
  title,
  text,
  waveColor = "#fbf8f1",
}: PageHeroProps) {
  return (
    <>
      <section className="grain relative overflow-hidden bg-leaf-800 px-4 pb-20 pt-16 text-center text-white md:px-6 md:pb-24 md:pt-20">
        {/* low warm light behind the heading, like sun low over a field */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/2 top-[58%] h-[30rem] w-[30rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-corn-400/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/2 h-[10rem] w-[44rem] -translate-x-1/2 rounded-full bg-corn-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-3xl">
          {badge && (
            <SectionBadge tone="invert" className="mb-6">
              {badge}
            </SectionBadge>
          )}

          <h1 className="display text-balance mb-4 text-[clamp(2rem,5vw,3.4rem)] text-white">
            {title}
          </h1>

          {text && (
            <p className="text-balance mx-auto max-w-xl text-[15px] leading-[2.05] text-leaf-100/85">
              {text}
            </p>
          )}
        </div>
      </section>

      <div className="hill-divider -mt-px">
        <svg viewBox="0 0 1200 70" preserveAspectRatio="none" className="block h-[46px] w-full md:h-[64px]">
          <path d="M0,18 C240,72 420,72 640,36 C840,4 1010,4 1200,42 L1200,70 L0,70 Z" fill={waveColor} />
        </svg>
      </div>
    </>
  );
}
