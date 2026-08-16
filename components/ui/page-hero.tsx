import Image from "next/image";
import { SectionBadge } from "./section-badge";

type PageHeroProps = {
  badge?: string;
  title: string;
  text?: string;
  showLogo?: boolean;
  logoAlt?: string;
  waveColor?: string;
};

export function PageHero({
  badge,
  title,
  text,
  showLogo = true,
  logoAlt = "Tordilla logo",
  waveColor = "#fbf8f1",
}: PageHeroProps) {
  return (
    <>
      <section className="grain relative overflow-hidden bg-leaf-800 px-4 pb-20 pt-16 text-center md:px-6 md:pb-24 md:pt-20">
        {/* ambient light */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[28rem] w-[28rem] -translate-x-1/2 rounded-full bg-leaf-500/40 blur-3xl" />
          <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-corn-500/20 blur-3xl" />
          <div className="absolute -right-16 top-4 h-72 w-72 rounded-full bg-paprika-500/15 blur-3xl" />
        </div>

        {/* seed-grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.13]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />

        <div className="relative mx-auto max-w-3xl">
          {badge && (
            <SectionBadge tone="invert" className="mb-6">
              {badge}
            </SectionBadge>
          )}

          {showLogo && (
            <div className="mb-7 flex justify-center">
              <div className="relative">
                <span className="absolute inset-0 rounded-full border border-white/25 animate-pulse-ring" />
                <div className="relative flex h-[124px] w-[124px] items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-sm">
                  <Image
                    src="/home/logo.png"
                    alt={logoAlt}
                    width={92}
                    height={92}
                    className="object-contain drop-shadow-[0_10px_24px_rgba(0,0,0,0.3)]"
                    priority
                  />
                </div>
              </div>
            </div>
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
