/* eslint-disable @next/next/no-img-element */

// Logo = znak kalendarza (SVG, bez tekstu) + wordmark jako PRAWDZIWY tekst HTML.
// Wcześniej całe logo było SVG z <text> w foncie Inter — a SVG ładowane jako <img>
// nie wczytuje web-fontów, więc przeglądarka podstawiała inny font i „kalendarz"
// oraz „.pro" się rozjeżdżały. Tekstem HTML mamy zawsze idealne proporcje.
export default function Logo({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <img
        src="/brand/svg/mark-calendar.svg"
        alt=""
        aria-hidden="true"
        width={36}
        height={36}
        className={compact ? "h-7 w-7" : "h-8 w-8 md:h-9 md:w-9"}
      />
      <span
        className={`font-extrabold leading-none tracking-tight ${compact ? "text-lg" : "text-xl md:text-2xl"}`}
      >
        <span className="text-navy-600">kalendarz</span>
        <span className="text-brand-green-600">.pro</span>
      </span>
    </span>
  );
}

export function LogoMark({ className = "", size = 32 }: { className?: string; size?: number }) {
  return (
    <img
      src="/brand/svg/mark-calendar.svg"
      alt="kalendarz.pro"
      width={size}
      height={size}
      className={className}
    />
  );
}
