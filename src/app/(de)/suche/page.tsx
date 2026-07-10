import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import { berlinNow } from "@/lib/de/now";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE } from "@/lib/de/locale";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { routes } from "@/lib/de/routes";
import { getAllPosts } from "@/lib/de/blog";
import { parseYear } from "@/lib/de/year";
import { ogMeta } from "@/lib/de/ogMeta";

export const metadata: Metadata = {
  title: "Suche – Kalender365.pro",
  description: "Suchen Sie Kalender, Feiertage, Schulferien, Brückentage, ein Datum, einen Monat oder ein Jahr auf kalender365.pro.",
  alternates: { canonical: "/suche" },
  openGraph: ogMeta("/suche", { defaultImage: true }),
  robots: { index: false, follow: true }, // Suchergebnisseite — nicht indexieren.
};

function norm(s: string): string {
  return s
    .toLowerCase()
    .replace(/ß/g, "ss")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim();
}
const pad = (n: number) => String(n).padStart(2, "0");

type Result = { href: string; title: string; sub?: string };

// Month keys: normalized display name ("marz") and ASCII slug ("maerz").
const MONTHS_NORM = MONTH_NAMES_DE.map((m, i) => ({
  i,
  keys: Array.from(new Set([norm(m), MONTH_SLUGS_DE[i], norm(MONTH_SLUGS_DE[i])])).filter((k) => k.length > 2),
}));

// Static index of the site's main pages/tools ({y} resolved per request).
type PageEntry = { label: string; href: (y: number) => string; sub: string; kw: string };
const PAGES: PageEntry[] = [
  { label: "Kalender {y}", href: (y) => routes.year(y), sub: "Jahreskalender", kw: "kalender jahreskalender jahr uebersicht" },
  { label: "Feiertage {y}", href: (y) => routes.feiertage(y), sub: "Gesetzliche Feiertage", kw: "feiertage gesetzliche feiertage frei ostern weihnachten pfingsten" },
  { label: "Schulferien {y}", href: (y) => routes.schulferien(y), sub: "Ferien nach Bundesland", kw: "schulferien ferien sommerferien winterferien osterferien herbstferien schule" },
  { label: "Brückentage {y}", href: (y) => routes.brueckentage(y), sub: "Lange Wochenenden", kw: "brueckentage brueckentag lange wochenenden urlaub" },
  { label: "Urlaubsplaner {y}", href: (y) => routes.urlaubsplaner(y), sub: "Urlaub optimal planen", kw: "urlaubsplaner urlaub planen ferien freie tage brueckentage" },
  { label: "Arbeitstage {y}", href: (y) => routes.arbeitstage(y), sub: "Arbeitstage im Jahr", kw: "arbeitstage werktage jahr" },
  { label: "Kalenderwochen {y}", href: (y) => routes.kalenderwochen(y), sub: "KW-Übersicht", kw: "kalenderwochen kw wochen woche" },
  { label: "Kalender zum Ausdrucken {y}", href: (y) => routes.printYear(y), sub: "PDF-Kalender", kw: "ausdrucken drucken pdf vorlage" },
  { label: "Mondphasen {y}", href: (y) => routes.mondphasen(y), sub: "Mondkalender", kw: "mond mondphasen mondkalender" },
  { label: "Vollmond {y}", href: (y) => routes.vollmond(y), sub: "Vollmond-Termine", kw: "vollmond mond" },
  { label: "Neumond {y}", href: (y) => routes.neumond(y), sub: "Neumond-Termine", kw: "neumond mond" },
  { label: "Zeitumstellung {y}", href: (y) => routes.zeitumstellung(y), sub: "Sommer-/Winterzeit", kw: "zeitumstellung sommerzeit winterzeit uhr" },
  { label: "Jahreszeiten {y}", href: (y) => routes.jahreszeiten(y), sub: "Frühling, Sommer, Herbst, Winter", kw: "jahreszeiten fruehling sommer herbst winter tagundnachtgleiche sonnenwende" },
  { label: "Sonnenauf- & -untergang", href: () => routes.sonne(), sub: "Sonnenzeiten", kw: "sonne sonnenaufgang sonnenuntergang daemmerung" },
  { label: "Tage-Rechner", href: () => routes.tageRechner(), sub: "Tage zwischen zwei Daten", kw: "tage rechner differenz datum zwischen berechnen" },
  { label: "Arbeitstage-Rechner", href: () => routes.arbeitstageRechner(), sub: "Arbeitstage berechnen", kw: "arbeitstage rechner werktage berechnen" },
  { label: "Wochentag-Rechner", href: () => routes.wochentagRechner(), sub: "Wochentag eines Datums", kw: "wochentag rechner welcher tag datum" },
  { label: "Altersrechner", href: () => routes.altersrechner(), sub: "Alter berechnen", kw: "alter altersrechner geburtstag berechnen" },
  { label: "Countdown", href: () => routes.countdown(), sub: "Wie viele Tage bis …", kw: "countdown wie viele tage bis weihnachten silvester" },
  { label: "Stundenplan", href: () => routes.stundenplan(), sub: "Stundenplan-Vorlage", kw: "stundenplan schule vorlage" },
  { label: "Alle Tools", href: () => routes.generatoren(), sub: "Generatoren & Rechner", kw: "tools generatoren rechner werkzeuge" },
  { label: "Blog", href: () => "/blog", sub: "Ratgeber & Artikel", kw: "blog artikel ratgeber news" },
  { label: "Kontakt", href: () => routes.kontakt(), sub: "Kontakt aufnehmen", kw: "kontakt email nachricht" },
  { label: "Impressum", href: () => routes.impressum(), sub: "Anbieterkennzeichnung", kw: "impressum anbieter" },
  { label: "Datenschutz", href: () => routes.datenschutz(), sub: "Datenschutzerklärung", kw: "datenschutz privatsphaere dsgvo" },
];

// Direct "jump to" matches: year, month + year, day + month (+ year).
function smartMatches(q: string, year: number): Result[] {
  const n = norm(q);
  const out: Result[] = [];

  const yearMatch = n.match(/\b(1[89]\d\d|20\d\d|21\d\d)\b/);
  const y = yearMatch ? Number(yearMatch[1]) : null;
  const monthHit = MONTHS_NORM.find((m) => m.keys.some((k) => n.includes(k)));
  const dayMatch = n.match(/\b([12]?\d|3[01])(?:\.)?\b/);
  const day = dayMatch ? Number(dayMatch[1]) : null;
  const yy = y && parseYear(String(y)) ? y : year;

  if (monthHit && day && day >= 1 && day <= 31) {
    const iso = `${yy}-${pad(monthHit.i + 1)}-${pad(day)}`;
    out.push({ href: routes.kalenderblatt(iso), title: `${day}. ${MONTH_NAMES_DE[monthHit.i]} ${yy}`, sub: "Kalenderblatt" });
  }
  if (monthHit) {
    out.push({ href: routes.month(yy, monthHit.i), title: `Kalender ${MONTH_NAMES_DE[monthHit.i]} ${yy}`, sub: "Monatskalender" });
  }
  if (y && parseYear(String(y))) {
    out.push({ href: routes.year(y), title: `Kalender ${y}`, sub: "Jahreskalender" });
  }
  return out;
}

export default async function SuchePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const n = norm(query);
  const year = berlinNow().year;

  let smart: Result[] = [];
  let pages: Result[] = [];
  let states: Result[] = [];
  let posts: Result[] = [];

  if (n.length >= 2) {
    smart = smartMatches(query, year);

    pages = PAGES.filter((p) => norm(p.label).includes(n) || p.kw.includes(n))
      .slice(0, 12)
      .map((p) => ({ href: p.href(year), title: p.label.replaceAll("{y}", String(year)), sub: p.sub }));

    const stateHit = BUNDESLAENDER.find((b) => n.includes(norm(b.name)) || n.includes(b.slug) || (b.abbr && n.includes(b.abbr.toLowerCase())));
    if (stateHit) {
      states = [
        { href: routes.feiertageState(year, stateHit), title: `Feiertage ${year} – ${stateHit.name}`, sub: "Gesetzliche Feiertage" },
        { href: routes.schulferienState(year, stateHit), title: `Schulferien ${year} – ${stateHit.name}`, sub: "Ferientermine" },
        { href: routes.brueckentageState(year, stateHit), title: `Brückentage ${year} – ${stateHit.name}`, sub: "Lange Wochenenden" },
        { href: routes.urlaubsplaner(year), title: `Urlaubsplaner ${year}`, sub: `Mit ${stateHit.name} vorbelegt` },
      ];
    }

    const all = await getAllPosts();
    posts = all
      .filter((p) => norm(p.title).includes(n) || norm(p.excerpt).includes(n))
      .slice(0, 8)
      .map((p) => ({ href: `/blog/${p.slug}`, title: p.title, sub: "Blog" }));
  }

  const total = smart.length + pages.length + states.length + posts.length;

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Suche</span>
        </nav>
        <h1 className="text-2xl font-black tracking-tight text-navy-800 sm:text-3xl">Suche</h1>

        <form action="/suche" className="mt-5 flex gap-2">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="z. B. Bayern, 15. August, Juli 2026, Mondphasen …"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-slate-800 focus:border-navy-400 focus:outline-none"
            autoFocus
          />
          <button type="submit" className="rounded-xl bg-navy-600 px-5 py-2.5 font-semibold text-white hover:bg-navy-700">
            Suchen
          </button>
        </form>

        {query.length >= 2 ? (
          total === 0 ? (
            <p className="mt-8 text-slate-500">
              Keine Treffer für „{query}“. Versuchen Sie ein Datum (z. B. „11. November“), einen Monat und ein Jahr
              (z. B. „Dezember 2026“), ein Bundesland oder den Namen eines Kalenders.
            </p>
          ) : (
            <div className="mt-8 space-y-8">
              {smart.length > 0 && <Section title="Direkt öffnen" items={smart} />}
              {states.length > 0 && <Section title="Nach Bundesland" items={states} />}
              {pages.length > 0 && <Section title="Kalender & Tools" items={pages} />}
              {posts.length > 0 && <Section title="Aus dem Blog" items={posts} />}
            </div>
          )
        ) : (
          <p className="mt-8 text-slate-500">Geben Sie mindestens 2 Zeichen ein, um zu suchen.</p>
        )}
      </PageWithSidebar>
    </div>
  );
}

function Section({ title, items }: { title: string; items: Result[] }) {
  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</h2>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {items.map((r) => (
          <Link key={r.href + r.title} href={r.href} className="rounded-2xl border border-slate-200 p-4 hover:border-navy-300 hover:shadow-sm">
            <div className="font-semibold text-navy-800">{r.title}</div>
            {r.sub && <div className="text-sm text-slate-500">{r.sub}</div>}
          </Link>
        ))}
      </div>
    </section>
  );
}
