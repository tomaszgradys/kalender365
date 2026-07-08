// German blog: 5 in-repo seed articles + AI-generated posts stored in Neon.
// getAllPosts() merges both; if the DB is unreachable, only seed posts show.

import { getDbPosts } from "./db";

export type BlogCategory =
  | "Feiertage & Urlaub"
  | "Schulferien"
  | "Kalender-Wissen"
  | "Mond & Natur"
  | "Zeit & Rechner";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  bodyHtml: string;
  publishedAt: string; // YYYY-MM-DD
  source: "seed" | "ai";
  cover?: { src: string; alt: string };
};

export const BLOG_CATEGORIES: BlogCategory[] = [
  "Feiertage & Urlaub",
  "Schulferien",
  "Kalender-Wissen",
  "Mond & Natur",
  "Zeit & Rechner",
];

// Fallback-Gradient (Kategorie-Label auf Farbverlauf), wenn ein Post kein Cover hat.
export const CATEGORY_GRADIENT: Record<BlogCategory, string> = {
  "Feiertage & Urlaub": "from-navy-600 to-navy-800",
  "Schulferien": "from-brand-green-600 to-navy-700",
  "Kalender-Wissen": "from-navy-500 to-navy-800",
  "Mond & Natur": "from-navy-700 to-navy-900",
  "Zeit & Rechner": "from-navy-600 to-brand-green-700",
};

const SEED: BlogPost[] = [
  {
    slug: "brueckentage-2026-maximaler-urlaub",
    title: "Brückentage 2026: Mit wenig Urlaub das Maximum herausholen",
    excerpt:
      "Wie Sie 2026 mit geschickt gelegten Brückentagen aus 20–30 Urlaubstagen deutlich mehr freie Tage machen – und warum das je nach Bundesland unterschiedlich ausfällt.",
    category: "Feiertage & Urlaub",
    publishedAt: "2026-07-01",
    bodyHtml: `
<p>Brückentage sind einzelne Arbeitstage, die zwischen einem gesetzlichen Feiertag und dem Wochenende liegen. Wer sie als Urlaub nimmt, verbindet Feiertag, Brückentag und Wochenende zu einem langen freien Block – oft vier oder mehr Tage am Stück für nur einen Urlaubstag.</p>
<h2>Warum sich Brückentage 2026 besonders lohnen</h2>
<p>Ob ein Brückentag zustande kommt, hängt davon ab, auf welchen Wochentag ein Feiertag fällt. Liegt er auf einem Dienstag oder Donnerstag, entsteht mit einem einzigen Urlaubstag ein vier Tage langes Wochenende. Da Feiertage in Deutschland <strong>Ländersache</strong> sind, unterscheiden sich die besten Brückentage je nach Bundesland.</p>
<h2>Beispiele für effiziente Brücken</h2>
<ul>
<li><strong>Christi Himmelfahrt</strong> fällt immer auf einen Donnerstag – der Freitag danach ist der klassische Brückentag für ein langes Wochenende.</li>
<li><strong>Tag der Arbeit</strong> (1. Mai) und der <strong>Tag der Deutschen Einheit</strong> (3. Oktober) liegen je nach Jahr günstig oder ungünstig.</li>
<li>Rund um <strong>Ostern</strong> und <strong>Pfingsten</strong> lassen sich ganze Wochen mit wenigen Urlaubstagen abdecken.</li>
</ul>
<p>Nutzen Sie unseren <a href="/urlaubsplaner/2026">Urlaubsplaner 2026</a>, um für Ihr Bundesland und Ihr Urlaubsbudget automatisch die effizientesten Kombinationen zu finden, oder sehen Sie sich direkt die <a href="/brueckentage/2026">Brückentage 2026</a> an.</p>
<p><em>Hinweis: Die Vorschläge sind unverbindliche Planungshilfen. Ob und wann Urlaub genehmigt wird, hängt von Arbeitsvertrag, Tarifvertrag und betrieblichen Regelungen ab.</em></p>`,
    source: "seed",
  },
  {
    slug: "feiertage-2026-ueberblick-bundeslaender",
    title: "Feiertage 2026 in Deutschland: Überblick nach Bundesland",
    excerpt:
      "Neun Feiertage gelten bundesweit – der Rest ist Ländersache. Welche Feiertage 2026 wo gelten und worauf Sie bei Fronleichnam, Reformationstag & Co. achten sollten.",
    category: "Feiertage & Urlaub",
    publishedAt: "2026-06-24",
    bodyHtml: `
<p>In Deutschland gibt es <strong>neun bundesweite Feiertage</strong>, die in allen 16 Bundesländern gelten: Neujahr, Karfreitag, Ostermontag, Tag der Arbeit, Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit sowie der 1. und 2. Weihnachtsfeiertag.</p>
<h2>Regionale Feiertage machen den Unterschied</h2>
<p>Alle weiteren Feiertage legen die Länder selbst über ihre Feiertagsgesetze fest. Deshalb hat Bayern mehr Feiertage als etwa Berlin oder Hamburg. Wichtige regionale Feiertage sind:</p>
<ul>
<li><strong>Heilige Drei Könige</strong> (6. Januar) – Baden-Württemberg, Bayern, Sachsen-Anhalt</li>
<li><strong>Fronleichnam</strong> – u. a. Baden-Württemberg, Bayern, Hessen, NRW, Rheinland-Pfalz, Saarland (in Sachsen und Thüringen nur in einzelnen Gemeinden)</li>
<li><strong>Reformationstag</strong> (31. Oktober) – die ostdeutschen und norddeutschen Länder</li>
<li><strong>Allerheiligen</strong> (1. November) – die überwiegend katholischen Länder</li>
</ul>
<h2>Besonderheiten</h2>
<p>Manche Tage gelten nur teilweise: <strong>Mariä Himmelfahrt</strong> ist nur im Saarland und in katholisch geprägten Gemeinden Bayerns ein Feiertag, das <strong>Augsburger Friedensfest</strong> nur im Stadtgebiet Augsburg. Anders als in einigen Nachbarländern gibt es in Deutschland <strong>keinen Ersatztag</strong>, wenn ein Feiertag auf ein Wochenende fällt.</p>
<p>Alle Termine für Ihr Bundesland finden Sie unter <a href="/feiertage/2026">Feiertage 2026</a>. Von dort können Sie die Feiertage auch als PDF oder ICS-Kalender herunterladen.</p>`,
    source: "seed",
  },
  {
    slug: "kalenderwochen-erklaert-was-ist-kw",
    title: "Kalenderwochen erklärt: Was bedeutet KW und wie wird gezählt?",
    excerpt:
      "KW 1, KW 32, KW 53 – wie werden Kalenderwochen in Deutschland eigentlich gezählt? Die ISO-8601-Regel einfach erklärt, samt der Frage, warum manche Jahre 53 Wochen haben.",
    category: "Kalender-Wissen",
    publishedAt: "2026-06-15",
    bodyHtml: `
<p>Im deutschen und europäischen Raum werden Kalenderwochen nach der Norm <strong>ISO 8601</strong> gezählt. Zwei Regeln genügen, um jede Kalenderwoche eindeutig zu bestimmen.</p>
<h2>Die zwei Grundregeln</h2>
<ul>
<li>Eine Woche beginnt immer am <strong>Montag</strong> und endet am Sonntag.</li>
<li><strong>KW 1</strong> ist die Woche, die den <strong>4. Januar</strong> enthält – gleichbedeutend mit: die erste Woche, die mehrheitlich (mindestens vier Tage) im neuen Jahr liegt.</li>
</ul>
<p>Daraus folgt: Der 1. Januar kann noch zur letzten Kalenderwoche des Vorjahres gehören. Und der 29., 30. oder 31. Dezember kann bereits zur KW 1 des Folgejahres zählen.</p>
<h2>Warum manche Jahre 53 Wochen haben</h2>
<p>Ein Jahr hat 52 oder 53 Kalenderwochen. 53 Wochen entstehen, wenn das Jahr auf einen Donnerstag fällt (oder in einem Schaltjahr auf einen Mittwoch oder Donnerstag). <strong>2026 hat 53 Kalenderwochen</strong>, 2027 dagegen nur 52.</p>
<p>Eine vollständige Übersicht mit Start- und Enddatum jeder Woche finden Sie unter <a href="/kalenderwochen/2026">Kalenderwochen 2026</a>. Die aktuelle Woche ist dort immer hervorgehoben.</p>`,
    source: "seed",
  },
  {
    slug: "schulferien-2026-ueberblick",
    title: "Schulferien 2026: Wann welches Bundesland frei hat",
    excerpt:
      "Sommerferien von Ende Juni bis Mitte September – aber nie überall gleichzeitig. Wie das deutsche Schulferien-System funktioniert und warum die Termine rotieren.",
    category: "Schulferien",
    publishedAt: "2026-06-05",
    bodyHtml: `
<p>Anders als in vielen Ländern haben in Deutschland nicht alle Schülerinnen und Schüler gleichzeitig frei. Die <strong>Sommerferien</strong> sind zwischen den Bundesländern gestaffelt und erstrecken sich insgesamt von Ende Juni bis Mitte September.</p>
<h2>Warum die Termine rotieren</h2>
<p>Die Staffelung soll Staus auf den Autobahnen und Engpässe in Urlaubsregionen entzerren. Ein rollierendes System sorgt dafür, dass kein Bundesland dauerhaft die frühesten oder spätesten Sommerferien hat. Koordiniert werden die Termine über die <strong>Kultusministerkonferenz (KMK)</strong>; festgelegt werden sie von den Kultusministerien der Länder.</p>
<h2>Diese Ferien gibt es</h2>
<ul>
<li><strong>Winterferien</strong> – nicht in jedem Bundesland</li>
<li><strong>Osterferien</strong> rund um Ostern</li>
<li><strong>Pfingstferien</strong> – teils nur einzelne bewegliche Tage</li>
<li><strong>Sommerferien</strong> – die längsten Ferien, gestaffelt</li>
<li><strong>Herbstferien</strong> im Oktober/November</li>
<li><strong>Weihnachtsferien</strong> zum Jahreswechsel</li>
</ul>
<p>Die konkreten Termine für Ihr Bundesland finden Sie unter <a href="/schulferien/2026">Schulferien 2026</a>. Sie können die Ferien dort auch als ICS-Kalender abonnieren. <em>Alle Angaben ohne Gewähr – maßgeblich sind die offiziellen Termine der Länder.</em></p>`,
    source: "seed",
  },
  {
    slug: "zeitumstellung-2026-sommerzeit-winterzeit",
    title: "Zeitumstellung 2026: Wann die Uhren umgestellt werden – und warum",
    excerpt:
      "Am letzten Sonntag im März und Oktober werden die Uhren umgestellt. Die genauen Termine 2026, die Merkregel für vor und zurück – und der Stand der Abschaffungsdebatte.",
    category: "Zeit & Rechner",
    publishedAt: "2026-05-20",
    bodyHtml: `
<p>Die Uhren werden in Deutschland zweimal im Jahr umgestellt – nach einer EU-weit einheitlichen Regel: jeweils am <strong>letzten Sonntag im März</strong> (Beginn der Sommerzeit) und am <strong>letzten Sonntag im Oktober</strong> (Rückkehr zur Winterzeit / Normalzeit).</p>
<h2>Vor oder zurück? Die Merkregel</h2>
<p>Im Frühjahr werden die Uhren <strong>von 2:00 auf 3:00 vorgestellt</strong> – die Nacht ist eine Stunde kürzer. Im Herbst werden sie <strong>von 3:00 auf 2:00 zurückgestellt</strong> – man gewinnt eine Stunde Schlaf. Eine gängige Eselsbrücke: Im Frühling stellt man die Gartenmöbel <em>vor</em> die Tür, im Herbst <em>zurück</em> in den Schuppen.</p>
<h2>Wird die Zeitumstellung abgeschafft?</h2>
<p>Das EU-Parlament hat sich bereits 2019 für ein Ende der Zeitumstellung ausgesprochen. Weil sich die Mitgliedstaaten aber nicht auf eine dauerhafte Sommer- oder Winterzeit einigen konnten, gilt die Umstellung vorerst weiter.</p>
<p>Die genauen Termine für dieses und kommende Jahre finden Sie unter <a href="/zeitumstellung/2026">Zeitumstellung 2026</a>. Passend dazu: die astronomischen <a href="/jahreszeiten/2026">Jahreszeiten 2026</a> und die <a href="/mondphasen/2026">Mondphasen 2026</a>.</p>`,
    source: "seed",
  },
];

/** All posts (seed + AI from DB), newest first. DB failure → seed only. */
export async function getAllPosts(): Promise<BlogPost[]> {
  let dbPosts: BlogPost[] = [];
  try {
    dbPosts = await getDbPosts();
  } catch {
    dbPosts = [];
  }
  const bySlug = new Map<string, BlogPost>();
  for (const p of [...SEED, ...dbPosts]) bySlug.set(p.slug, p);
  return [...bySlug.values()].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return (await getAllPosts()).find((p) => p.slug === slug) ?? null;
}

export function getSeedPosts(): BlogPost[] {
  return SEED;
}
