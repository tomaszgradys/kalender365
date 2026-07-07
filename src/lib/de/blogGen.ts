// AI blog generation via the official Anthropic SDK. Picks a fresh, seasonally
// relevant German calendar topic and returns a structured post. Deterministic
// data (Feiertage, KW, …) is never generated here — only editorial prose.

import Anthropic from "@anthropic-ai/sdk";
import { BLOG_CATEGORIES, type BlogPost } from "./blog";
import { berlinNow } from "./now";
import { formatLongDE, MONTH_NAMES_DE } from "./locale";
import { sanitizeHtml } from "./sanitize";

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

  const system = `Du bist Redakteur:in von Kalender365.pro, einem kostenlosen deutschen Kalender-Portal (Feiertage, Schulferien, Brückentage, Kalenderwochen, Arbeitstage, Mondphasen, Zeitumstellung – für Deutschland und alle Bundesländer).

Schreibe hilfreiche, faktisch korrekte, gut lesbare Ratgeber-Artikel auf Deutsch (de-DE, Sie-Form, neutral und praktisch). Kein Marketing-Geschwätz, keine Emojis, keine Polonismen.

Regeln:
- Wähle ein sinnvolles, saisonal passendes Thema aus dem Kalender-/Feiertags-/Ferien-/Zeit-Umfeld. Vermeide die unten genannten bereits vorhandenen Themen.
- 500–800 Wörter. Struktur: eine kurze Einleitung, danach 2–4 Abschnitte mit <h2>-Überschriften, <p>-Absätzen und ggf. <ul>/<li>-Listen. Nur diese HTML-Tags, KEINE <h1>, keine Inline-Styles, keine <script>.
- Verlinke 1–3 Mal auf passende interne Seiten (relative Pfade), z. B. /feiertage/${year}, /brueckentage/${year}, /schulferien/${year}, /kalenderwochen/${year}, /arbeitstage/${year}, /urlaubsplaner/${year}, /mondphasen/${year}, /zeitumstellung/${year}, /jahreszeiten/${year}. Nutze <a href="...">Ankertext</a>. Keine externen Links.
- Nenne keine tagesgenauen Ferien- oder Feiertagsdaten, die falsch sein könnten – bleibe bei Erklärungen/Prinzipien und verweise für konkrete Termine auf die interne Seite. Bei rechtlichen/arbeitsrechtlichen Aussagen: neutral bleiben und „ohne Gewähr" / „abhängig von Vertrag und Tarif" ergänzen.
- slug: nur Kleinbuchstaben, Ziffern und Bindestriche (Umlaute transkribiert).`;

  const user = `Heutiger Kontext: ${today}, Monat ${season} ${year}. Erstelle genau einen Artikel, der jetzt gut passt.

Bereits vorhandene Themen (bitte vermeiden):
Titel: ${(opts.avoidTitles ?? []).slice(0, 40).join(" | ") || "(keine)"}
Slugs: ${(opts.avoidSlugs ?? []).slice(0, 60).join(", ") || "(keine)"}`;

  // output_config (effort + structured JSON output) is GA on the wire; the SDK
  // param type may lag, so build the body then cast at the call boundary.
  const params = {
    model: MODEL,
    max_tokens: 8000,
    thinking: { type: "adaptive" as const },
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
          },
          required: ["title", "slug", "excerpt", "category", "bodyHtml"],
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
  const parsed = JSON.parse(text.text) as GeneratedPost;

  const slug = slugify(parsed.slug || parsed.title);
  const publishedAt = `${year}-${String(month0 + 1).padStart(2, "0")}-${String(berlinNow().day).padStart(2, "0")}`;
  return {
    title: parsed.title.trim(),
    slug,
    excerpt: parsed.excerpt.trim(),
    category: parsed.category,
    bodyHtml: sanitizeHtml(parsed.bodyHtml.trim()),
    publishedAt,
  };
}
