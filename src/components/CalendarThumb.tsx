import Image from "next/image";
import type { ThumbKey } from "@/lib/calendars";
import { GENERATED_THUMBS } from "@/lib/generatedThumbs";

// Kompaktowa, czytelna miniatura kalendarza: spójna „ramka kalendarza"
// (nagłówek z kółkami spinacza) + wyrazisty motyw. Lekka, skalowalna, szybka.

const MOTIF: Record<ThumbKey, { glyph: string; accent: string }> = {
  year: { glyph: "📅", accent: "#4f46e5" },
  month: { glyph: "🗓️", accent: "#4f46e5" },
  day: { glyph: "📆", accent: "#4f46e5" },
  print: { glyph: "🖨️", accent: "#0f766e" },
  week: { glyph: "#️⃣", accent: "#0891b2" },
  freedays: { glyph: "🏖️", accent: "#ea580c" },
  holidays: { glyph: "🎊", accent: "#dc2626" },
  party: { glyph: "🎉", accent: "#db2777" },
  easter: { glyph: "🥚", accent: "#d97706" },
  shopping: { glyph: "🛒", accent: "#16a34a" },
  moon: { glyph: "🌙", accent: "#6366f1" },
  garden: { glyph: "🌱", accent: "#16a34a" },
  fish: { glyph: "🐟", accent: "#0891b2" },
  seasons: { glyph: "🍂", accent: "#ca8a04" },
  clock: { glyph: "🕐", accent: "#7c3aed" },
  sun: { glyph: "🌅", accent: "#f59e0b" },
  zodiac: { glyph: "♌", accent: "#7c3aed" },
  school: { glyph: "🎒", accent: "#2563eb" },
  snow: { glyph: "❄️", accent: "#0ea5e9" },
  cake: { glyph: "🎂", accent: "#e11d48" },
  counter: { glyph: "⏳", accent: "#0d9488" },
  weekday: { glyph: "❓", accent: "#64748b" },
  name: { glyph: "🏷️", accent: "#4f46e5" },
};

export default function CalendarThumb({
  thumb,
  slug,
  alt,
  className = "",
  size = 96,
}: {
  thumb: ThumbKey;
  slug?: string;
  /** Opis miniatury dla SEO/dostępności (np. nazwa kalendarza). */
  alt?: string;
  className?: string;
  size?: number;
}) {
  const { glyph } = MOTIF[thumb];
  const w = size;
  const h = Math.round(size * 0.82);
  const NAVY = "#033c93";
  const altText = alt ? `${alt} — miniatura kalendarza` : "Miniatura kalendarza";

  // Jeśli istnieje wygenerowana miniaturka obrazkowa — użyj jej (next/image →
  // Vercel serwuje zoptymalizowany WebP/AVIF w rozmiarze wyświetlania); inaczej SVG.
  if (slug && GENERATED_THUMBS.includes(slug)) {
    return (
      <Image
        src={`/thumbs/${slug}.jpg`}
        alt={altText}
        width={w}
        height={w}
        sizes={`${w}px`}
        className={`rounded-xl object-cover ${className}`}
      />
    );
  }

  return (
    <svg viewBox="0 0 120 98" width={w} height={h} className={className} role="img" aria-label={altText}>
      <title>{altText}</title>
      {/* karta */}
      <rect x="8" y="11" width="104" height="81" rx="13" fill="#ffffff" stroke="#dbe3f2" strokeWidth="2" />
      {/* nagłówek granatowy */}
      <path d="M8 24 a13 13 0 0 1 13 -13 h78 a13 13 0 0 1 13 13 v4 H8 Z" fill={NAVY} />
      {/* kółka spinacza */}
      <rect x="33" y="4" width="6" height="15" rx="3" fill={NAVY} />
      <rect x="81" y="4" width="6" height="15" rx="3" fill={NAVY} />
      {/* motyw */}
      <text x="60" y="67" fontSize="42" textAnchor="middle" dominantBaseline="middle">
        {glyph}
      </text>
    </svg>
  );
}
