import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PRERENDER_YEARS, parseYear, isIndexableYear } from "@/lib/de/year";
import { berlinNow, berlinToday } from "@/lib/de/now";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";
import {
  getBesondereTage,
  ANLASS_KATEGORIE_LABEL,
  type AnlassKategorie,
  type BesondererTagInstance,
} from "@/lib/de/besondereTage";
import EventArt from "@/components/de/EventArt";
import ModuleHero from "@/components/de/ModuleHero";
import { MODULE_HERO, heroSrc } from "@/lib/de/heroes";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { serializeJsonLd, breadcrumbLd } from "@/lib/de/jsonLd";
import { SITE_URL } from "@/lib/de/site";

export function generateStaticParams() {
  return PRERENDER_YEARS.map((y) => ({ year: String(y) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return {};
  return {
    title: `Besondere Tage ${y} – Muttertag, Vatertag, Karneval & Advent`,
    description: `Alle wichtigen Anlässe ${y} auf einen Blick: Muttertag, Vatertag, Karneval (Rosenmontag, Weiberfastnacht), Advent, Nikolaus, Halloween, Silvester & mehr – mit Datum und Wochentag.`,
    alternates: { canonical: `/besondere-tage/${y}` },
    ...(isIndexableYear(y) ? {} : { robots: { index: false, follow: true } }),
  };
}

const ORDER: AnlassKategorie[] = ["karneval", "familie", "brauchtum", "kirchlich", "advent"];

function daysBetween(aIso: string, bIso: string): number {
  return Math.round((Date.parse(`${aIso}T00:00:00Z`) - Date.parse(`${bIso}T00:00:00Z`)) / 86400000);
}
function relLabel(days: number): string {
  if (days === 0) return "heute";
  if (days === 1) return "morgen";
  if (days > 0) return `in ${days} Tagen`;
  if (days === -1) return "gestern";
  return `vor ${Math.abs(days)} Tagen`;
}

export default async function BesondereTagePage({ params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) notFound();

  const all = getBesondereTage(y);
  const today = berlinToday().toISOString().slice(0, 10);
  const thisYear = berlinNow().year;

  // Nächster Anlass (nur sinnvoll fürs laufende Jahr).
  const next = y === thisYear ? all.find((e) => daysBetween(e.iso, today) >= 0) ?? null : null;

  const byKat = new Map<AnlassKategorie, BesondererTagInstance[]>();
  for (const e of all) {
    const list = byKat.get(e.kategorie) ?? [];
    list.push(e);
    byKat.set(e.kategorie, list);
  }

  const faq = [
    {
      q: `Welche besonderen Tage gibt es ${y} in Deutschland?`,
      a: `Zu den wichtigsten nicht-gesetzlichen Anlässen ${y} zählen Karneval (Weiberfastnacht, Rosenmontag, Aschermittwoch), Valentinstag, Muttertag, Vatertag, Halloween, die vier Adventssonntage, Nikolaus, Heiligabend und Silvester.`,
    },
    {
      q: "Sind das gesetzliche Feiertage?",
      a: "Nein. Diese Tage sind kulturell bedeutsam, aber überwiegend keine gesetzlichen Feiertage – sie reduzieren die Arbeitstage nicht. Eine Ausnahme ist der Vatertag, der stets auf den Feiertag Christi Himmelfahrt fällt. Die echten gesetzlichen Feiertage finden Sie unter Feiertage.",
    },
    {
      q: "Wann ist Muttertag und wann Vatertag?",
      a: `${y} ist Muttertag am ${formatLongDE(all.find((e) => e.slug === "muttertag")!.iso)} (zweiter Sonntag im Mai) und Vatertag am ${formatLongDE(all.find((e) => e.slug === "vatertag")!.iso)} (Christi Himmelfahrt).`,
    },
  ];

  const breadcrumb = breadcrumbLd(
    [
      { name: "Start", url: "/" },
      { name: `Besondere Tage ${y}`, url: `/besondere-tage/${y}` },
    ],
    SITE_URL,
  );

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />

        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Besondere Tage {y}</span>
        </nav>

        <ModuleHero src={heroSrc(MODULE_HERO, "besondere-tage")} alt={`Besondere Tage ${y}`} motif="kalender" uid="hero-besondere" className="h-40 w-full sm:h-52" priority />

        <h1 className="mt-5 text-2xl font-black text-navy-800 sm:text-3xl">Besondere Tage {y}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Alle wichtigen Anlässe {y} auf einen Blick – von Karneval über Muttertag und Vatertag bis zu Advent,
          Nikolaus und Silvester. Diese Tage sind kulturell bedeutsam, aber keine{" "}
          <Link href={`/feiertage/${y}`} className="font-medium text-navy-600 hover:underline">gesetzlichen Feiertage</Link>.
        </p>

        {next && (
          <div className="mt-5 flex items-center gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50/50 p-4">
            <div className="hidden shrink-0 sm:block">
              <EventArt motif={next.motif} uid={`next-${next.slug}`} className="h-20 w-32" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-brand-green-700">Nächster Anlass</div>
              <Link href={`/besondere-tage/${y}/${next.slug}`} className="text-lg font-bold text-navy-800 hover:text-navy-600">
                {next.emoji} {next.name}
              </Link>
              <div className="text-sm text-slate-600">
                {weekdayDE(next.iso)}, {formatLongDE(next.iso)} · <strong>{relLabel(daysBetween(next.iso, today))}</strong>
              </div>
            </div>
          </div>
        )}

        {ORDER.filter((k) => byKat.has(k)).map((kat) => (
          <section key={kat} className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-navy-800">{ANLASS_KATEGORIE_LABEL[kat]}</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {byKat.get(kat)!.map((e) => {
                const rel = y === thisYear ? daysBetween(e.iso, today) : null;
                return (
                  <Link
                    key={e.slug}
                    href={`/besondere-tage/${y}/${e.slug}`}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
                  >
                    <EventArt motif={e.motif} uid={`card-${e.slug}`} className="h-24 w-full" rounded={false} />
                    <div className="p-4">
                      <div className="font-bold text-navy-800">{e.emoji} {e.name}</div>
                      <div className="mt-0.5 text-sm text-slate-600">
                        {weekdayDE(e.iso)}, {formatLongDE(e.iso)}
                        {e.endIso && <> – {formatLongDE(e.endIso)}</>}
                      </div>
                      {rel !== null && rel >= 0 && (
                        <div className="mt-1 inline-block rounded-full bg-navy-50 px-2 py-0.5 text-xs font-semibold text-navy-700">{relLabel(rel)}</div>
                      )}
                      {e.regionNote && <div className="mt-1 text-xs text-slate-400">{e.regionNote}</div>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}

        <section className="mt-10 rounded-2xl border border-slate-200 bg-navy-50/40 p-5">
          <h2 className="text-lg font-bold text-navy-800">Passend dazu</h2>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link href={`/feiertage/${y}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">🎉 Feiertage {y}</Link>
            <Link href={`/brueckentage/${y}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">🌉 Brückentage {y}</Link>
            <Link href="/namenstage" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">📛 Namenstage</Link>
            <Link href="/bauernregeln" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">🌾 Bauernregeln</Link>
            <Link href="/wie-viele-tage-bis" className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">⏳ Countdowns</Link>
          </div>
        </section>

        <SeoProse
          blocks={[
            {
              h2: `Wichtige Anlässe ${y} – Brauchtum statt Feiertag`,
              p: [
                `Nicht jeder wichtige Tag im Jahr ist ein gesetzlicher Feiertag. Karneval, Muttertag, Vatertag, Halloween oder die Adventssonntage prägen den deutschen Jahreslauf stark, gelten arbeitsrechtlich aber als normale Tage. Diese Übersicht ${y} zeigt die Termine mit Datum und Wochentag – für die Planung von Feiern, Geschenken und Ausflügen.`,
                `Viele dieser Anlässe sind beweglich: Der Karneval hängt vom Osterdatum ab, Muttertag fällt auf den zweiten Sonntag im Mai, der erste Advent auf den vierten Sonntag vor Weihnachten. Über die Bundesland-Auswahl auf der Feiertagsseite sehen Sie zusätzlich, welche Tage in Ihrer Region tatsächlich arbeitsfrei sind.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </div>
  );
}
