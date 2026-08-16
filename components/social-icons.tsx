type IconProps = { className?: string };

export function InstagramIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 107.47 107.47" fill="white">
      <path d="M82.58,40.58A15.71,15.71,0,0,0,66.89,24.89H40.58a15.72,15.72,0,0,0-15.7,15.69V66.89a15.72,15.72,0,0,0,15.7,15.69H66.89A15.71,15.71,0,0,0,82.58,66.89ZM72.77,30.23A4.47,4.47,0,1,1,68.3,34.7,4.47,4.47,0,0,1,72.77,30.23Zm-19,40.67A17.17,17.17,0,1,1,70.9,53.73,17.18,17.18,0,0,1,53.73,70.9Z" />
      <path d="M53.73,41.77a12,12,0,1,0,12,12A12,12,0,0,0,53.73,41.77Z" />
      <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM87.66,66.89A20.8,20.8,0,0,1,66.89,87.66H40.58A20.8,20.8,0,0,1,19.8,66.89V40.58A20.8,20.8,0,0,1,40.58,19.8H66.89A20.8,20.8,0,0,1,87.66,40.58Z" />
    </svg>
  );
}

export function TwitterIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 107.47 107.47" fill="white">
      <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM82.37,40.55a15.28,15.28,0,0,1-3.16,2.65l0,0C78.6,61.32,66.46,79.8,45,80.93c-8.1.43-15.56-2.87-21.36-7.65a23,23,0,0,0,6.57,1,19.66,19.66,0,0,0,12-4.37s-12-3.32-11.72-8.9l5.75-.17a18.12,18.12,0,0,1-5.69-2.95c-3.46-3.12-5.46-7.46-4.47-9.89a7.41,7.41,0,0,0,2.32,1.13,10.73,10.73,0,0,0,3.27.54S28.06,47.09,27,44.25c-1.62-4.42-.8-10.06.81-11.76,0,0,.64,3.58,10.85,8.75,5.18,2.63,11,4.49,15.53,4.61a16.67,16.67,0,0,1-.52-4.2c0-6.16,5.71-11.15,12.76-11.15a13.54,13.54,0,0,1,9.84,4L79.68,33l4-1.72h0s.21.24,0,.85c-.41,1.45-3.59,4.54-4.84,5.54l0,.26a8.19,8.19,0,0,0,2.42-.32c1.35-.37,4.57-1.77,4.57-1.77A22.44,22.44,0,0,1,82.37,40.55Z" />
    </svg>
  );
}

export function FacebookIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 107.47 107.47" fill="white">
      <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0ZM71.82,30.46H65.27c-5.15,0-6.14,2.44-6.14,6V44.4H71.39l-1.6,12.39H59.13V88.57H46.34V56.79H35.64V44.4h10.7V35.27c0-10.6,6.47-16.37,15.93-16.37a88.45,88.45,0,0,1,9.55.48Z" />
    </svg>
  );
}

export function AparatIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 107.47 107.47" fill="white">
      <circle cx="45.33" cy="41.28" r="8.18" transform="translate(-15.92 44.14) rotate(-45)" />
      <path d="M57.46,54a3.82,3.82,0,1,0-3.81,3.82A3.82,3.82,0,0,0,57.46,54Z" />
      <circle cx="61.68" cy="66.91" r="8.18" transform="translate(-29.25 63.21) rotate(-45)" />
      <circle cx="41.05" cy="62.95" r="8.18" transform="translate(-32.49 47.47) rotate(-45)" />
      <circle cx="65.74" cy="45.03" r="8.18" transform="translate(-8.59 16.31) rotate(-13.28)" />
      <path d="M53.73,0a53.74,53.74,0,1,0,53.74,53.73A53.74,53.74,0,0,0,53.73,0Zm-25,29.55A13.55,13.55,0,0,1,45.4,20.1l5.43,1.5A32.27,32.27,0,0,0,27,35.65Zm.56,48.72a13.59,13.59,0,0,1-9.45-16.71l1.7-6.12A32.23,32.23,0,0,0,34.68,79.77Zm49.51-.35a13.59,13.59,0,0,1-16.71,9.45l-5.42-1.51a32.21,32.21,0,0,0,23.82-14Zm-25,4.67A28.86,28.86,0,1,1,82.59,53.73,28.86,28.86,0,0,1,53.73,82.59ZM87.65,45.91,86,52A32.26,32.26,0,0,0,72.79,27.69L78.2,29.2A13.56,13.56,0,0,1,87.65,45.91Z" />
    </svg>
  );
}

const socialLinks = [
  { key: "instagram", href: "https://instagram.com/tordillachips/", Icon: InstagramIcon },
  { key: "twitter", href: "https://twitter.com/tordillachips", Icon: TwitterIcon },
  { key: "facebook", href: "https://www.facebook.com/tordillachips", Icon: FacebookIcon },
  { key: "aparat", href: "https://www.aparat.com/tordilla.chips", Icon: AparatIcon },
] as const;

type SocialLinksRowProps = {
  labels: { instagram: string; twitter: string; facebook: string; aparat: string };
  size?: "md" | "lg";
};

export function SocialLinksRow({ labels, size = "lg" }: SocialLinksRowProps) {
  const dimension = size === "lg" ? "h-16 w-16 md:h-[68px] md:w-[68px]" : "h-12 w-12";

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-5">
      {socialLinks.map(({ key, href, Icon }) => (
        <a
          key={key}
          aria-label={labels[key]}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`group inline-flex items-center justify-center rounded-full bg-white/10 p-1.5 ring-1 ring-white/15 transition-all duration-300 hover:-translate-y-1 hover:bg-corn-400/20 hover:ring-corn-300/60 ${dimension}`}
        >
          <Icon className="h-full w-full opacity-85 transition-opacity duration-300 group-hover:opacity-100" />
        </a>
      ))}
    </div>
  );
}

type SocialSectionProps = {
  heading: string;
  labels: SocialLinksRowProps["labels"];
  className?: string;
};

export function SocialSection({ heading, labels, className = "" }: SocialSectionProps) {
  return (
    <div
      className={`grain relative overflow-hidden rounded-card-lg bg-leaf-800 px-6 py-12 text-center ${className}`}
    >
      <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-leaf-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -right-10 h-64 w-64 rounded-full bg-corn-500/15 blur-3xl" />
      <h3 className="relative mb-7 text-xl font-black text-white md:text-2xl">{heading}</h3>
      <div className="relative">
        <SocialLinksRow labels={labels} />
      </div>
    </div>
  );
}
