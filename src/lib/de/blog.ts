// German blog: in-repo seed articles + AI-generated posts stored in Neon.
// getAllPosts() merges both; if the DB is unreachable, only seed posts show.

import { getDbPosts } from "./db";
import type { EventMotif } from "@/components/de/EventArt";

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
  /** Hausgemachtes SVG-Titelbild (Fallback, wenn kein cover-Bild vorhanden). */
  art?: EventMotif;
  /** Optionale FAQ (nur Seed-Beiträge) → rendert Akkordeon + FAQPage-JSON-LD. */
  faq?: { q: string; a: string }[];
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

// Themen-Cluster (Content-Hubs). Jede Kategorie bekommt eine eigene Hub-Seite
// /blog/kategorie/[slug], die Google als klar organisiertes Silo signalisiert
// und die Ratgeber-Artikel mit den passenden Werkzeug-/Money-Pages verbindet.
export type BlogCategoryMeta = {
  slug: string;
  title: string;
  /** Meta-Description der Hub-Seite (140–160 Zeichen). */
  metaDescription: string;
  /** Einleitender Absatz oben auf der Hub-Seite. */
  intro: string;
  /** Verwandte Werkzeug-/Money-Pages (Brücken vom Themen-Hub in den Kern). */
  bridges: { href: string; label: string }[];
};

export const BLOG_CATEGORY_META: Record<BlogCategory, BlogCategoryMeta> = {
  "Feiertage & Urlaub": {
    slug: "feiertage-urlaub",
    title: "Feiertage & Urlaub",
    metaDescription:
      "Ratgeber zu Feiertagen, Brückentagen und Urlaubsplanung in Deutschland – wie Sie mit wenig Urlaub das Maximum an freien Tagen herausholen.",
    intro:
      "Feiertage sind in Deutschland Ländersache – wer sie geschickt mit Brückentagen kombiniert, macht aus wenigen Urlaubstagen lange freie Blöcke. Hier bündeln wir alle Ratgeber rund um Feiertage, Brückentage und Urlaubsplanung.",
    bridges: [
      { href: "/feiertage/{y}", label: "Feiertage {y}" },
      { href: "/brueckentage/{y}", label: "Brückentage {y}" },
      { href: "/urlaubsplaner/{y}", label: "Urlaubsplaner {y}" },
      { href: "/arbeitstage/{y}", label: "Arbeitstage {y}" },
    ],
  },
  "Schulferien": {
    slug: "schulferien",
    title: "Schulferien",
    metaDescription:
      "Alles rund um die Schulferien in den 16 Bundesländern: Termine, Staffelung, Sommerferien-Countdown und clevere Familienplanung.",
    intro:
      "Die Schulferien unterscheiden sich von Bundesland zu Bundesland und werden bewusst gestaffelt. In diesem Themenbereich finden Sie Ratgeber zu Ferienterminen, Reiseplanung und dem Countdown bis zu den nächsten Ferien.",
    bridges: [
      { href: "/schulferien/{y}", label: "Schulferien {y}" },
      { href: "/sommerferien/{y}", label: "Sommerferien {y}" },
      { href: "/wie-viele-tage-bis-zu-den-sommerferien", label: "Sommerferien-Countdown" },
    ],
  },
  "Kalender-Wissen": {
    slug: "kalender-wissen",
    title: "Kalender-Wissen",
    metaDescription:
      "Kalenderwissen verständlich erklärt: Kalenderwochen, Schaltjahre, Wochentage, Quartale und wie das deutsche Kalendersystem funktioniert.",
    intro:
      "Warum hat manches Jahr 53 Kalenderwochen? Wie werden Quartale gezählt? In diesem Themenbereich erklären wir die Regeln hinter dem Kalender – von der ISO-8601-Kalenderwoche bis zum Schaltjahr.",
    bridges: [
      { href: "/kalenderwochen/{y}", label: "Kalenderwochen {y}" },
      { href: "/kalender/{y}", label: "Kalender {y}" },
      { href: "/wochentag-rechner", label: "Wochentag-Rechner" },
    ],
  },
  "Mond & Natur": {
    slug: "mond-natur",
    title: "Mond & Natur",
    metaDescription:
      "Mondphasen, Vollmond- und Neumond-Termine, Mondkalender und Jahreszeiten – Wissenswertes und Brauchtum rund um Mond und Natur.",
    intro:
      "Vom Vollmond über die Aussaattage bis zu den Jahreszeiten: In diesem Themenbereich bündeln wir Ratgeber rund um Mondphasen, Mondkalender und den natürlichen Jahreslauf.",
    bridges: [
      { href: "/mondkalender/{y}", label: "Mondkalender {y}" },
      { href: "/mondphasen/{y}", label: "Mondphasen {y}" },
      { href: "/vollmond/{y}", label: "Vollmond {y}" },
      { href: "/jahreszeiten/{y}", label: "Jahreszeiten {y}" },
    ],
  },
  "Zeit & Rechner": {
    slug: "zeit-rechner",
    title: "Zeit & Rechner",
    metaDescription:
      "Zeitumstellung, Tage- und Arbeitstage-Rechner, Altersrechner und Countdowns – praktische Werkzeuge und Erklärungen rund um Zeit und Datum.",
    intro:
      "Wie viele Tage bis zum nächsten Termin? Wann wird die Uhr umgestellt? In diesem Themenbereich finden Sie Ratgeber und Erklärungen zu unseren Rechnern und rund um das Thema Zeit.",
    bridges: [
      { href: "/zeitumstellung/{y}", label: "Zeitumstellung {y}" },
      { href: "/tage-rechner", label: "Tage-Rechner" },
      { href: "/arbeitstage-rechner", label: "Arbeitstage-Rechner" },
      { href: "/wie-viele-tage-bis", label: "Countdown" },
    ],
  },
};

/** Kategorie-Slug (für /blog/kategorie/[slug]). */
export function categorySlug(cat: BlogCategory): string {
  return BLOG_CATEGORY_META[cat].slug;
}

/** Kategorie zu einem Slug finden (oder null, wenn unbekannt). */
export function categoryBySlug(slug: string): BlogCategory | null {
  const hit = (Object.keys(BLOG_CATEGORY_META) as BlogCategory[]).find(
    (c) => BLOG_CATEGORY_META[c].slug === slug,
  );
  return hit ?? null;
}

/** Alle Beiträge einer Kategorie (neueste zuerst). */
export async function getPostsByCategory(cat: BlogCategory): Promise<BlogPost[]> {
  return (await getAllPosts()).filter((p) => p.category === cat);
}

const SEED: BlogPost[] = [
  {
    // Discover-Beitrag 22.10.2026: Zahlen-Hook (4 Urlaubstage = 10 Tage frei; 4 Feiertage am
    // Wochenende). Alle Termine aus brueckentageBundesweit()/feiertage.ts berechnet.
    slug: "brueckentage-2027-mit-4-urlaubstagen-10-tage-frei",
    title: "Brückentage 2027: Mit 4 Urlaubstagen 10 Tage frei",
    excerpt:
      "2027 bringt Brücken von 9 bis 10 Tagen um Ostern und Pfingsten – aber der 1. Mai, der 3. Oktober und beide Weihnachtsfeiertage fallen aufs Wochenende. Alle Termine je Land.",
    category: "Feiertage & Urlaub",
    publishedAt: "2026-10-22",
    cover: { src: "/blog/brueckentage-2027-urlaub-planen.jpg", alt: "Koffer, Sonnenbrille und Kaffee am Fenster – Urlaub 2027 planen" },
    bodyHtml: `
<p><strong>Wer 2027 clever plant, macht aus 4 Urlaubstagen 10 freie Tage am Stück – gleich zweimal.</strong> Die Kehrseite: Vier der neun bundesweiten Feiertage fallen 2027 auf einen Samstag oder Sonntag, und in Deutschland gibt es dafür keinen Ersatztag. Hier sind alle Termine, nach Effizienz sortiert, plus die regionalen Brücken für Ihr Bundesland.</p>
<h2>Die besten Brückentage 2027 – bundesweit</h2>
<ul>
<li><strong>Christi Himmelfahrt (Donnerstag, 6. Mai):</strong> 1 Urlaubstag (Freitag, 7. Mai) ergibt <strong>4 freie Tage</strong> vom 6. bis 9. Mai – die effizienteste Brücke des Jahres.</li>
<li><strong>Ostern (Karfreitag 26. März, Ostermontag 29. März):</strong> 4 Urlaubstage vom 22. bis 25. März ergeben <strong>10 freie Tage</strong> (20. bis 29. März). Alternativ 4 Urlaubstage vom 30. März bis 2. April: ebenfalls 10 freie Tage, vom 26. März bis 4. April.</li>
<li><strong>Pfingsten (Pfingstmontag 17. Mai):</strong> 4 Urlaubstage vom 18. bis 21. Mai ergeben <strong>9 freie Tage</strong> (15. bis 23. Mai).</li>
<li><strong>Anfang Mai:</strong> 3 Urlaubstage (3. bis 5. Mai) verbinden das Wochenende mit Christi Himmelfahrt zu <strong>6 freien Tagen</strong> (1. bis 6. Mai); mit dem 7. Mai als viertem Urlaubstag werden daraus sogar 9 Tage bis zum 9. Mai.</li>
</ul>
<p>Die vollständige Tabelle mit Zeitraum, Urlaubstagen und freien Tagen – auch für die regionalen Brücken – steht unter <a href="/brueckentage/2027">Brückentage 2027</a>; der <a href="/urlaubsplaner/2027">Urlaubsplaner 2027</a> verteilt Ihre Urlaubstage automatisch auf die besten Kombinationen.</p>
<h2>Regionale Brücken: Fronleichnam, Dreikönig, Buß- und Bettag</h2>
<ul>
<li><strong>Fronleichnam (Donnerstag, 27. Mai)</strong> in Baden-Württemberg, Bayern, Hessen, Nordrhein-Westfalen, Rheinland-Pfalz und dem Saarland: 1 Urlaubstag (28. Mai) ergibt 4 freie Tage.</li>
<li><strong>Heilige Drei Könige (Mittwoch, 6. Januar)</strong> in Baden-Württemberg, Bayern und Sachsen-Anhalt: 2 Urlaubstage (4. und 5. Januar) ergeben 6 freie Tage ab Neujahr; 2 Urlaubstage am 7. und 8. Januar ergeben 5 freie Tage bis zum 10. Januar.</li>
<li><strong>Buß- und Bettag (Mittwoch, 17. November)</strong> in Sachsen: je 2 Urlaubstage davor oder danach ergeben 5 freie Tage.</li>
<li><strong>Internationaler Frauentag (Montag, 8. März)</strong> in Berlin und Mecklenburg-Vorpommern: 4 Urlaubstage (9. bis 12. März) ergeben 9 freie Tage.</li>
</ul>
<h2>Die schlechte Nachricht: 4 Feiertage am Wochenende</h2>
<p>2027 fallen der <strong>Tag der Arbeit (Samstag, 1. Mai)</strong>, der <strong>Tag der Deutschen Einheit (Sonntag, 3. Oktober)</strong> sowie der <strong>1. und 2. Weihnachtsfeiertag (Samstag und Sonntag, 25. und 26. Dezember)</strong> auf ein Wochenende. Anders als in manchen Nachbarländern gibt es in Deutschland keinen Ersatzfeiertag: Diese vier Tage sind für Arbeitnehmer mit 5-Tage-Woche schlicht verloren. Von den neun bundesweiten Feiertagen bleiben damit nur fünf an Werktagen – 2026 waren es noch sieben. Entsprechend hat 2027 je nach Bundesland 253 bis 256 Arbeitstage, mehr als in fast jedem anderen Jahr.</p>
<p>Ein Trost: Weihnachten am Wochenende bedeutet, dass die Weihnachtswoche (Montag 20. bis Freitag 24. Dezember) mit 5 Urlaubstagen zu 9 freien Tagen bis zum 26. Dezember wird, und Neujahr 2028 fällt auf einen Samstag – wer bis Silvester durcharbeitet, hat dennoch das lange Wochenende 1. bis 2. Januar 2028.</p>
<h2>Lange Wochenenden ganz ohne Urlaub</h2>
<p>Drei Termine schenken 2027 allen Bundesländern ein verlängertes Wochenende ohne einen einzigen Urlaubstag: <strong>Neujahr</strong> (Freitag, 1. bis Sonntag, 3. Januar), <strong>Ostern</strong> (Karfreitag, 26. bis Ostermontag, 29. März – vier Tage) und <strong>Pfingsten</strong> (Samstag, 15. bis Montag, 17. Mai).</p>
<h2>So planen Sie am besten</h2>
<ol>
<li>Zuerst die beiden 10-Tage-Blöcke um Ostern prüfen – sie kollidieren mit den Osterferien vieler Länder, daher früh im Betrieb anmelden.</li>
<li>Den 7. Mai (Freitag nach Himmelfahrt) sofort eintragen: Ein Tag, vier freie Tage – diese Brücke ist in jedem Bundesland begehrt.</li>
<li>Regionale Feiertage Ihres Landes mitnehmen: Die Übersicht <a href="/feiertage/2027">Feiertage 2027</a> zeigt in einer Matrix, welcher Tag wo gilt.</li>
<li>Für Familien: Die Brücken mit den <a href="/schulferien/2027">Schulferien 2027</a> abgleichen – der Urlaubsplaner blendet die Ferien Ihres Bundeslandes ein.</li>
</ol>
<p>Alle Angaben beziehen sich auf eine 5-Tage-Woche (Montag bis Freitag) und die gesetzlichen Feiertage des jeweiligen Bundeslandes; Zeiträume inklusive Wochenenden. Berechnet mit den Feiertagsregeln der Länder (Stand Oktober 2026), ohne Gewähr.</p>`,
    faq: [
      { q: "Wann sind die besten Brückentage 2027?", a: "Der Freitag nach Christi Himmelfahrt (7. Mai 2027: 1 Urlaubstag, 4 freie Tage) sowie die Wochen vor oder nach Ostern (22. bis 25. März oder 30. März bis 2. April: je 4 Urlaubstage, 10 freie Tage) und die Woche nach Pfingsten (18. bis 21. Mai: 4 Urlaubstage, 9 freie Tage)." },
      { q: "Welche Feiertage fallen 2027 auf ein Wochenende?", a: "Der 1. Mai (Samstag), der 3. Oktober (Sonntag) sowie der 1. und 2. Weihnachtsfeiertag (Samstag und Sonntag). In Deutschland gibt es dafür keinen Ersatztag." },
      { q: "Wie viele Arbeitstage hat 2027?", a: "Je nach Bundesland 253 bis 256 Arbeitstage bei einer 5-Tage-Woche – zum Beispiel 256 in Brandenburg, 255 in Berlin und 253 in Bayern." },
      { q: "Gibt es 2027 lange Wochenenden ohne Urlaub?", a: "Ja: Neujahr (1. bis 3. Januar), Ostern (26. bis 29. März, vier Tage) und Pfingsten (15. bis 17. Mai) – bundesweit." },
    ],
    source: "seed",
  },
  {
    // Discover-Beitrag 22.10.2026, drei Tage vor der Umstellung. Sonnenzeiten für Berlin
    // aus sun.ts (24./25./26.10. und 21.12.2026), Termine aus astroYear.ts.
    slug: "winterzeit-2026-zeitumstellung-25-oktober",
    title: "Winterzeit 2026: Am 25. Oktober werden die Uhren zurückgestellt",
    excerpt:
      "In der Nacht zum 25. Oktober 2026 springt die Uhr von 3:00 auf 2:00 Uhr zurück. Was sich ändert, warum es abends früh dunkel wird und wann die Sommerzeit 2027 beginnt.",
    category: "Zeit & Rechner",
    publishedAt: "2026-10-22",
    cover: { src: "/blog/winterzeit-2026-zeitumstellung-oktober.jpg", alt: "Wanduhr, Herbstlaub und Lampe – Zeitumstellung auf Winterzeit" },
    bodyHtml: `
<p><strong>Am Sonntag, den 25. Oktober 2026, endet die Sommerzeit:</strong> Um 3:00 Uhr nachts werden die Uhren auf 2:00 Uhr zurückgestellt. Die Nacht ist damit eine Stunde länger, und ab Montag gilt wieder die Mitteleuropäische Zeit (MEZ) – umgangssprachlich die „Winterzeit“, rechtlich die Normalzeit.</p>
<h2>Vor oder zurück? Die Merkregel</h2>
<p>Im Herbst werden die Uhren <strong>zurück</strong>gestellt: von 3:00 auf 2:00 Uhr. Die bekannte Eselsbrücke: Im Herbst stellt man die Gartenmöbel <em>zurück</em> in den Schuppen, im Frühjahr <em>vor</em> die Tür. Wer am Samstagabend die Uhr noch nicht umstellt, kommt am Sonntag eine Stunde zu früh – ärgerlich nur, wenn Sie um 9 Uhr verabredet sind. Smartphones, Computer und Funkuhren stellen sich automatisch um; manuell nachjustieren müssen Sie meist Backofen, Mikrowelle, Autoradio und analoge Wanduhren.</p>
<h2>Warum es ab Sonntag abends so früh dunkel ist</h2>
<p>Die Umstellung verschiebt den Tag um eine Stunde nach vorn – in Berlin geht die Sonne am Samstag, 24. Oktober, um 17:52 Uhr unter, am Sonntag, 25. Oktober, bereits um <strong>16:50 Uhr</strong>. Dafür wird es morgens wieder heller: Sonnenaufgang um 6:49 Uhr statt 7:47 Uhr. Die Tageslänge selbst ändert sich durch die Umstellung nicht, sie schrumpft nur weiter mit dem Herbst: Am 25. Oktober dauert der Tag in Berlin 10 Stunden und 1 Minute, zur Wintersonnenwende am 21. Dezember (Winteranfang um 21:50 Uhr) nur noch 7 Stunden und 39 Minuten – Sonnenaufgang 8:14 Uhr, Sonnenuntergang 15:53 Uhr. Für Ihren Ort finden Sie die Zeiten unter <a href="/sonnenaufgang-sonnenuntergang">Sonnenaufgang &amp; Sonnenuntergang</a>.</p>
<h2>Die Termine auf einen Blick</h2>
<ul>
<li><strong>Ende der Sommerzeit 2026:</strong> Sonntag, 25. Oktober 2026, 3:00 Uhr → 2:00 Uhr.</li>
<li><strong>Beginn der Sommerzeit 2027:</strong> Sonntag, 28. März 2027, 2:00 Uhr → 3:00 Uhr.</li>
<li><strong>Ende der Sommerzeit 2027:</strong> Sonntag, 31. Oktober 2027 – der spätestmögliche Termin.</li>
</ul>
<p>Die Regel ist EU-weit einheitlich: letzter Sonntag im März und letzter Sonntag im Oktober. Alle Termine für die kommenden Jahre: <a href="/zeitumstellung/2026">Zeitumstellung 2026</a> und <a href="/zeitumstellung/2027">Zeitumstellung 2027</a>.</p>
<h2>Wird die Zeitumstellung abgeschafft?</h2>
<p>Das Europäische Parlament hat sich bereits 2019 für ein Ende der halbjährlichen Umstellung ausgesprochen. Weil sich die Mitgliedstaaten seither nicht auf eine dauerhafte Sommer- oder Normalzeit einigen konnten, bleibt es vorerst bei zwei Umstellungen pro Jahr – auch 2027. Bis zu einer Entscheidung gilt: Die Winterzeit ist die „echte“ Zeit, die Sommerzeit die Ausnahme von Ende März bis Ende Oktober.</p>
<h2>Tipps für die Umstellung</h2>
<ul>
<li>Die gewonnene Stunde am Sonntag bewusst zum Ausschlafen nutzen – der Körper braucht erfahrungsgemäß einige Tage, bis sich der Rhythmus anpasst.</li>
<li>Kleine Kinder und Haustiere halten sich nicht an die Uhr: Mahlzeiten und Schlafenszeiten in den Tagen davor um 10 bis 15 Minuten verschieben.</li>
<li>Rauchmelder-Batterien prüfen – viele nutzen die Umstellung als festen Termin dafür.</li>
<li>Fahrrad- und Autobeleuchtung kontrollieren: Der Berufsverkehr am Montagabend findet erstmals wieder in der Dämmerung statt.</li>
</ul>
<p>Weiterlesen: <a href="/kw/44-2026">Kalenderwoche 44</a> mit Reformationstag und Allerheiligen, die <a href="/jahreszeiten/2026">Jahreszeiten 2026</a> und die <a href="/mondphasen/2026">Mondphasen 2026</a> – der nächste Vollmond ist am 26. Oktober um 5:13 Uhr.</p>`,
    faq: [
      { q: "Wann ist die Zeitumstellung im Oktober 2026?", a: "In der Nacht von Samstag, 24., auf Sonntag, 25. Oktober 2026: Um 3:00 Uhr werden die Uhren auf 2:00 Uhr zurückgestellt." },
      { q: "Wird die Uhr vor- oder zurückgestellt?", a: "Zurück – von 3:00 auf 2:00 Uhr. Die Nacht ist eine Stunde länger." },
      { q: "Wann beginnt die Sommerzeit 2027?", a: "Am Sonntag, 28. März 2027, werden die Uhren um 2:00 Uhr auf 3:00 Uhr vorgestellt." },
      { q: "Ist die Winterzeit die normale Zeit?", a: "Ja. Die Mitteleuropäische Zeit (MEZ) ist die gesetzliche Normalzeit; die Sommerzeit (MESZ) gilt nur von Ende März bis Ende Oktober." },
    ],
    source: "seed",
  },
  {
    // Evergreen-Pillar zum Thema Feiertage. Andere Suchintention als der
    // Jahrgangs-Hub /feiertage/JAHR (Terminliste) und der Jahres-Überblick:
    // erklärt das SYSTEM (bundesweit vs. Ländersache, beweglich/fest, stille
    // Tage, kein Ersatztag) und verlinkt über {jahr} in die aktuellen Money-Pages.
    slug: "feiertage-in-deutschland-ueberblick",
    title: "Feiertage in Deutschland: Der große Überblick",
    excerpt:
      "Wie funktionieren Feiertage in Deutschland? Bundesweite und regionale Feiertage, gesetzliche und stille Tage, Ländersache und Brückentage – verständlich erklärt.",
    category: "Feiertage & Urlaub",
    publishedAt: "2026-07-10",
    art: "kalender",
    bodyHtml: `
<p>Feiertage sind in Deutschland mehr als freie Tage – sie folgen einem eigenen System aus Bundes- und Landesrecht, kirchlichem Kalender und regionaler Tradition. Dieser Leitfaden erklärt, wie gesetzliche Feiertage entstehen, warum sie sich von Bundesland zu Bundesland unterscheiden und worauf Sie bei der Planung achten sollten.</p>

<h2>Was ist ein gesetzlicher Feiertag?</h2>
<p>Ein gesetzlicher Feiertag ist ein durch Gesetz bestimmter Tag, an dem grundsätzlich ein Arbeits- und Beschäftigungsverbot gilt und der wie ein Sonntag geschützt ist. Für Arbeitnehmerinnen und Arbeitnehmer bedeutet das in der Regel einen bezahlten freien Tag. Geregelt wird das nicht zentral, sondern über das Grundgesetz in Verbindung mit den <strong>Feiertagsgesetzen der Länder</strong> – nur ein einziger Feiertag ist bundesgesetzlich festgelegt.</p>

<h2>Bundesweite Feiertage: die neun Konstanten</h2>
<p>In allen 16 Bundesländern gelten <strong>neun Feiertage</strong> einheitlich:</p>
<ul>
<li><strong>Neujahr</strong> (1. Januar)</li>
<li><strong>Karfreitag</strong> und <strong>Ostermontag</strong></li>
<li><strong>Tag der Arbeit</strong> (1. Mai)</li>
<li><strong>Christi Himmelfahrt</strong> und <strong>Pfingstmontag</strong></li>
<li><strong>Tag der Deutschen Einheit</strong> (3. Oktober) – der einzige bundesgesetzliche Feiertag</li>
<li><strong>1.</strong> und <strong>2. Weihnachtsfeiertag</strong> (25. und 26. Dezember)</li>
</ul>
<p>Alle weiteren Feiertage sind Sache der Länder. Die vollständige Liste mit den Terminen für Ihr Bundesland finden Sie unter <a href="/feiertage/{jahr}">Feiertage {jahr}</a>.</p>

<h2>Warum Feiertage Ländersache sind</h2>
<p>Weil die Länder ihre Feiertage selbst festlegen, hat der Süden traditionell mehr freie Tage als der Norden. Zu den wichtigsten <strong>regionalen Feiertagen</strong> zählen:</p>
<ul>
<li><strong>Heilige Drei Könige</strong> (6. Januar) – Baden-Württemberg, Bayern, Sachsen-Anhalt</li>
<li><strong>Fronleichnam</strong> – überwiegend katholisch geprägte Länder wie Bayern, NRW oder Rheinland-Pfalz</li>
<li><strong>Reformationstag</strong> (31. Oktober) – die ost- und norddeutschen Länder</li>
<li><strong>Allerheiligen</strong> (1. November) – die überwiegend katholischen Länder</li>
<li><strong>Buß- und Bettag</strong> – nur in Sachsen ein gesetzlicher Feiertag</li>
</ul>
<p>Dazu kommen Besonderheiten wie <strong>Mariä Himmelfahrt</strong> (Saarland und katholische Gemeinden Bayerns) oder das <strong>Augsburger Friedensfest</strong>, das nur im Stadtgebiet Augsburg gilt. In Summe hat <strong>Bayern</strong> die meisten Feiertage (in Augsburg bis zu 14), während mehrere nord- und ostdeutsche Länder bei rund zehn liegen.</p>

<h2>Bewegliche und feste Feiertage</h2>
<p>Feste Feiertage haben jedes Jahr dasselbe Datum – etwa Neujahr, der 1. Mai oder Weihnachten. <strong>Bewegliche Feiertage</strong> dagegen hängen am Osterdatum und wandern dadurch von Jahr zu Jahr:</p>
<ul>
<li><strong>Karfreitag</strong> – zwei Tage vor Ostersonntag</li>
<li><strong>Ostermontag</strong> – der Tag nach Ostersonntag</li>
<li><strong>Christi Himmelfahrt</strong> – 39 Tage nach Ostern (immer ein Donnerstag)</li>
<li><strong>Pfingstmontag</strong> – 50 Tage nach Ostern</li>
</ul>
<p>Das Osterdatum selbst richtet sich nach dem ersten Frühlingsvollmond, weshalb Ostern zwischen dem 22. März und dem 25. April liegen kann. Weil Christi Himmelfahrt stets auf einen Donnerstag fällt, ist der Freitag danach ein klassischer <a href="/brueckentage/{jahr}">Brückentag {jahr}</a>.</p>

<h2>Stille Feiertage und Tanzverbot</h2>
<p>Manche Feiertage sind zwar arbeitsfrei, unterliegen aber zusätzlich besonderen Schutzregeln – den sogenannten <strong>stillen Feiertagen</strong>. An Tagen wie Karfreitag, Volkstrauertag, Totensonntag oder Allerheiligen gelten je nach Bundesland Einschränkungen für öffentliche Veranstaltungen und Musik, umgangssprachlich als „Tanzverbot“ bekannt. Umfang und Uhrzeiten legt jedes Land eigenständig fest, weshalb ein Feiertag in einem Bundesland „still“ sein kann und im nächsten nicht.</p>

<h2>Kein Ersatztag – und wie Brückentage helfen</h2>
<p>Anders als etwa in Großbritannien gibt es in Deutschland <strong>keinen Ersatzruhetag</strong>, wenn ein Feiertag auf ein Wochenende fällt. Ein 1. Mai, der auf einen Samstag fällt, ist damit für viele Beschäftigte „verloren“. Genau deshalb lohnt es sich, das Kalenderjahr vorausschauend zu planen: Liegt ein Feiertag auf einem Dienstag oder Donnerstag, verwandelt ein einzelner Urlaubstag ihn in ein langes Wochenende.</p>
<p>Unser <a href="/urlaubsplaner/{jahr}">Urlaubsplaner {jahr}</a> berechnet für Ihr Bundesland automatisch die effizientesten Kombinationen aus Feiertagen, Brückentagen und Wochenenden. Wie viele reine <a href="/arbeitstage/{jahr}">Arbeitstage {jahr}</a> übrig bleiben und wie sich das Jahr insgesamt verteilt, sehen Sie im <a href="/kalender/{jahr}">Kalender {jahr}</a>.</p>

<h2>Feiertag, Gehalt und Arbeit</h2>
<p>Für die meisten Angestellten ist ein gesetzlicher Feiertag ein bezahlter freier Tag: Nach dem Entgeltfortzahlungsgesetz erhalten sie das Gehalt, das sie ohne den Ausfall verdient hätten. Wer an einem Feiertag <strong>arbeiten muss</strong> – etwa in Krankenhäusern, Gastronomie oder Schichtbetrieben –, hat oft Anspruch auf Zuschläge; deren Höhe ergibt sich aus Tarif- oder Arbeitsvertrag, nicht aus einem allgemeinen Gesetz. Grundsätzlich gilt an Feiertagen wie an Sonntagen ein <strong>Beschäftigungsverbot</strong>, von dem nur bestimmte Branchen ausgenommen sind. Ob ein Tag für Sie arbeitsfrei ist, hängt also von zwei Dingen ab: ob er in Ihrem Bundesland überhaupt Feiertag ist – und von den Regelungen Ihrer Branche.</p>

<h2>Feiertage im Jahresverlauf</h2>
<p>Die Feiertage verteilen sich ungleich über das Jahr. Das erste Halbjahr ist dicht: Von Neujahr über die Osterfeiertage und den 1. Mai bis zu Christi Himmelfahrt und Pfingsten reiht sich im Frühjahr ein freier Tag an den nächsten. Der Sommer ist – abgesehen von Fronleichnam und regionalen Terminen – vergleichsweise feiertagsarm, weshalb hier die <a href="/schulferien/{jahr}">Schulferien {jahr}</a> die Urlaubsplanung bestimmen. Im Herbst folgen Tag der Deutschen Einheit, Reformationstag und Allerheiligen, bevor das Jahr mit den Weihnachtsfeiertagen und Neujahr ausklingt. Wer den natürlichen Rhythmus mitdenkt, sieht sich auch die <a href="/jahreszeiten/{jahr}">Jahreszeiten {jahr}</a> an – Frühlings- und Herbstbeginn liegen nah an den beiden feiertagsstärksten Phasen.</p>

<p><em>Hinweis: Dieser Leitfaden gibt einen allgemeinen Überblick und ersetzt keine Rechtsberatung. Ob ein bestimmter Tag in Ihrem Bundesland ein gesetzlicher Feiertag ist, richtet sich nach dem jeweiligen Landesrecht.</em></p>`,
    faq: [
      {
        q: "Wie viele gesetzliche Feiertage gibt es in Deutschland?",
        a: "Bundesweit gelten neun Feiertage in allen 16 Ländern. Zusammen mit den regionalen Feiertagen kommt jedes Bundesland auf etwa 10 bis 13 gesetzliche Feiertage – Bayern (mit Augsburg bis zu 14) hat die meisten.",
      },
      {
        q: "Welches Bundesland hat die meisten Feiertage?",
        a: "Bayern hat die meisten gesetzlichen Feiertage, im Stadtgebiet Augsburg sind es durch das Augsburger Friedensfest bis zu 14. Danach folgt Baden-Württemberg. Mehrere nord- und ostdeutsche Länder liegen bei rund zehn.",
      },
      {
        q: "Gibt es einen Ersatztag, wenn ein Feiertag auf ein Wochenende fällt?",
        a: "Nein. In Deutschland gibt es keinen Ersatzruhetag. Fällt ein Feiertag auf einen Samstag oder Sonntag, entfällt der zusätzliche freie Tag ersatzlos – anders als etwa bei den Bank Holidays in Großbritannien.",
      },
    ],
    source: "seed",
  },
  {
    slug: "brueckentage-2026-maximaler-urlaub",
    title: "Brückentage 2026: Mit wenig Urlaub das Maximum herausholen",
    excerpt:
      "Wie Sie 2026 mit geschickt gelegten Brückentagen aus 20–30 Urlaubstagen deutlich mehr freie Tage machen – und warum das je nach Bundesland unterschiedlich ausfällt.",
    category: "Feiertage & Urlaub",
    publishedAt: "2026-07-01",
    cover: { src: "https://v3b.fal.media/files/b/0aa16d70/zjXpqmEpgxk5M2cSo3P5y.jpg", alt: "Brückentage 2026" },
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
    cover: { src: "https://v3b.fal.media/files/b/0aa16d66/fWZJpcv1q2ZmOwPNe6hsd.jpg", alt: "Feiertage 2026 in Deutschland" },
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
    cover: { src: "https://v3b.fal.media/files/b/0aa16d66/Qj2wkcyFS3IxIbTiePF5a.jpg", alt: "Kalenderwochen erklärt" },
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
    cover: { src: "https://v3b.fal.media/files/b/0aa16d66/7TA7-wGh1zsDKekZ0QfwV.jpg", alt: "Schulferien 2026" },
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
    cover: { src: "https://v3b.fal.media/files/b/0aa16d66/EqT-5sBlf0162jgtbZz8c.jpg", alt: "Zeitumstellung 2026" },
    bodyHtml: `
<p>Die Uhren werden in Deutschland zweimal im Jahr umgestellt – nach einer EU-weit einheitlichen Regel: jeweils am <strong>letzten Sonntag im März</strong> (Beginn der Sommerzeit) und am <strong>letzten Sonntag im Oktober</strong> (Rückkehr zur Winterzeit / Normalzeit).</p>
<h2>Vor oder zurück? Die Merkregel</h2>
<p>Im Frühjahr werden die Uhren <strong>von 2:00 auf 3:00 vorgestellt</strong> – die Nacht ist eine Stunde kürzer. Im Herbst werden sie <strong>von 3:00 auf 2:00 zurückgestellt</strong> – man gewinnt eine Stunde Schlaf. Eine gängige Eselsbrücke: Im Frühling stellt man die Gartenmöbel <em>vor</em> die Tür, im Herbst <em>zurück</em> in den Schuppen.</p>
<h2>Wird die Zeitumstellung abgeschafft?</h2>
<p>Das EU-Parlament hat sich bereits 2019 für ein Ende der Zeitumstellung ausgesprochen. Weil sich die Mitgliedstaaten aber nicht auf eine dauerhafte Sommer- oder Winterzeit einigen konnten, gilt die Umstellung vorerst weiter.</p>
<p>Die genauen Termine für dieses und kommende Jahre finden Sie unter <a href="/zeitumstellung/2026">Zeitumstellung 2026</a>. Passend dazu: die astronomischen <a href="/jahreszeiten/2026">Jahreszeiten 2026</a> und die <a href="/mondphasen/2026">Mondphasen 2026</a>.</p>`,
    source: "seed",
  },
  {
    slug: "muttertag-2026-datum-herkunft-ideen",
    title: "Muttertag 2026: Datum, Herkunft und Ideen",
    excerpt:
      "Muttertag 2026 ist am 10. Mai – dem zweiten Sonntag im Mai. Woher der Tag kommt, warum das Datum jedes Jahr wechselt und wie Sie ihn schön gestalten.",
    category: "Kalender-Wissen",
    publishedAt: "2026-07-09",
    art: "blumen",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d2/3TZkovwm60LZjOLetTVZf.jpg", alt: "Blumenstrauß zum Muttertag" },
    bodyHtml: `
<p><strong>Muttertag 2026 ist am Sonntag, den 10. Mai.</strong> Der Tag fällt in Deutschland immer auf den zweiten Sonntag im Mai – deshalb wechselt das Datum von Jahr zu Jahr, während der Wochentag (Sonntag) gleich bleibt.</p>
<h2>Warum ist Muttertag nicht jedes Jahr am selben Datum?</h2>
<p>Anders als etwa Nikolaus (6. Dezember) ist der Muttertag ein <strong>beweglicher</strong> Anlass: Maßgeblich ist nicht ein festes Datum, sondern der zweite Sonntag im Mai. Dadurch liegt er je nach Jahr zwischen dem 8. und 14. Mai. Den genauen Termin und einen Countdown finden Sie auf der Seite <a href="/besondere-tage/2026/muttertag">Muttertag 2026</a>.</p>
<h2>Woher kommt der Muttertag?</h2>
<p>Der moderne Muttertag geht auf die US-Amerikanerin Anna Jarvis zurück und wird in Deutschland seit den 1920er-Jahren begangen. Gefeiert wird die Wertschätzung für Mütter – traditionell mit Blumen, einem Frühstück ans Bett und gebastelten Geschenken der Kinder.</p>
<h2>Ideen für den Muttertag</h2>
<ul>
<li>Ein Strauß Frühlingsblumen – Muttertag ist einer der wichtigsten Blumentage des Jahres.</li>
<li>Ein gemeinsames Frühstück oder ein Ausflug bei Mai-Wetter.</li>
<li>Ein selbst gestalteter Gutschein oder ein Foto-Kalender.</li>
</ul>
<p>Übrigens: Der männliche Gegenpart, der <a href="/besondere-tage/2026/vatertag">Vatertag 2026</a>, folgt nur wenige Tage später an Christi Himmelfahrt.</p>`,
    faq: [
      { q: "Wann ist Muttertag 2026?", a: "Muttertag 2026 ist am Sonntag, den 10. Mai – dem zweiten Sonntag im Mai." },
      { q: "Ist Muttertag ein Feiertag?", a: "Nein, der Muttertag ist kein gesetzlicher Feiertag. Da er ohnehin auf einen Sonntag fällt, ist er für die meisten arbeitsfrei." },
      { q: "Warum wechselt das Datum jedes Jahr?", a: "Weil der Muttertag immer auf den zweiten Sonntag im Mai fällt und nicht auf ein festes Kalenderdatum." },
    ],
    source: "seed",
  },
  {
    slug: "vatertag-2026-christi-himmelfahrt",
    title: "Vatertag 2026: Warum am selben Tag wie Christi Himmelfahrt?",
    excerpt:
      "Vatertag 2026 ist am 14. Mai – immer an Christi Himmelfahrt. Warum beide Tage zusammenfallen, warum Vatertag dadurch frei ist und woher der Brauch kommt.",
    category: "Feiertage & Urlaub",
    publishedAt: "2026-07-08",
    art: "vatertag",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d2/rpkCYY1qvtn3UVHFu5dLZ.jpg", alt: "Vatertag an Christi Himmelfahrt" },
    bodyHtml: `
<p><strong>Vatertag 2026 ist am Donnerstag, den 14. Mai.</strong> In Deutschland fällt der Vatertag – auch Männertag oder Herrentag genannt – immer auf <strong>Christi Himmelfahrt</strong>, einen bundesweiten gesetzlichen Feiertag.</p>
<h2>Warum fallen Vatertag und Christi Himmelfahrt zusammen?</h2>
<p>Christi Himmelfahrt wird 39 Tage nach Ostersonntag gefeiert und ist deshalb immer ein Donnerstag. Der weltliche Vatertag hat sich im Lauf der Zeit genau auf diesen Feiertag gelegt. Das Praktische daran: Weil Christi Himmelfahrt ein <a href="/feiertage/2026">gesetzlicher Feiertag</a> ist, ist der Vatertag automatisch arbeitsfrei.</p>
<h2>Ein Feiertag – ein perfekter Brückentag</h2>
<p>Da der Tag stets auf einen Donnerstag fällt, ist der Freitag danach der klassische Brückentag: Mit nur einem Urlaubstag entsteht ein langes Wochenende. Wie Sie 2026 solche Konstellationen optimal nutzen, zeigt die Übersicht der <a href="/brueckentage/2026">Brückentage 2026</a>.</p>
<h2>Woher kommt der Vatertag?</h2>
<p>Der Brauch geht auf Herrenpartien im 19. Jahrhundert zurück. Bis heute sind Ausflüge mit dem Bollerwagen, Wanderungen und Radtouren verbreitet – zunehmend auch als Familientag. Den genauen Termin samt Countdown finden Sie unter <a href="/besondere-tage/2026/vatertag">Vatertag 2026</a>.</p>`,
    faq: [
      { q: "Wann ist Vatertag 2026?", a: "Vatertag 2026 ist am Donnerstag, den 14. Mai – zeitgleich mit Christi Himmelfahrt." },
      { q: "Ist Vatertag ein gesetzlicher Feiertag?", a: "Der Vatertag selbst nicht, aber er fällt immer auf Christi Himmelfahrt, und dieser Tag ist bundesweit ein gesetzlicher Feiertag. Damit ist Vatertag arbeitsfrei." },
    ],
    source: "seed",
  },
  {
    slug: "karneval-2026-termine-rosenmontag",
    title: "Karneval 2026: Termine von Weiberfastnacht bis Aschermittwoch",
    excerpt:
      "Karneval 2026: Weiberfastnacht am 12. Februar, Rosenmontag am 16. Februar, Aschermittwoch am 18. Februar. Alle Termine der fünften Jahreszeit im Überblick.",
    category: "Kalender-Wissen",
    publishedAt: "2026-07-07",
    art: "karneval",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d3/QIinyUhUvstJPLcKNzSqU.jpg", alt: "Karneval 2026: Masken und Konfetti" },
    bodyHtml: `
<p>Die „fünfte Jahreszeit" erreicht 2026 Mitte Februar ihren Höhepunkt. Weil sich alle Termine nach dem Osterdatum richten, wechseln sie jedes Jahr. <strong>2026 fällt der Rosenmontag auf den 16. Februar.</strong></p>
<h2>Die Karnevalstage 2026 im Überblick</h2>
<ul>
<li><strong>Weiberfastnacht:</strong> Donnerstag, 12. Februar 2026 – Start des Straßenkarnevals</li>
<li><strong>Rosenmontag:</strong> Montag, 16. Februar 2026 – die großen Umzüge</li>
<li><strong>Fastnachtsdienstag:</strong> Dienstag, 17. Februar 2026 – der Kehraus</li>
<li><strong>Aschermittwoch:</strong> Mittwoch, 18. Februar 2026 – Ende des Karnevals</li>
</ul>
<h2>Warum wechseln die Karnevalstermine jedes Jahr?</h2>
<p>Alle Tage hängen am beweglichen Osterfest: Aschermittwoch liegt 46 Tage vor Ostersonntag, Rosenmontag 48 Tage. Detailseiten mit Countdown gibt es für <a href="/besondere-tage/2026/weiberfastnacht">Weiberfastnacht</a>, <a href="/besondere-tage/2026/rosenmontag">Rosenmontag</a> und <a href="/besondere-tage/2026/aschermittwoch">Aschermittwoch</a>.</p>
<h2>Ist Rosenmontag ein Feiertag?</h2>
<p>Nein – Rosenmontag ist in keinem Bundesland ein gesetzlicher Feiertag. In den Hochburgen wie Köln, Düsseldorf und Mainz geben aber viele Betriebe und Schulen frei. Das regelt der Arbeitgeber, nicht das Gesetz.</p>`,
    faq: [
      { q: "Wann ist Rosenmontag 2026?", a: "Rosenmontag 2026 ist am 16. Februar. Weiberfastnacht ist am 12. Februar, Aschermittwoch am 18. Februar." },
      { q: "Ist Rosenmontag ein gesetzlicher Feiertag?", a: "Nein. Rosenmontag ist in keinem Bundesland gesetzlicher Feiertag; in den Karnevalshochburgen ist er oft betrieblich arbeitsfrei." },
      { q: "Warum ändern sich die Karnevalstermine?", a: "Weil sie an das bewegliche Osterfest gekoppelt sind – Aschermittwoch liegt 46 Tage vor Ostersonntag." },
    ],
    source: "seed",
  },
  {
    slug: "advent-2026-erster-advent-termine",
    title: "Advent 2026: Wann ist der 1. Advent? Alle vier Adventssonntage",
    excerpt:
      "Der 1. Advent 2026 ist am 29. November. Hier finden Sie alle vier Adventssonntage 2026 mit Datum – und was es mit dem Adventskranz auf sich hat.",
    category: "Kalender-Wissen",
    publishedAt: "2026-07-06",
    art: "advent1",
    cover: { src: "https://v3b.fal.media/files/b/0aa191de/kcPasTDhZLNRtnw_vpHcK.jpg", alt: "Adventskranz mit vier Kerzen" },
    bodyHtml: `
<p><strong>Der 1. Advent 2026 ist am Sonntag, den 29. November.</strong> Mit ihm beginnt die Adventszeit und zugleich das neue Kirchenjahr. Der Advent umfasst die vier Sonntage vor Weihnachten.</p>
<h2>Die vier Adventssonntage 2026</h2>
<ul>
<li><strong>1. Advent:</strong> 29. November 2026</li>
<li><strong>2. Advent:</strong> 6. Dezember 2026</li>
<li><strong>3. Advent:</strong> 13. Dezember 2026</li>
<li><strong>4. Advent:</strong> 20. Dezember 2026</li>
</ul>
<p>Praktisch: Der <a href="/besondere-tage/2026/nikolaus">Nikolaustag</a> am 6. Dezember fällt 2026 direkt auf den 2. Advent. Details und Countdown zum Auftakt gibt es unter <a href="/besondere-tage/2026/erster-advent">1. Advent 2026</a>.</p>
<h2>Warum wechselt das Datum des 1. Advents?</h2>
<p>Der 1. Advent ist der vierte Sonntag vor dem 1. Weihnachtsfeiertag. Weil der 25. Dezember auf unterschiedliche Wochentage fällt, liegt der 1. Advent je nach Jahr zwischen dem 27. November und dem 3. Dezember.</p>
<h2>Der Adventskranz</h2>
<p>An jedem Adventssonntag wird eine weitere Kerze entzündet – bis am 4. Advent alle vier brennen. Der Brauch geht auf den Hamburger Theologen Johann Hinrich Wichern im 19. Jahrhundert zurück. Den passenden Monatskalender finden Sie unter <a href="/kalender/dezember-2026">Dezember 2026</a>.</p>`,
    faq: [
      { q: "Wann ist der 1. Advent 2026?", a: "Der 1. Advent 2026 ist am Sonntag, den 29. November." },
      { q: "Wann sind die Adventssonntage 2026?", a: "1. Advent 29. November, 2. Advent 6. Dezember, 3. Advent 13. Dezember, 4. Advent 20. Dezember 2026." },
    ],
    source: "seed",
  },
  {
    slug: "nikolaus-2026-brauch-stiefel",
    title: "Nikolaus 2026: Datum, Brauch und warum der Stiefel vor die Tür kommt",
    excerpt:
      "Nikolaus ist am 6. Dezember – 2026 zugleich der 2. Advent. Woher der Brauch mit dem Stiefel stammt und was den Nikolaus vom Weihnachtsmann unterscheidet.",
    category: "Kalender-Wissen",
    publishedAt: "2026-07-05",
    art: "nikolaus",
    cover: { src: "https://v3b.fal.media/files/b/0aa191de/ZkC5MsqqUeEmdTyNbUWzg.jpg", alt: "Nikolaus: gefüllter Stiefel vor der Tür" },
    bodyHtml: `
<p><strong>Der Nikolaustag ist immer am 6. Dezember</strong> – 2026 fällt er zugleich auf den 2. Advent. In der Nacht zuvor stellen Kinder ihre geputzten Stiefel vor die Tür, die der Nikolaus mit Süßigkeiten, Nüssen und Mandarinen füllt.</p>
<h2>Woher kommt der Nikolausbrauch?</h2>
<p>Der Tag erinnert an den heiligen Nikolaus von Myra, einen Bischof des 4. Jahrhunderts und Schutzpatron der Kinder. Überliefert ist seine Mildtätigkeit – daraus entwickelte sich der Brauch des Beschenkens. Mehr zum Termin samt Countdown gibt es unter <a href="/besondere-tage/2026/nikolaus">Nikolaus 2026</a>.</p>
<h2>Nikolaus oder Weihnachtsmann – wo ist der Unterschied?</h2>
<p>Der Nikolaus ist eine historische Bischofsgestalt mit Mitra und Stab und kommt am 6. Dezember. Der Weihnachtsmann ist eine jüngere, weltliche Figur, die mit <a href="/besondere-tage/2026/heiligabend">Heiligabend</a> verbunden ist. In manchen Regionen begleitet Knecht Ruprecht den Nikolaus.</p>
<h2>Ist der Nikolaustag ein Feiertag?</h2>
<p>Nein, der 6. Dezember ist kein gesetzlicher Feiertag. Er ist aber ein fester und beliebter Brauchtumstag in der Adventszeit.</p>`,
    faq: [
      { q: "Wann ist Nikolaus 2026?", a: "Der Nikolaustag ist am 6. Dezember 2026 – in diesem Jahr zugleich der 2. Advent." },
      { q: "Ist Nikolaus ein Feiertag?", a: "Nein, der Nikolaustag ist kein gesetzlicher Feiertag." },
    ],
    source: "seed",
  },
  {
    slug: "halloween-2026-herkunft-braeuche",
    title: "Halloween 2026: Datum, Herkunft und Bräuche in Deutschland",
    excerpt:
      "Halloween ist am 31. Oktober. Woher das Fest kommt, warum es auf denselben Tag wie der Reformationstag fällt und welche Bräuche in Deutschland üblich sind.",
    category: "Kalender-Wissen",
    publishedAt: "2026-07-04",
    art: "kuerbis",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d3/XBn7cfxd9Kl98UnzG7LYd.jpg", alt: "Halloween: leuchtende Kürbislaternen" },
    bodyHtml: `
<p><strong>Halloween ist jedes Jahr am 31. Oktober</strong>, dem Vorabend von Allerheiligen. Auch in Deutschland gehören Kürbislaternen, Kostüme und „Süßes oder Saures" ziehende Kinder inzwischen dazu.</p>
<h2>Woher kommt Halloween?</h2>
<p>Der Ursprung liegt im keltischen Fest Samhain und im Vorabend von Allerheiligen (englisch „All Hallows' Eve"). Über die USA kam der Brauch in den 1990er-Jahren nach Deutschland und etablierte sich als Kostüm- und Kinderfest. Termin und Countdown finden Sie unter <a href="/besondere-tage/2026/halloween">Halloween 2026</a>.</p>
<h2>Halloween und der Reformationstag</h2>
<p>Der 31. Oktober ist zugleich der <strong>Reformationstag</strong>, der in mehreren Bundesländern ein gesetzlicher Feiertag ist. Welche Länder das betrifft, zeigt die Übersicht der <a href="/feiertage/2026">Feiertage 2026</a>. Halloween selbst ist kein Feiertag.</p>
<h2>Vom Kürbis bis zum Laternenzug</h2>
<p>Nur wenige Tage später folgt mit dem <a href="/besondere-tage/2026/martinstag">Martinstag</a> am 11. November ein weiterer herbstlicher Lichterbrauch – dann ziehen Kinder mit Laternen statt mit Kürbissen.</p>`,
    faq: [
      { q: "Wann ist Halloween 2026?", a: "Halloween ist am 31. Oktober 2026." },
      { q: "Ist Halloween ein Feiertag?", a: "Nein. Am 31. Oktober ist jedoch der Reformationstag, der in einigen Bundesländern gesetzlicher Feiertag ist." },
    ],
    source: "seed",
  },
  {
    slug: "eisheiligen-2026-termine-bauernregel",
    title: "Eisheiligen 2026: Termine, Namen und was die Bauernregel sagt",
    excerpt:
      "Die Eisheiligen liegen Mitte Mai (11.–15. Mai) und gelten als letzte Frostperiode. Ihre Namen, die kalte Sophie und was hinter der Bauernregel steckt.",
    category: "Mond & Natur",
    publishedAt: "2026-07-03",
    art: "eis",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d3/6HVQqVcnZxmdpC-QtJ5RE.jpg", alt: "Eisheiligen: Frost auf Frühlingsblüten" },
    bodyHtml: `
<p>Die <strong>Eisheiligen</strong> sind eine Reihe von Gedenktagen Mitte Mai, die im Volksglauben für die letzten Nachtfröste des Frühlings stehen. Wer im Garten empfindliche Pflanzen setzt, wartet traditionell, bis sie vorüber sind.</p>
<h2>Wann sind die Eisheiligen?</h2>
<ul>
<li><strong>Mamertus:</strong> 11. Mai</li>
<li><strong>Pankratius:</strong> 12. Mai</li>
<li><strong>Servatius:</strong> 13. Mai</li>
<li><strong>Bonifatius:</strong> 14. Mai</li>
<li><strong>Kalte Sophie:</strong> 15. Mai</li>
</ul>
<p>In Norddeutschland zählt man oft nur die ersten drei Tage, in Süddeutschland eher Pankratius bis zur kalten Sophie. Die Namen tauchen auch im <a href="/namenstage">Namenstagskalender</a> auf.</p>
<h2>Was sagt die Bauernregel?</h2>
<p>„Pflanze nie vor der kalten Sophie" ist die bekannteste Merkregel. Sie gehört zu den <a href="/bauernregeln">Bauernregeln und Lostagen</a> – überliefertem Erfahrungswissen ohne wissenschaftlich-meteorologischen Anspruch. Statistisch gibt es Mitte Mai tatsächlich häufiger einen Kaltlufteinbruch, verlässlich ist die Regel aber nicht.</p>
<h2>Passend dazu</h2>
<p>Den Monatskalender finden Sie unter <a href="/kalender/mai-2026">Mai 2026</a>, die Mondphasen des Monats unter <a href="/mondphasen/2026">Mondphasen 2026</a>.</p>`,
    faq: [
      { q: "Wann sind die Eisheiligen 2026?", a: "Die Eisheiligen liegen wie jedes Jahr vom 11. bis 15. Mai: Mamertus, Pankratius, Servatius, Bonifatius und die kalte Sophie." },
      { q: "Stimmt die Bauernregel zu den Eisheiligen?", a: "Sie beschreibt eine reale Tendenz zu Kaltlufteinbrüchen Mitte Mai, ist aber keine verlässliche Wettervorhersage, sondern überliefertes Erfahrungswissen." },
    ],
    source: "seed",
  },
  {
    slug: "siebenschlaefer-2026-bauernregel",
    title: "Siebenschläfer 2026: Was die Bauernregel wirklich bedeutet",
    excerpt:
      "Der Siebenschläfertag ist am 27. Juni. Was die berühmte Bauernregel über den Sommer aussagt, woher der Name kommt und wie viel dran ist.",
    category: "Mond & Natur",
    publishedAt: "2026-07-02",
    art: "sonne",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d4/moU5dM7F-WdbnAF1t6h2k.jpg", alt: "Siebenschläfer: sonniger Sommerhimmel" },
    bodyHtml: `
<p>Der <strong>Siebenschläfertag am 27. Juni</strong> gehört zu den bekanntesten Lostagen im deutschen Kalender. Die Bauernregel lautet: „Wie das Wetter am Siebenschläfer sich verhält, ist es sieben Wochen lang bestellt."</p>
<h2>Woher kommt der Name?</h2>
<p>Der Name geht nicht auf das gleichnamige Nagetier zurück, sondern auf die Legende der „Sieben Schläfer von Ephesus" – christliche Märtyrer, die der Überlieferung nach in einer Höhle über Jahrhunderte schliefen. Der Tag erscheint auch im <a href="/namenstage">Namenstagskalender</a>.</p>
<h2>Wie viel ist an der Regel dran?</h2>
<p>Meteorologen sehen einen wahren Kern: Ende Juni/Anfang Juli stellt sich häufig eine stabile Großwetterlage ein, die den weiteren Sommer prägt. Wegen der Kalenderreform bezieht sich die Regel eher auf Anfang Juli als exakt auf den 27. Juni. Wie bei allen <a href="/bauernregeln">Bauernregeln</a> gilt: ein statistischer Anhaltspunkt, keine Vorhersage.</p>
<h2>Passend dazu</h2>
<p>Den Kalender des Monats finden Sie unter <a href="/kalender/juni-2026">Juni 2026</a>.</p>`,
    faq: [
      { q: "Wann ist Siebenschläfer 2026?", a: "Der Siebenschläfertag ist am 27. Juni 2026." },
      { q: "Stimmt die Siebenschläfer-Regel?", a: "Sie hat einen wahren Kern, weil sich Anfang Juli oft eine stabile Wetterlage einstellt. Als exakte Vorhersage taugt sie aber nicht." },
    ],
    source: "seed",
  },
  {
    slug: "vollmond-2026-alle-termine",
    title: "Vollmond 2026: Alle Termine im Überblick",
    excerpt:
      "Wann ist 2026 Vollmond? Alle Vollmond-Termine des Jahres mit genauer Uhrzeit, dazu Wissenswertes zu Mondphasen, Neumond und dem Blue Moon.",
    category: "Mond & Natur",
    publishedAt: "2026-07-01",
    art: "mond",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d4/TqteqM0vS1RZNLTKlZL_E.jpg", alt: "Vollmond über nächtlicher Landschaft" },
    bodyHtml: `
<p>Rund 12- bis 13-mal im Jahr steht der Mond der Sonne genau gegenüber und erscheint als volle Scheibe – der <strong>Vollmond</strong>. Die exakten Termine und Uhrzeiten für Deutschland finden Sie in unserer Jahresübersicht.</p>
<h2>Wann ist 2026 Vollmond?</h2>
<p>Alle Vollmond-Termine des Jahres mit minutengenauer Uhrzeit (astronomisch berechnet nach der Methode von Jean Meeus) listet die Seite <a href="/vollmond/2026">Vollmond 2026</a>. Die Gegenphase – den Neumond – finden Sie unter <a href="/neumond/2026">Neumond 2026</a>.</p>
<h2>Wie entstehen die Mondphasen?</h2>
<p>Der Mond leuchtet nicht selbst, sondern reflektiert das Sonnenlicht. Je nach Stellung zwischen Erde und Sonne sehen wir mehr oder weniger der beleuchteten Hälfte – von Neumond über zunehmenden Halbmond zum Vollmond und wieder zurück. Alle Phasen eines Jahres zeigt die Seite <a href="/mondphasen/2026">Mondphasen 2026</a>.</p>
<h2>Was ist ein Blue Moon?</h2>
<p>Als Blue Moon bezeichnet man den zweiten Vollmond innerhalb eines Kalendermonats – ein eher seltenes Ereignis. Mit der Farbe des Mondes hat der Name nichts zu tun.</p>`,
    faq: [
      { q: "Wie oft gibt es 2026 Vollmond?", a: "In der Regel 12- bis 13-mal pro Jahr. Die genauen Termine mit Uhrzeit finden Sie auf der Seite Vollmond 2026." },
      { q: "Was ist ein Blue Moon?", a: "Der zweite Vollmond innerhalb desselben Kalendermonats. Der Name bezieht sich nicht auf die Farbe." },
    ],
    source: "seed",
  },
  {
    slug: "sternzeichen-daten-elemente-uebersicht",
    title: "Sternzeichen: Daten, Elemente und welches wann gilt",
    excerpt:
      "Welches Sternzeichen habe ich? Alle 12 Tierkreiszeichen mit Zeitraum und Element im Überblick – von Widder bis Fische, plus die vier Elemente erklärt.",
    category: "Kalender-Wissen",
    publishedAt: "2026-06-28",
    art: "sterne",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d4/A3vV5Mu6S8GkQ_k4YVpYZ.jpg", alt: "Sternzeichen am Nachthimmel" },
    bodyHtml: `
<p>Das <strong>Sternzeichen</strong> richtet sich nach dem Geburtsdatum: Der Tierkreis teilt den Sonnenlauf in zwölf Abschnitte. Eine vollständige Übersicht mit Beschreibung finden Sie unter <a href="/sternzeichen">Sternzeichen</a>.</p>
<h2>Die 12 Sternzeichen und ihre Zeiträume</h2>
<ul>
<li>Widder (21.3.–20.4.), Stier (21.4.–20.5.), Zwillinge (21.5.–21.6.)</li>
<li>Krebs (22.6.–22.7.), Löwe (23.7.–23.8.), Jungfrau (24.8.–23.9.)</li>
<li>Waage (24.9.–23.10.), Skorpion (24.10.–22.11.), Schütze (23.11.–21.12.)</li>
<li>Steinbock (22.12.–19.1.), Wassermann (20.1.–18.2.), Fische (19.2.–20.3.)</li>
</ul>
<h2>Die vier Elemente</h2>
<p>Jedes Zeichen gehört zu einem von vier Elementen: <strong>Feuer</strong> (Widder, Löwe, Schütze), <strong>Erde</strong> (Stier, Jungfrau, Steinbock), <strong>Luft</strong> (Zwillinge, Waage, Wassermann) und <strong>Wasser</strong> (Krebs, Skorpion, Fische). Details zu jedem Zeichen – etwa zum <a href="/sternzeichen/loewe">Löwen</a> – gibt es auf den einzelnen Zeichenseiten.</p>
<h2>Verschieben sich die Daten?</h2>
<p>Die Übergänge können sich um einen Tag verschieben, weil das Tierkreisjahr nicht exakt mit dem Kalenderjahr übereinstimmt. Die Zuordnung ist eine kalendarische Einordnung – als Unterhaltung gedacht, nicht als Vorhersage.</p>`,
    faq: [
      { q: "Welches Sternzeichen habe ich?", a: "Das hängt vom Geburtsdatum ab. Wer z. B. zwischen 23. Juli und 23. August geboren ist, ist Löwe. Die genauen Zeiträume finden Sie in der Sternzeichen-Übersicht." },
      { q: "Welche Elemente gibt es?", a: "Feuer, Erde, Luft und Wasser – jedem Element sind drei Sternzeichen zugeordnet." },
    ],
    source: "seed",
  },
  {
    slug: "welcher-tag-ist-heute-datum-kw",
    title: "Welcher Tag ist heute? Datum, Kalenderwoche und Feiertag",
    excerpt:
      "Welcher Tag ist heute, der wievielte ist es und welche Kalenderwoche haben wir? So finden Sie Datum, KW, Feiertag und Namenstag jederzeit aktuell.",
    category: "Kalender-Wissen",
    publishedAt: "2026-06-26",
    art: "kalender",
    cover: { src: "https://v3b.fal.media/files/b/0aa191d5/6Wj_F6mb03vA1DDa3r4az.jpg", alt: "Kalender und Uhr: welcher Tag ist heute" },
    bodyHtml: `
<p>„Welcher Tag ist heute?", „Der wievielte ist heute?" oder „Welche Kalenderwoche haben wir gerade?" – diese Fragen lassen sich mit einem Blick beantworten. Die tagesaktuelle Antwort für Deutschland finden Sie auf der Seite <a href="/heute">Welcher Tag ist heute</a>.</p>
<h2>Datum und Wochentag</h2>
<p>Das aktuelle Datum inklusive Wochentag, Tag des Jahres und verbleibender Tage bis Jahresende zeigt die <a href="/heute">Heute-Seite</a> – immer in der deutschen Zeitzone (Europe/Berlin) berechnet, damit der Tageswechsel korrekt um Mitternacht erfolgt.</p>
<h2>Welche Kalenderwoche ist gerade?</h2>
<p>Deutschland zählt Kalenderwochen nach ISO 8601: Die Woche beginnt am Montag, und KW 1 ist die Woche mit dem 4. Januar. Alle Wochen eines Jahres mit Start- und Enddatum listet die Seite <a href="/kalenderwochen/2026">Kalenderwochen 2026</a>.</p>
<h2>Ist heute ein Feiertag?</h2>
<p>Ob heute ein bundesweiter oder regionaler Feiertag ist, hängt vom Bundesland ab. Die vollständige Übersicht bietet die Seite <a href="/feiertage/2026">Feiertage 2026</a>. Für einen einzelnen Tag lohnt sich das ausführliche Kalenderblatt mit Namenstag, Mondphase und Sonnenzeiten.</p>`,
    faq: [
      { q: "Welche Kalenderwoche haben wir gerade?", a: "Die aktuelle Kalenderwoche nach ISO 8601 sehen Sie jederzeit auf der Heute-Seite und in der Übersicht Kalenderwochen." },
      { q: "Wie wird 'heute' berechnet?", a: "Immer in der deutschen Zeitzone (Europe/Berlin), damit der Datumswechsel korrekt um Mitternacht MEZ/MESZ erfolgt." },
    ],
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
