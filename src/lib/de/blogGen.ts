// AI blog generation via the official Anthropic SDK. Picks a fresh, seasonally
// relevant German calendar topic and returns a structured post. Deterministic
// data (Feiertage, KW, …) is never generated here — only editorial prose.

import Anthropic from "@anthropic-ai/sdk";
import { BLOG_CATEGORIES, type BlogPost } from "./blog";
import { berlinNow } from "./now";
import { formatLongDE, MONTH_NAMES_DE } from "./locale";
import { sanitizeHtml } from "./sanitize";
import { radarForPrompt } from "./blogRadar";
import { validateDraft } from "./blogQuality";

/** Draft hat die Qualitätskontrolle nicht bestanden — nicht veröffentlichen. */
export class QualityError extends Error {
  constructor(public reasons: string[]) {
    super(`Qualitätskontrolle fehlgeschlagen: ${reasons.join("; ")}`);
    this.name = "QualityError";
  }
}

const MODEL = "claude-opus-4-8";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae").replace(/ö/g, "oe").replace(/ü/g, "ue").replace(/ß/g, "ss")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export type GeneratedPost = Omit<BlogPost, "source">;

/** Generiert ein Titelbild via fal.ai (FLUX). Gibt null zurück wenn FAL_KEY fehlt oder der Call scheitert. */
export async function genCoverImage(imagePrompt: string): Promise<string | null> {
  const FAL = process.env.FAL_KEY;
  if (!FAL) return null;
  const STYLE =
    "editorial flat vector illustration, deep navy blue and white with a vivid green accent and soft periwinkle details, soft shadows, calm, no text, no letters, no watermark, wide landscape banner";
  try {
    const res = await fetch("https://fal.run/fal-ai/flux/dev", {
      method: "POST",
      headers: { Authorization: `Key ${FAL}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: `${imagePrompt}. ${STYLE}`,
        image_size: { width: 1216, height: 640 },
        num_inference_steps: 30,
        num_images: 1,
        enable_safety_checker: true,
      }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { images?: { url: string }[] };
    return data.images?.[0]?.url ?? null;
  } catch {
    return null;
  }
}

/**
 * Generate one blog post. `avoidSlugs`/`avoidTitles` steer the model away from
 * topics already covered. Throws if ANTHROPIC_API_KEY is missing.
 */
export async function generatePost(opts: {
  avoidSlugs?: string[];
  avoidTitles?: string[];
}): Promise<GeneratedPost> {
  if (!process.env.ANTHROPIC_API_KEY) throw new Error("ANTHROPIC_API_KEY not configured");
  const client = new Anthropic();

  const { year, month0 } = berlinNow();
  const today = formatLongDE(`${year}-${String(month0 + 1).padStart(2, "0")}-01`);
  const season = MONTH_NAMES_DE[month0];
  const radar = radarForPrompt();

  const system = `Du bist SEO-Redakteur:in von Kalender365.pro, einem kostenlosen deutschen Kalender-Portal (Feiertage, Schulferien, Brückentage, Kalenderwochen, Arbeitstage, Mondphasen, Zeitumstellung – für Deutschland und alle Bundesländer).

Schreibe hilfreiche, faktisch korrekte, gut lesbare Ratgeber-Artikel auf Deutsch (de-DE, Sie-Form, neutral und praktisch). Kein Marketing-Geschwätz, keine Emojis, keine Polonismen.

Themenwahl (WICHTIG – Timing & Suchintention):
- Wähle bevorzugt ein Thema, das an einen der unten genannten NAHENDEN Termine anknüpft. Ideal ist ein Vorlauf von einigen Tagen bis wenigen Wochen, damit der Artikel genau dann rankt, wenn die Deutschen danach suchen (z. B. „Brückentage rund um …", „Wann beginnen die Herbstferien …", „Zeitumstellung Winterzeit …").
- Der Titel soll einer echten Google-Suchanfrage entsprechen (Suchintention treffen), das Haupt-Keyword früh enthalten und OHNE Markennamen sein (max. ~60 Zeichen).
- Ist im Fenster kein markanter Termin, wähle ein stark und dauerhaft gesuchtes Evergreen-Thema aus dem Kalenderumfeld.

Regeln:
- 600–900 Wörter. Struktur: kurze, keyword-starke Einleitung (Haupt-Keyword im ersten Satz), danach 3–5 Abschnitte mit aussagekräftigen <h2>-Überschriften (gern als konkrete Nutzerfragen formuliert), <p>-Absätzen und ggf. <ul>/<li>-Listen. Nur diese HTML-Tags, KEINE <h1>, keine Inline-Styles, keine <script>.
- Verlinke 2–4 Mal auf passende interne Seiten (relative Pfade), z. B. /feiertage/${year}, /brueckentage/${year}, /schulferien/${year}, /kalenderwochen/${year}, /arbeitstage/${year}, /urlaubsplaner/${year}, /mondphasen/${year}, /zeitumstellung/${year}, /jahreszeiten/${year}. Nutze <a href="...">Ankertext</a> mit beschreibendem Text. Keine externen Links, keine Links auf nicht existierende Seiten.
- Die im Radar genannten Datumsangaben darfst du übernehmen (sie sind exakt berechnet). Erfinde darüber hinaus KEINE tagesgenauen Ferien-/Feiertagsdaten – bleibe sonst bei Erklärungen/Prinzipien und verweise für weitere konkrete Termine auf die interne Seite. Bei rechtlichen/arbeitsrechtlichen Aussagen neutral bleiben und „ohne Gewähr" / „abhängig von Vertrag und Tarif" ergänzen.
- excerpt = Meta-Description: 140–160 Zeichen, mit Haupt-Keyword, als eigenständiger Teaser (kein „In diesem Artikel …").
- slug: nur Kleinbuchstaben, Ziffern und Bindestriche (Umlaute transkribiert).`;

  const user = `Heutiger Kontext: ${today}, Monat ${season} ${year}. Erstelle genau einen Artikel, der JETZT optimal passt.

Radar der nahenden deutschen Kalendertermine (exakt berechnet, für Timing & Themenwahl nutzen):
${radar}

Bereits vorhandene Themen (bitte vermeiden, nicht wiederholen):
Titel: ${(opts.avoidTitles ?? []).slice(0, 40).join(" | ") || "(keine)"}
Slugs: ${(opts.avoidSlugs ?? []).slice(0, 60).join(", ") || "(keine)"}`;

  // output_config (effort + structured JSON output) is GA on the wire; the SDK
  // param type may lag, so build the body then cast at the call boundary.
  // Kein `thinking: adaptive` bei strukturierter JSON-Ausgabe: es teilt sich das
  // max_tokens-Budget mit dem Artikel und kann den bodyHtml mitten im Satz
  // abschneiden (Projekt-Lernkurve aus den Klonen). Die Reasoning-Tiefe steuert
  // stattdessen output_config.effort. max_tokens großzügig für Headroom.
  const params = {
    model: MODEL,
    max_tokens: 12000,
    system,
    messages: [{ role: "user" as const, content: user }],
    output_config: {
      effort: "high",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: {
            title: { type: "string" },
            slug: { type: "string" },
            excerpt: { type: "string" },
            category: { type: "string", enum: BLOG_CATEGORIES },
            bodyHtml: { type: "string" },
            imagePrompt: {
              type: "string",
              description:
                "Kurze englische Bildbeschreibung (Motiv, keine Texte/Schrift) fuer ein Titelbild, das den Kernthema des Artikels illustriert.",
            },
          },
          required: ["title", "slug", "excerpt", "category", "bodyHtml", "imagePrompt"],
          additionalProperties: false,
        },
      },
    },
  };
  const response = await client.messages.create(
    params as unknown as Anthropic.MessageCreateParamsNonStreaming,
  );

  const text = response.content.find((b) => b.type === "text");
  if (!text || text.type !== "text") throw new Error("Keine Textantwort erhalten");
  const parsed = JSON.parse(text.text) as GeneratedPost & { imagePrompt?: string };

  const slug = slugify(parsed.slug || parsed.title);
  const publishedAt = `${year}-${String(month0 + 1).padStart(2, "0")}-${String(berlinNow().day).padStart(2, "0")}`;
  const title = parsed.title.trim();
  const bodyHtml = sanitizeHtml(parsed.bodyHtml.trim());

  // Qualitätskontrolle VOR der (kostenpflichtigen) Titelbild-Generierung: ein
  // zu kurzer, abgeschnittener oder falsch verlinkter Entwurf wird gar nicht
  // erst bebildert und nicht veröffentlicht.
  const quality = validateDraft({ title, slug, excerpt: parsed.excerpt.trim(), category: parsed.category, bodyHtml });
  if (!quality.ok) throw new QualityError(quality.reasons);

  const coverUrl = await genCoverImage(parsed.imagePrompt || title);

  return {
    title,
    slug,
    excerpt: parsed.excerpt.trim(),
    category: parsed.category,
    bodyHtml,
    publishedAt,
    cover: coverUrl ? { src: coverUrl, alt: title } : undefined,
  };
}
