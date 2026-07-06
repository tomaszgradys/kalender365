/* eslint-disable @next/next/no-img-element */
// Kalender365 wordmark: calendar mark (SVG) + real HTML text so the font never
// mismatches (SVG loaded as <img> doesn't pick up web fonts).
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
      <span className={`font-extrabold leading-none tracking-tight ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>
        <span className="text-navy-600">Kalender</span>
        <span className="text-brand-green-600">365</span>
      </span>
    </span>
  );
}
