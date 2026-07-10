import type { MetadataRoute } from "next";
import { SITE_URL, COMPANY, CONTENT_VERSION } from "@/lib/de/site";
import { indexableYears } from "@/lib/de/year";
import { STATE_SLUGS } from "@/lib/de/bundeslaender";
import { MONTH_SLUGS_DE } from "@/lib/de/locale";
import { berlinNow, berlinToday } from "@/lib/de/now";
import { statesWithData, getFerienByTyp, isSchulferienIndexable } from "@/lib/de/schulferien";
import { stateByCode } from "@/lib/de/bundeslaender";
import { getAllPosts, BLOG_CATEGORIES, categorySlug } from "@/lib/de/blog";
import { blogPageNumbers } from "@/lib/de/blogPaging";
import { COUNTDOWNS } from "@/lib/de/countdowns";
import { isoWeeksInYear } from "@/lib/de/weeks";
import { BESONDERE_TAGE } from "@/lib/de/besondereTage";
import { allNamenstage } from "@/lib/de/namenstage";
import { STERNZEICHEN } from "@/lib/de/sternzeichen";

// ISR: Sitemap täglich neu generieren. So verschiebt sich das Index-Fenster
// (indexableYears()) zum Jahreswechsel automatisch — ohne Redeploy und ohne
// Cron/Deploy-Hook. Nebeneffekt: neue Blog-Beiträge landen binnen 24 h in der
// Sitemap. Rendering-Kosten sind minimal (nur der Sitemap-Request, selten).
export const revalidate = 86400;

// Stabiles <lastmod> statt „heute überall": ein Datum, das sich nur ändert, wenn
// sich Inhalte real ändern. Vergangene Jahre werden auf Jahresende eingefroren
// (der Inhalt eines abgelaufenen Jahres ändert sich nicht mehr) → Googlebot
// recrawlt sie kaum und verschwendet kein Crawl-Budget. Aktuelles/künftiges Jahr
// = CONTENT_VERSION. Nur echt tägliche Seiten (Home, Heute, Countdowns …) tragen NOW.
const NOW = berlinToday();
const CONTENT_DATE = new Date(`${CONTENT_VERSION}T00:00:00Z`);
const thisYear = berlinNow().year;
const yearLastmod = (y: number): Date =>
  y < thisYear ? new Date(`${y}-12-31T00:00:00Z`) : CONTENT_DATE;

// Nur fertige, indexierbare deutsche Routen. Schulferien bleiben ausgeschlossen,
// bis die Termine verifiziert sind (siehe schulferien.ts / SEO-Gate). Das
// Impressum wird nur aufgenommen, sobald echte Betreiberdaten hinterlegt sind
// (HAS_REAL_DATA) — analog zum noindex-Gate der Seite selbst.
const IMPRESSUM_INDEXABLE = !COMPANY.legalName.startsWith("TODO");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/kalender-zum-ausdrucken`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/heute`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/blog`, lastModified: NOW, changeFrequency: "daily" },
    ...(IMPRESSUM_INDEXABLE
      ? [{ url: `${SITE_URL}/impressum`, lastModified: CONTENT_DATE, changeFrequency: "yearly" as const }]
      : []),
    { url: `${SITE_URL}/generatoren`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    { url: `${SITE_URL}/tage-rechner`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    { url: `${SITE_URL}/arbeitstage-rechner`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    { url: `${SITE_URL}/wochentag-rechner`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    { url: `${SITE_URL}/altersrechner`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    { url: `${SITE_URL}/stundenplan`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    { url: `${SITE_URL}/so-berechnen-wir`, lastModified: CONTENT_DATE, changeFrequency: "yearly" },
    { url: `${SITE_URL}/datenschutz`, lastModified: CONTENT_DATE, changeFrequency: "yearly" },
    { url: `${SITE_URL}/cookies`, lastModified: CONTENT_DATE, changeFrequency: "yearly" },
    { url: `${SITE_URL}/nutzungsbedingungen`, lastModified: CONTENT_DATE, changeFrequency: "yearly" },
    { url: `${SITE_URL}/kontakt`, lastModified: CONTENT_DATE, changeFrequency: "yearly" },
    { url: `${SITE_URL}/sonnenaufgang-sonnenuntergang`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/wie-viele-tage-bis`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/wie-viele-tage-bis-zu-den-sommerferien`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/countdown`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    ...COUNTDOWNS.map((c) => ({ url: `${SITE_URL}/wie-viele-tage-bis/${c.slug}`, lastModified: NOW, changeFrequency: "daily" as const })),
    // Brauchtum & Anlässe (jahresunabhängig).
    { url: `${SITE_URL}/namenstage`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    ...allNamenstage().map((e) => ({ url: `${SITE_URL}/namenstage/${e.mmdd}`, lastModified: CONTENT_DATE, changeFrequency: "yearly" as const })),
    { url: `${SITE_URL}/bauernregeln`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    { url: `${SITE_URL}/sternzeichen`, lastModified: CONTENT_DATE, changeFrequency: "monthly" },
    ...STERNZEICHEN.map((z) => ({ url: `${SITE_URL}/sternzeichen/${z.slug}`, lastModified: CONTENT_DATE, changeFrequency: "yearly" as const })),
  ];

  // Nur das enge Index-Fenster (aktuelles Jahr −1 … +5) in die Sitemap — Jahre mit
  // realer Suchnachfrage. Ältere/fernere Jahrgänge existieren weiterhin (200,
  // navigierbar), sind aber noindex und bleiben aus der Sitemap → Crawl-Budget
  // konzentriert sich auf die relevanten Jahre.
  for (const y of indexableYears()) {
    const lm = yearLastmod(y);
    entries.push({ url: `${SITE_URL}/kalender/${y}`, lastModified: lm, changeFrequency: "monthly" });
    // Aktuelles Jahr wird vom Hub /kalender-zum-ausdrucken abgedeckt (dorthin
    // kanonisiert) → nur die übrigen Jahre einzeln listen.
    if (y !== thisYear) entries.push({ url: `${SITE_URL}/kalender-zum-ausdrucken/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/feiertage/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/brueckentage/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/arbeitstage/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/kalenderwochen/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/urlaubsplaner/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/besondere-tage/${y}`, lastModified: lm, changeFrequency: "monthly" });
    for (const e of BESONDERE_TAGE) {
      entries.push({ url: `${SITE_URL}/besondere-tage/${y}/${e.slug}`, lastModified: lm, changeFrequency: "monthly" });
    }
    // Einzelne Kalenderwochen nur für aktuelles + nächstes Jahr (Umfang).
    if (y === thisYear || y === thisYear + 1) {
      for (let w = 1; w <= isoWeeksInYear(y); w++) {
        entries.push({ url: `${SITE_URL}/kw/${w}-${y}`, lastModified: lm, changeFrequency: "weekly" });
      }
    }
    entries.push({ url: `${SITE_URL}/mondkalender/${y}`, lastModified: lm, changeFrequency: "monthly" });
    for (const ms of MONTH_SLUGS_DE) {
      entries.push({ url: `${SITE_URL}/mondkalender/${ms}-${y}`, lastModified: lm, changeFrequency: "monthly" });
    }
    entries.push({ url: `${SITE_URL}/mondphasen/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/vollmond/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/neumond/${y}`, lastModified: lm, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/zeitumstellung/${y}`, lastModified: lm, changeFrequency: "yearly" });
    entries.push({ url: `${SITE_URL}/jahreszeiten/${y}`, lastModified: lm, changeFrequency: "yearly" });
    // Schulferien nur für Jahre/Länder mit vorhandenen Daten.
    const sfStates = statesWithData(y);
    if (sfStates.length > 0) {
      entries.push({ url: `${SITE_URL}/schulferien/${y}`, lastModified: lm, changeFrequency: "monthly" });
      const FERIEN_TYPES = ["sommerferien", "osterferien", "herbstferien", "weihnachtsferien"] as const;
      for (const code of sfStates) {
        const slug = stateByCode(code).slug;
        entries.push({ url: `${SITE_URL}/schulferien/${y}/${slug}`, lastModified: lm, changeFrequency: "monthly" });
        if (isSchulferienIndexable(y, code)) {
          for (const t of FERIEN_TYPES) {
            if (getFerienByTyp(y, code, t)) {
              entries.push({ url: `${SITE_URL}/${t}/${y}/${slug}`, lastModified: lm, changeFrequency: "monthly" });
            }
          }
        }
      }
    }
    for (const ms of MONTH_SLUGS_DE) {
      entries.push({ url: `${SITE_URL}/kalender/${ms}-${y}`, lastModified: lm, changeFrequency: "monthly" });
    }
    for (const slug of STATE_SLUGS) {
      entries.push({ url: `${SITE_URL}/kalender/${y}/${slug}`, lastModified: lm, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/feiertage/${y}/${slug}`, lastModified: lm, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/brueckentage/${y}/${slug}`, lastModified: lm, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/arbeitstage/${y}/${slug}`, lastModified: lm, changeFrequency: "monthly" });
      // Monatskalender je Bundesland nur für das aktuelle und nächste Jahr (Umfang).
      if (y === thisYear || y === thisYear + 1) {
        for (const ms of MONTH_SLUGS_DE) {
          entries.push({ url: `${SITE_URL}/kalender/${ms}-${y}/${slug}`, lastModified: lm, changeFrequency: "monthly" });
        }
      }
    }
  }

  // Kalenderblätter (Tagesseiten) für das aktuelle und nächste Jahr. Der Inhalt
  // eines konkreten Datums ist statisch → stabiles lastmod (CONTENT_DATE).
  for (const y of [thisYear, thisYear + 1]) {
    for (let m0 = 0; m0 < 12; m0++) {
      const dim = new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
      for (let d = 1; d <= dim; d++) {
        const iso = `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        entries.push({ url: `${SITE_URL}/kalenderblatt/${iso}`, lastModified: CONTENT_DATE, changeFrequency: "yearly" });
      }
    }
  }

  // Blog-Beiträge (Seed + KI aus der DB) + paginierte Blog-Übersichtsseiten.
  try {
    for (const p of await getAllPosts()) {
      entries.push({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(`${p.publishedAt}T00:00:00Z`), changeFrequency: "monthly" });
    }
    for (const n of await blogPageNumbers()) {
      entries.push({ url: `${SITE_URL}/blog/seite/${n}`, lastModified: NOW, changeFrequency: "daily" });
    }
    for (const cat of BLOG_CATEGORIES) {
      entries.push({ url: `${SITE_URL}/blog/kategorie/${categorySlug(cat)}`, lastModified: NOW, changeFrequency: "weekly" });
    }
  } catch {
    // DB nicht erreichbar → nur statische Einträge
  }

  return entries;
}
