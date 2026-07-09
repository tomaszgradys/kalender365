import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { formatFullDE, formatLongDE, MONTH_SLUGS_DE, MONTH_NAMES_DE } from "@/lib/de/locale";
import { isoWeekOf, berlinNow } from "@/lib/de/now";
import { getAllFeiertage } from "@/lib/de/feiertage";
import { getMoonPhaseInstants } from "@/lib/de/moonPhases";
import { getSunTimes, DEFAULT_LOCATION } from "@/lib/de/sun";
import { isNavigableYear } from "@/lib/de/year";
import { getNamenstage } from "@/lib/de/namenstage";
import { getBauernregel } from "@/lib/de/bauernregeln";
import { sternzeichenByDate } from "@/lib/de/sternzeichen";
import { getAnlaesseAmTag } from "@/lib/de/besondereTage";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}
function parseDate(raw: string): { y: number; m0: number; d: number; iso: string } | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(raw);
  if (!m) return null;
  const y = Number(m[1]);
  const m0 = Number(m[2]) - 1;
  const d = Number(m[3]);
  if (y < 1900 || y > 2100 || m0 < 0 || m0 > 11) return null;
  const dim = new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
  if (d < 1 || d > dim) return null;
  return { y, m0, d, iso: `${y}-${pad(m0 + 1)}-${pad(d)}` };
}

// Prerender the current year's days; other dates render on-demand (ISR).
export function generateStaticParams() {
  const y = new Date().getUTCFullYear();
  const out: { date: string }[] = [];
  for (let m0 = 0; m0 < 12; m0++) {
    const dim = new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
    for (let d = 1; d <= dim; d++) out.push({ date: `${y}-${pad(m0 + 1)}-${pad(d)}` });
  }
  return out;
}

export const revalidate = 86400;

export async function generateMetadata({ params }: { params: Promise<{ date: string }> }): Promise<Metadata> {
  const { date } = await params;
  const p = parseDate(date);
  if (!p) return {};
  return {
    title: `Kalenderblatt ${formatLongDE(p.iso)} – Tag, KW, Feiertag & Mond`,
    description: `Kalenderblatt für den ${formatFullDE(p.iso)}: Kalenderwoche, Tag des Jahres, Feiertage, Mondphase sowie Sonnenauf- und -untergang.`,
    alternates: { canonical: `/kalenderblatt/${p.iso}` },
    ...(isNavigableYear(p.y) ? {} : { robots: { index: false, follow: true } }),
  };
}

export default async function KalenderblattPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  const p = parseDate(date);
  if (!p) notFound();

  const { isoYear, week } = isoWeekOf(p.y, p.m0, p.d);
  const doy = Math.floor((Date.UTC(p.y, p.m0, p.d) - Date.UTC(p.y, 0, 1)) / 86400000) + 1;
  const totalDays = (Date.UTC(p.y, 11, 31) - Date.UTC(p.y, 0, 1)) / 86400000 + 1;
  const feiertag = getAllFeiertage(p.y).find((h) => h.date === p.iso);
  const moon = getMoonPhaseInstants(p.y).find((m) => m.date === p.iso) ?? null;
  const sun = getSunTimes(p.y, p.m0, p.d);
  const namen = getNamenstage(p.m0, p.d);
  const regel = getBauernregel(p.m0, p.d);
  const zodiac = sternzeichenByDate(p.m0, p.d);
  const anlaesse = getAnlaesseAmTag(p.y, p.iso);
  const mmdd = `${pad(p.m0 + 1)}-${pad(p.d)}`;

  const prevDate = new Date(Date.UTC(p.y, p.m0, p.d - 1)).toISOString().slice(0, 10);
  const nextDate = new Date(Date.UTC(p.y, p.m0, p.d + 1)).toISOString().slice(0, 10);
  const monthSlug = `${MONTH_SLUGS_DE[p.m0]}-${p.y}`;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-3xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href={`/kalender/${monthSlug}`} className="hover:text-navy-600">{MONTH_NAMES_DE[p.m0]} {p.y}</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Kalenderblatt</span>
        </nav>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <div className="text-sm font-semibold uppercase tracking-widest text-brand-green-600">{formatFullDE(p.iso).split(",")[0]}</div>
          <div className="mt-1 text-6xl font-black text-navy-800">{p.d}</div>
          <div className="mt-1 text-lg font-bold text-navy-700">{MONTH_NAMES_DE[p.m0]} {p.y}</div>
          {feiertag && (
            <div className="mt-3 inline-block rounded-full bg-brand-green-50 px-3 py-1 text-sm font-semibold text-brand-green-700">
              🎉 {feiertag.name}{feiertag.scope !== "national" && <span className="font-normal"> · {feiertag.states.join(", ")}</span>}
            </div>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { k: "Kalenderwoche", v: `KW ${week}`, href: `/kalenderwochen/${isoYear}` },
            { k: "Tag des Jahres", v: `${doy}. / ${totalDays}` },
            { k: "Rest des Jahres", v: `${totalDays - doy} Tage` },
            { k: "Wochentag", v: formatFullDE(p.iso).split(",")[0] },
          ].map((s) => (
            <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-4 text-center">
              <div className="text-lg font-black text-navy-800">{s.href ? <Link href={s.href} className="hover:text-navy-600">{s.v}</Link> : s.v}</div>
              <div className="mt-0.5 text-xs text-slate-500">{s.k}</div>
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">☀️ Sonne ({DEFAULT_LOCATION.name})</h2>
            <p className="mt-1 text-sm text-slate-600">Aufgang: <strong className="text-navy-800">{sun.sunrise ?? "—"}</strong> · Untergang: <strong className="text-navy-800">{sun.sunset ?? "—"}</strong></p>
            <p className="text-sm text-slate-500">Tageslänge: {sun.dayLengthText}</p>
            <Link href="/sonnenaufgang-sonnenuntergang" className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Andere Städte →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">🌙 Mond</h2>
            {moon ? (
              <p className="mt-1 text-sm text-slate-600">
                {moon.icon} <strong className="text-navy-800">{moon.label}</strong> um {moon.time} Uhr · {moon.zodiacSymbol} {moon.zodiacSign}
                {moon.blueMoon && <span className="ml-1 rounded-full bg-brand-green-100 px-2 py-0.5 text-[10px] font-bold text-brand-green-700">Blue Moon</span>}
              </p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Keine Hauptmondphase an diesem Tag.</p>
            )}
            <Link href={`/mondphasen/${p.y}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Alle Mondphasen {p.y} →</Link>
          </div>
        </div>

        {anlaesse.length > 0 && (
          <div className="mt-4 rounded-2xl border border-brand-green-100 bg-brand-green-50/50 p-4">
            <h2 className="text-sm font-bold text-navy-700">✨ Anlässe an diesem Tag</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {anlaesse.map((a) => (
                <Link key={a.slug} href={`/besondere-tage/${p.y}/${a.slug}`} className="rounded-full border border-brand-green-200 bg-white px-3 py-1 text-sm font-medium text-brand-green-700 hover:border-brand-green-400">
                  {a.emoji} {a.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">📛 Namenstag</h2>
            {namen.length ? (
              <p className="mt-1 text-sm text-slate-700">{namen.join(", ")}</p>
            ) : (
              <p className="mt-1 text-sm text-slate-500">Kein Eintrag.</p>
            )}
            <Link href={`/namenstage/${mmdd}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Alle Namenstage →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">⭐ Sternzeichen</h2>
            <p className="mt-1 text-sm text-slate-700">{zodiac.symbol} {zodiac.name}</p>
            <Link href={`/sternzeichen/${zodiac.slug}`} className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Zum Sternzeichen →</Link>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="text-sm font-bold text-navy-700">🌾 Bauernregel</h2>
            <p className="mt-1 text-sm italic text-slate-700">„{regel}“</p>
            <Link href="/bauernregeln" className="mt-1 inline-block text-xs font-medium text-navy-600 hover:underline">Mehr Bauernregeln →</Link>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/kalenderblatt/${prevDate}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← Vortag</Link>
          <Link href={`/kalenderblatt/${nextDate}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Folgetag →</Link>
          <Link href={`/kalender/${monthSlug}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Monat {MONTH_NAMES_DE[p.m0]} {p.y}</Link>
          <Link href={`/kalender/${p.y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {p.y}</Link>
        </div>
      </div>
    </main>
  );
}
