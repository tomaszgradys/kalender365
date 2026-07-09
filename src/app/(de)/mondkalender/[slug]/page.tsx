import PageWithSidebar from "@/components/de/PageWithSidebar";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NAV_YEARS, isIndexableYear } from "@/lib/de/year";
import { berlinNow } from "@/lib/de/now";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE, WEEKDAY_SHORT_DE, formatLongDE } from "@/lib/de/locale";
import {
  getMondmonat,
  moonSignForDay,
  parseMonthSlug,
  countTage,
  TAG_INFO,
  AKTIVITAET,
  type MondTag,
} from "@/lib/de/mondkalender";
import { getMoonPhaseInstants } from "@/lib/de/moonPhases";
import ModuleHero from "@/components/de/ModuleHero";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { serializeJsonLd, breadcrumbLd } from "@/lib/de/jsonLd";
import { SITE_URL } from "@/lib/de/site";
import { MODULE_HERO, heroSrc } from "@/lib/de/heroes";

const TAG_ORDER: MondTag[] = ["Frucht", "Wurzel", "Blüte", "Blatt"];

export function generateStaticParams() {
  const out: { slug: string }[] = [];
  for (const y of NAV_YEARS) {
    out.push({ slug: String(y) });
    for (const ms of MONTH_SLUGS_DE) out.push({ slug: `${ms}-${y}` });
  }
  return out;
}

type Parsed = { kind: "year"; year: number } | { kind: "month"; year: number; month0: number } | null;
function parse(slug: string): Parsed {
  if (/^\d{4}$/.test(slug)) {
    const y = Number(slug);
    return y >= 1900 && y <= 2100 ? { kind: "year", year: y } : null;
  }
  const m = parseMonthSlug(slug);
  return m ? { kind: "month", year: m.year, month0: m.month0 } : null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = parse(slug);
  if (!p) return {};
  const robots = isIndexableYear(p.year) ? {} : { robots: { index: false, follow: true } };
  if (p.kind === "year") {
    return {
      title: `Mondkalender ${p.year} – Aussaattage & Gärtnern nach dem Mond`,
      description: `Mondkalender ${p.year}: Frucht-, Wurzel-, Blüten- und Blatttage, Mondphasen und Aussaattage Monat für Monat – Gärtnern nach dem Mond.`,
      alternates: { canonical: `/mondkalender/${p.year}` },
      ...robots,
    };
  }
  return {
    title: `Mondkalender ${MONTH_NAMES_DE[p.month0]} ${p.year} – Aussaattage`,
    description: `Aussaatkalender für ${MONTH_NAMES_DE[p.month0]} ${p.year}: Mondzeichen, Frucht-, Wurzel-, Blüten- und Blatttage sowie zu- und abnehmender Mond – Tag für Tag.`,
    alternates: { canonical: `/mondkalender/${MONTH_SLUGS_DE[p.month0]}-${p.year}` },
    ...robots,
  };
}

function TagBadge({ tag }: { tag: MondTag }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold text-white" style={{ backgroundColor: TAG_INFO[tag].farbe }}>
      {tag}tag
    </span>
  );
}

export default async function MondkalenderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = parse(slug);
  if (!p) notFound();

  const legende = (
    <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {TAG_ORDER.map((tag) => (
        <div key={tag} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-full" style={{ backgroundColor: TAG_INFO[tag].farbe }} />
            <span className="font-bold text-navy-800">{tag}tag</span>
            <span className="text-xs text-slate-400">({TAG_INFO[tag].element})</span>
          </div>
          <p className="mt-1 text-sm text-slate-600">{TAG_INFO[tag].kurz}</p>
          <p className="mt-0.5 text-xs text-slate-400">z. B. {TAG_INFO[tag].beispiele}</p>
        </div>
      ))}
    </section>
  );

  /* -------------------- JAHRESÜBERSICHT -------------------- */
  if (p.kind === "year") {
    const y = p.year;
    const now = berlinNow();
    const heute = y === now.year ? { sign: moonSignForDay(now.year, now.month0, now.day), d: now.day, m0: now.month0 } : null;
    const phasen = getMoonPhaseInstants(y).filter((m) => m.type === "full" || m.type === "new");

    const breadcrumb = breadcrumbLd(
      [
        { name: "Start", url: "/" },
        { name: `Mondkalender ${y}`, url: `/mondkalender/${y}` },
      ],
      SITE_URL,
    );
    const faq = [
      { q: "Was ist ein Mondkalender / Aussaatkalender?", a: "Ein Mondkalender ordnet jeden Tag anhand des Tierkreiszeichens, in dem der Mond steht, einem Pflanzentag zu (Frucht, Wurzel, Blüte, Blatt). Gärtnerinnen und Gärtner richten Aussaat, Pflege und Ernte danach aus. Es handelt sich um überliefertes Brauchtum ohne wissenschaftlichen Wirknachweis." },
      { q: "Was bedeuten Frucht-, Wurzel-, Blüten- und Blatttage?", a: "Steht der Mond in einem Feuerzeichen, spricht man von Fruchttagen, in Erdzeichen von Wurzeltagen, in Luftzeichen von Blütentagen und in Wasserzeichen von Blatttagen – passend zum jeweiligen Pflanzenteil." },
      { q: "Was bedeutet zunehmender und abnehmender Mond?", a: "Bei zunehmendem Mond wird traditionell eher gesät und gepflanzt (oberirdisches Wachstum), bei abnehmendem Mond eher geerntet, gejätet und beschnitten." },
    ];

    return (
      <main className="flex-1">
        <PageWithSidebar>
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
          <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
            <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
            <span className="text-navy-700">Mondkalender {y}</span>
          </nav>

          <ModuleHero src={heroSrc(MODULE_HERO, "mondkalender")} alt={`Mondkalender ${y}`} motif="mond" uid="mk-year" className="h-40 w-full sm:h-52" priority />

          <h1 className="mt-5 text-2xl font-black text-navy-800 sm:text-3xl">Mondkalender {y} – Gärtnern nach dem Mond</h1>
          <p className="mt-2 max-w-3xl text-slate-600">
            Aussaattage {y} nach überlieferten Mondkalender-Regeln: An welchen Tagen der Mond in einem Frucht-, Wurzel-,
            Blüten- oder Blattzeichen steht – Monat für Monat. Ergänzt um zu- und abnehmenden Mond.
          </p>

          {heute && (
            <div className="mt-4 flex items-center gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50/50 p-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl text-3xl text-white" style={{ backgroundColor: TAG_INFO[heute.sign.tag].farbe }}>
                {heute.sign.symbol}
              </div>
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-brand-green-700">Heute</div>
                <div className="font-bold text-navy-800">Mond im {heute.sign.name} · <TagBadge tag={heute.sign.tag} /></div>
                <div className="text-sm text-slate-600">{AKTIVITAET[heute.sign.tag]}</div>
              </div>
            </div>
          )}

          {legende}

          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-navy-800">Mondkalender {y} nach Monaten</h2>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
              {MONTH_NAMES_DE.map((mn, m0) => (
                <Link key={m0} href={`/mondkalender/${MONTH_SLUGS_DE[m0]}-${y}`} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm">
                  {mn} {y}
                </Link>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 text-xl font-bold text-navy-800">Neumond & Vollmond {y}</h2>
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500"><tr><th className="px-4 py-2 font-medium">Phase</th><th className="px-4 py-2 font-medium">Datum</th><th className="px-4 py-2 font-medium">Uhrzeit</th><th className="px-4 py-2 font-medium">Zeichen</th></tr></thead>
                <tbody>
                  {phasen.map((m, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-4 py-2 font-medium text-navy-800">{m.icon} {m.label}</td>
                      <td className="px-4 py-2 text-slate-600">{formatLongDE(m.date)}</td>
                      <td className="px-4 py-2 text-slate-600">{m.time} Uhr</td>
                      <td className="px-4 py-2 text-slate-600">{m.zodiacSymbol} {m.zodiacSign}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-sm">
              <Link href={`/vollmond/${y}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">🌕 Vollmond {y}</Link>
              <Link href={`/neumond/${y}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">🌑 Neumond {y}</Link>
              <Link href={`/mondphasen/${y}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 hover:border-navy-300">🌙 Alle Mondphasen {y}</Link>
            </div>
          </section>

          <SeoProse
            blocks={[
              {
                h2: `Gärtnern nach dem Mond – so funktioniert der Mondkalender ${y}`,
                p: [
                  `Der Mondkalender ${y} teilt jeden Tag danach ein, in welchem Tierkreiszeichen der Mond steht. Die zwölf Zeichen gehören zu den vier Elementen Feuer, Erde, Luft und Wasser – und damit zu den vier Pflanzentagen: Fruchttage (Feuer), Wurzeltage (Erde), Blütentage (Luft) und Blatttage (Wasser). An einem Blatttag würde man demnach Salat säen, an einem Wurzeltag Möhren, an einem Fruchttag Tomaten.`,
                  `Zusätzlich unterscheidet man zunehmenden und abnehmenden Mond: Bei zunehmendem Mond wird eher gesät und gepflanzt, bei abnehmendem Mond eher geerntet und geschnitten. Wichtig: Der Mondkalender ist überliefertes Brauchtum – ein wissenschaftlicher Wirknachweis existiert nicht. Viele Gärtnerinnen und Gärtner nutzen ihn dennoch als festen Rhythmus fürs Gartenjahr.`,
                ],
              },
            ]}
          />
          <Faq items={faq} />
        </PageWithSidebar>
      </main>
    );
  }

  /* -------------------- MONATSANSICHT -------------------- */
  const { year: y, month0 } = p;
  const days = getMondmonat(y, month0);
  const counts = countTage(days);
  const prevM0 = (month0 + 11) % 12;
  const prevY = month0 === 0 ? y - 1 : y;
  const nextM0 = (month0 + 1) % 12;
  const nextY = month0 === 11 ? y + 1 : y;

  const breadcrumb = breadcrumbLd(
    [
      { name: "Start", url: "/" },
      { name: `Mondkalender ${y}`, url: `/mondkalender/${y}` },
      { name: `${MONTH_NAMES_DE[month0]} ${y}`, url: `/mondkalender/${MONTH_SLUGS_DE[month0]}-${y}` },
    ],
    SITE_URL,
  );
  const faq = [
    { q: `Welche Aussaattage gibt es im ${MONTH_NAMES_DE[month0]} ${y}?`, a: `Im ${MONTH_NAMES_DE[month0]} ${y} gibt es ${counts.Frucht} Frucht-, ${counts.Wurzel} Wurzel-, ${counts.Blüte} Blüten- und ${counts.Blatt} Blatttage – je nachdem, in welchem Tierkreiszeichen der Mond steht.` },
    { q: "Sind Mondkalender wissenschaftlich belegt?", a: "Nein. Das Gärtnern nach dem Mond ist überliefertes Brauchtum. Kontrollierte Studien konnten keinen belastbaren Effekt nachweisen. Viele nutzen den Kalender dennoch als Orientierung und Rhythmus." },
  ];

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumb) }} />
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href={`/mondkalender/${y}`} className="hover:text-navy-600">Mondkalender {y}</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">{MONTH_NAMES_DE[month0]} {y}</span>
        </nav>

        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Mondkalender {MONTH_NAMES_DE[month0]} {y}</h1>
        <p className="mt-2 max-w-3xl text-slate-600">
          Aussaattage im {MONTH_NAMES_DE[month0]} {y}: Mondzeichen und Pflanzentag für jeden Tag,
          dazu zu- und abnehmender Mond. {counts.Frucht} Frucht-, {counts.Wurzel} Wurzel-, {counts.Blüte} Blüten- und {counts.Blatt} Blatttage.
        </p>

        {legende}

        <section className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 py-2 font-medium">Tag</th>
                <th className="px-3 py-2 font-medium">Mondzeichen</th>
                <th className="px-3 py-2 font-medium">Pflanzentag</th>
                <th className="px-3 py-2 font-medium">Mond</th>
              </tr>
            </thead>
            <tbody>
              {days.map((d) => {
                const we = d.weekdayIdx >= 5;
                return (
                  <tr key={d.iso} className={`border-t border-slate-100 ${we ? "bg-navy-50/30" : ""}`}>
                    <td className="whitespace-nowrap px-3 py-1.5">
                      <Link href={`/kalenderblatt/${d.iso}`} className="font-medium text-navy-800 hover:text-navy-600">{d.day}. {WEEKDAY_SHORT_DE[d.weekdayIdx]}</Link>
                    </td>
                    <td className="px-3 py-1.5 text-slate-600">{d.sign.symbol} {d.sign.name}</td>
                    <td className="px-3 py-1.5"><TagBadge tag={d.sign.tag} /></td>
                    <td className="px-3 py-1.5 text-slate-500">{d.trendLabel}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </section>

        <div className="mt-6 flex flex-wrap gap-2 text-sm">
          <Link href={`/mondkalender/${MONTH_SLUGS_DE[prevM0]}-${prevY}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {MONTH_NAMES_DE[prevM0]} {prevY}</Link>
          <Link href={`/mondkalender/${y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Übersicht {y}</Link>
          <Link href={`/mondkalender/${MONTH_SLUGS_DE[nextM0]}-${nextY}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{MONTH_NAMES_DE[nextM0]} {nextY} →</Link>
          <Link href={`/kalender/${MONTH_SLUGS_DE[month0]}-${y}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Kalender {MONTH_NAMES_DE[month0]} {y}</Link>
        </div>

        <SeoProse
          blocks={[
            {
              h2: `Aussaatkalender ${MONTH_NAMES_DE[month0]} ${y}`,
              p: [
                `Die Tabelle zeigt für jeden Tag im ${MONTH_NAMES_DE[month0]} ${y}, in welchem Tierkreiszeichen der Mond steht und welcher Pflanzentag sich daraus ergibt: Frucht-, Wurzel-, Blüten- oder Blatttag. So lässt sich planen, wann nach überlieferter Regel Fruchtgemüse, Wurzelgemüse, Blühpflanzen oder Blattgemüse gesät, gepflegt und geerntet werden. Die Angaben folgen dem Mondlauf und sind astronomisch berechnet; die gärtnerische Deutung ist überliefertes Brauchtum ohne wissenschaftlichen Wirknachweis.`,
              ],
            },
          ]}
        />
        <Faq items={faq} />
      </PageWithSidebar>
    </main>
  );
}
