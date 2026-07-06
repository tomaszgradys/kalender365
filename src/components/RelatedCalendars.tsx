import Link from "next/link";
import { CALENDAR_TYPES, nowCtx, type DateCtx, type CalendarType } from "@/lib/calendars";
import CalendarThumb from "@/components/CalendarThumb";

// Sekcja „Przydatne również" — linkowanie wewnętrzne między kalendarzami.
// TOPICAL: najpierw siostry z tej samej kategorii (klaster tematyczny), potem
// uzupełnienie popularnymi. Wzmacnia sygnały topical authority — strona o księżycu
// linkuje inne kalendarze księżycowe, strona o świętach — inne o świętach itd.
export default function RelatedCalendars({
  exclude = [],
  ctx,
  limit = 8,
}: {
  exclude?: string[];
  ctx?: DateCtx;
  limit?: number;
}) {
  const c = ctx ?? nowCtx();
  // Aliasy: slug trasy → slug w CALENDAR_TYPES (gdy się różnią).
  const ALIAS: Record<string, string> = { swieta: "kalendarz-swiat", imieniny: "kalendarz-imienin" };
  const ex = exclude.map((s) => ALIAS[s] ?? s);
  const pool = CALENDAR_TYPES.filter((t) => !ex.includes(t.slug));
  // Kategorię bieżącej strony wyznaczamy po sluga przekazanym w `exclude`.
  const current = CALENDAR_TYPES.find((t) => ex.includes(t.slug));
  let items: CalendarType[];
  if (current) {
    const seen = new Set<string>();
    const push = (arr: CalendarType[]) => arr.filter((t) => !seen.has(t.slug) && seen.add(t.slug));
    const sameCat = push(pool.filter((t) => t.category === current.category));
    const popularOther = push(pool.filter((t) => t.popular));
    const rest = push(pool);
    items = [...sameCat, ...popularOther, ...rest].slice(0, limit);
  } else {
    // Strony bez kategorii (np. huby) → popularne kalendarze, uzupełnione resztą.
    const popular = pool.filter((t) => t.popular);
    const rest = pool.filter((t) => !t.popular);
    items = [...popular, ...rest].slice(0, limit);
  }

  return (
    <section
      className="no-print mt-12 border-t border-slate-100 pt-8"
      style={{ contentVisibility: "auto", containIntrinsicSize: "0 320px" }}
    >
      <h2 className="mb-4 text-lg font-bold text-navy-800">Przydatne również</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((t) => (
          <Link
            key={t.slug}
            href={t.href(c)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
          >
            <CalendarThumb thumb={t.thumb} slug={t.slug} alt={t.label} size={40} />
            <span className="text-sm font-semibold text-navy-800">{t.label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
