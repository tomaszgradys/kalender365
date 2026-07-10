import { test } from "node:test";
import assert from "node:assert/strict";
import { validateDraft } from "../src/lib/de/blogQuality.ts";
import { getSeedPosts } from "../src/lib/de/blog.ts";

// Kalibrierung: Die Gate läuft ausschließlich über KI-Entwürfe, die laut Prompt
// 600–900 Wörter lang sein sollen. Die meisten Seed-Beiträge sind bewusst kurze
// Teaser (~150 Wörter) und damit eine andere Content-Klasse. Der Maßstab für
// „False-Negatives" ist deshalb der einzige Seed, der zum KI-Vertrag passt (der
// vollständige Pillar-Artikel): Ein echter Langartikel darf nie abgelehnt werden.
// Hinweis: {jahr}-Platzhalter wie zur Laufzeit auflösen.
test("vollständiger Langartikel besteht die Qualitätskontrolle", () => {
  const full = getSeedPosts().filter((p) => {
    const w = p.bodyHtml.replace(/<[^>]*>/g, " ").trim().split(/\s+/).length;
    return w >= 450;
  });
  assert.ok(full.length >= 1, "kein Langartikel im Seed vorhanden");
  for (const p of full) {
    const body = p.bodyHtml.replaceAll("{jahr}", "2026");
    const r = validateDraft({ title: p.title, slug: p.slug, excerpt: p.excerpt, category: p.category, bodyHtml: body });
    assert.ok(r.ok, `Seed „${p.slug}" abgelehnt: ${r.reasons.join("; ")}`);
  }
});

test("abgeschnittener Body wird abgelehnt", () => {
  const r = validateDraft({
    title: "Feiertage im Mai: Was Sie wissen sollten",
    slug: "feiertage-im-mai",
    excerpt: "Alle Feiertage im Mai in Deutschland auf einen Blick – mit Brückentagen und Tipps für lange Wochenenden im Frühjahr.",
    category: "Feiertage & Urlaub",
    bodyHtml: "<p>Der Mai ist reich an Feiertagen. Zuerst der Tag der Arbeit, dann Christi Himmel",
  });
  assert.equal(r.ok, false);
});

test("zu wenige interne Links wird abgelehnt", () => {
  const body = "<p>" + "Wort ".repeat(500) + "</p><h2>A</h2><p>x</p><h2>B</h2><p>y</p><h2>C</h2><p>z</p>";
  const r = validateDraft({
    title: "Ein ausreichend langer Titel zum Thema",
    slug: "ein-titel",
    excerpt: "Eine Meta-Description mit passender Länge zwischen hundertzehn und hundertfünfundsiebzig Zeichen für die Suchergebnisse hier.",
    category: "Kalender-Wissen",
    bodyHtml: body,
  });
  assert.equal(r.ok, false);
  assert.ok(r.reasons.some((x) => x.includes("interne Links")));
});

test("Link auf nicht existierende Seite wird abgelehnt", () => {
  const body =
    "<p>" + "Wort ".repeat(500) +
    '<a href="/erfundene-seite/2026">Link</a> <a href="/feiertage/2026">ok</a></p>' +
    "<h2>A</h2><p>x</p><h2>B</h2><p>y</p><h2>C</h2><p>z</p>";
  const r = validateDraft({
    title: "Ein ausreichend langer Titel zum Thema",
    slug: "ein-titel",
    excerpt: "Eine Meta-Description mit passender Länge zwischen hundertzehn und hundertfünfundsiebzig Zeichen für die Suchergebnisse hier.",
    category: "Kalender-Wissen",
    bodyHtml: body,
  });
  assert.equal(r.ok, false);
  assert.ok(r.reasons.some((x) => x.includes("unbekannte Seiten")));
});

test("KI-Artefakt (Markdown-Zaun) wird abgelehnt", () => {
  const body =
    "<p>```html</p><p>" + "Wort ".repeat(500) +
    '<a href="/feiertage/2026">a</a> <a href="/brueckentage/2026">b</a></p>' +
    "<h2>A</h2><p>x</p><h2>B</h2><p>y</p><h2>C</h2><p>z</p>";
  const r = validateDraft({
    title: "Ein ausreichend langer Titel zum Thema",
    slug: "ein-titel",
    excerpt: "Eine Meta-Description mit passender Länge zwischen hundertzehn und hundertfünfundsiebzig Zeichen für die Suchergebnisse hier.",
    category: "Kalender-Wissen",
    bodyHtml: body,
  });
  assert.equal(r.ok, false);
  assert.ok(r.reasons.some((x) => x.includes("KI-Artefakt")));
});
