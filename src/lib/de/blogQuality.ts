// Editorial quality gate for AI-generated blog posts. Runs on the draft BEFORE
// it is written to the DB (and before a cover image is paid for), so nothing
// thin, truncated or with broken internal links ever goes live. Quality over
// cadence: a failing draft is regenerated once and otherwise silently skipped.

import { BLOG_CATEGORIES, type BlogCategory } from "./blog";

export type Draft = {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  bodyHtml: string; // already sanitized
};

// Erste Pfad-Segmente, die tatsächlich als Seiten existieren. Interne Links im
// Fließtext dürfen nur hierauf zeigen — verhindert 404-Links (Discover-schädlich)
// und erfundene Routen. Bei neuen Money-Pages hier ergänzen.
const KNOWN_ROUTE_SEGMENTS = new Set([
  "feiertage", "brueckentage", "schulferien", "sommerferien", "herbstferien",
  "osterferien", "weihnachtsferien", "kalenderwochen", "kalender", "arbeitstage",
  "arbeitstage-rechner", "urlaubsplaner", "mondphasen", "mondkalender", "vollmond",
  "neumond", "jahreszeiten", "zeitumstellung", "besondere-tage", "namenstage",
  "bauernregeln", "sternzeichen", "heute", "kw", "tage-rechner", "wochentag-rechner",
  "altersrechner", "wie-viele-tage-bis", "wie-viele-tage-bis-zu-den-sommerferien",
  "countdown", "sonnenaufgang-sonnenuntergang", "kalenderblatt", "blog",
  "kalender-zum-ausdrucken", "ueber-uns", "generatoren",
]);

// Verräterische Reste eines misslungenen Generierungslaufs (Markdown-Zäune,
// Modell-Meta-Kommentare, abgeschnittene Template-Fragmente).
const AI_ARTIFACT_PATTERNS: RegExp[] = [
  /```/,
  /\bAs an AI\b/i,
  /\bIch kann (Ihnen )?(leider )?nicht\b/i,
  /\bals (KI|Sprachmodell)\b/i,
  /Correction needed/i,
  /\[(?:einf(ü|ue)gen|fortsetzen|weiter)\]/i,
  /\bLorem ipsum\b/i,
  /\{\{/, // übrig gebliebene Template-Platzhalter
];

function stripTags(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function countWords(text: string): number {
  return text ? text.split(/\s+/).filter(Boolean).length : 0;
}

function countMatches(html: string, re: RegExp): number {
  return (html.match(re) ?? []).length;
}

/** Interne Links aus dem Body ziehen (relative Pfade). */
function internalLinks(html: string): string[] {
  const out: string[] = [];
  const re = /<a\s+href="(\/[^"]*)"/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
}

export type QualityResult = { ok: boolean; reasons: string[] };

/**
 * Validate a generated draft. Returns every failed check so the reasons can be
 * logged/reported; `ok` is true only when the draft is publish-worthy.
 */
export function validateDraft(d: Draft): QualityResult {
  const reasons: string[] = [];
  const body = d.bodyHtml ?? "";
  const text = stripTags(body);
  const words = countWords(text);

  // --- Länge & Struktur ---
  // Der Prompt fordert 600–900 Wörter; die Gate-Untergrenze (450) ist bewusst
  // niedriger als das Ziel — sie soll nur abgeschnittene/dünne Ausreißer fangen,
  // nicht einen soliden, etwas kürzeren Artikel verwerfen.
  if (words < 450) reasons.push(`zu kurz (${words} Wörter, min. 450)`);
  if (words > 1300) reasons.push(`zu lang (${words} Wörter, max. 1300)`);
  const h2 = countMatches(body, /<h2>/gi);
  if (h2 < 2) reasons.push(`zu wenige <h2>-Abschnitte (${h2}, min. 2)`);
  if (countMatches(body, /<h1>/gi) > 0) reasons.push("enthält verbotenes <h1>");

  // --- Trunkierung: sauber geschlossen, endet nicht mitten im Satz ---
  const trimmed = body.trim();
  if (!trimmed.endsWith(">")) reasons.push("Body endet nicht mit einem geschlossenen Tag (evtl. abgeschnitten)");
  const openP = countMatches(body, /<p>/gi);
  const closeP = countMatches(body, /<\/p>/gi);
  if (openP !== closeP) reasons.push(`unbalancierte <p>-Tags (${openP} auf, ${closeP} zu)`);
  const openH2 = h2;
  const closeH2 = countMatches(body, /<\/h2>/gi);
  if (openH2 !== closeH2) reasons.push(`unbalancierte <h2>-Tags (${openH2} auf, ${closeH2} zu)`);
  const openUl = countMatches(body, /<ul>/gi);
  const closeUl = countMatches(body, /<\/ul>/gi);
  if (openUl !== closeUl) reasons.push(`unbalancierte <ul>-Tags (${openUl} auf, ${closeUl} zu)`);

  // --- Interne Verlinkung ---
  const links = internalLinks(body);
  if (links.length < 2) reasons.push(`zu wenige interne Links (${links.length}, min. 2)`);
  const badTargets = links.filter((href) => {
    const seg = href.split("/")[1]?.split(/[?#]/)[0] ?? "";
    return seg !== "" && !KNOWN_ROUTE_SEGMENTS.has(seg);
  });
  if (badTargets.length > 0) reasons.push(`Links auf unbekannte Seiten: ${[...new Set(badTargets)].join(", ")}`);
  if (/href="https?:\/\//i.test(body)) reasons.push("enthält externe Links (nur interne erlaubt)");

  // --- KI-Artefakte ---
  for (const re of AI_ARTIFACT_PATTERNS) {
    if (re.test(body) || re.test(d.title) || re.test(d.excerpt)) {
      reasons.push(`KI-Artefakt gefunden (${re.source.slice(0, 24)})`);
      break;
    }
  }

  // --- Titel & Meta-Description ---
  const titleLen = d.title.trim().length;
  if (titleLen < 15) reasons.push(`Titel zu kurz (${titleLen} Zeichen)`);
  if (titleLen > 70) reasons.push(`Titel zu lang (${titleLen} Zeichen, max. 70)`);
  const exLen = d.excerpt.trim().length;
  if (exLen < 110) reasons.push(`excerpt zu kurz (${exLen} Zeichen, min. 110)`);
  if (exLen > 175) reasons.push(`excerpt zu lang (${exLen} Zeichen, max. 175)`);

  // --- Kategorie ---
  if (!BLOG_CATEGORIES.includes(d.category as BlogCategory)) {
    reasons.push(`unbekannte Kategorie „${d.category}"`);
  }

  // --- Slug ---
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) reasons.push(`ungültiger Slug „${d.slug}"`);

  return { ok: reasons.length === 0, reasons };
}
