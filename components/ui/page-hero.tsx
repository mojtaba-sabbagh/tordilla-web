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
  waveColor = "#fdf8f3",
}: PageHeroProps) {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-br from-[#ce4a28] to-[#7a2412] px-4 py-16 text-center md:px-6 md:py-20">
        <div className="pointer-events-none absolute -left-20 -top-20 h-80 w-80 rounded-full bg-white/5" />
        <div className="pointer-events-none absolute -bottom-24 -right-14 h-96 w-96 rounded-full bg-white/[0.04]" />

        <div className="relative">
          {badge && (
            <SectionBadge tone="invert" className="mb-5">
              {badge}
            </SectionBadge>
          )}
          <h1 className="mb-4 text-[clamp(1.9rem,5vw,3.4rem)] font-black text-white">{title}</h1>
          {text && <p className="mx-auto mb-8 max-w-xl text-base leading-[2] text-white/80">{text}</p>}
          {showLogo && (
            <div className="flex justify-center">
              <div className="flex h-[148px] w-[148px] items-center justify-center rounded-full border-2 border-white/20 bg-white/10 backdrop-blur">
                <Image src="/home/logo.png" alt={logoAlt} width={108} height={108} className="object-contain" priority />
              </div>
            </div>
          )}
        </div>
      </section>

      <div className="-mt-0.5 block w-full leading-[0]">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" className="block h-[52px] w-full">
          <path d="M0,0 C300,60 900,60 1200,0 L1200,60 L0,60 Z" fill={waveColor} />
        </svg>
      </div>
    </>
  );
}
