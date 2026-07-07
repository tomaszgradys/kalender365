import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/de/site";
import { NAV_YEARS } from "@/lib/de/year";
import { STATE_SLUGS } from "@/lib/de/bundeslaender";
import { MONTH_SLUGS_DE } from "@/lib/de/locale";
import { berlinNow, berlinToday } from "@/lib/de/now";
import { statesWithData, getFerienByTyp, isSchulferienIndexable } from "@/lib/de/schulferien";
import { stateByCode } from "@/lib/de/bundeslaender";
import { getAllPosts } from "@/lib/de/blog";
import { COUNTDOWNS } from "@/lib/de/countdowns";
import { isoWeeksInYear } from "@/lib/de/weeks";

const NOW = berlinToday();

// Nur fertige, indexierbare deutsche Routen. Schulferien bleiben ausgeschlossen,
// bis die Termine verifiziert sind (siehe schulferien.ts / SEO-Gate). Impressum
// ist ausgeschlossen, solange nur Platzhalterdaten hinterlegt sind.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/blog`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/generatoren`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/tage-rechner`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/arbeitstage-rechner`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/wochentag-rechner`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/altersrechner`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/stundenplan`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/so-berechnen-wir`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/datenschutz`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/cookies`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/nutzungsbedingungen`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/kontakt`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/sonnenaufgang-sonnenuntergang`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/wie-viele-tage-bis`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/wie-viele-tage-bis-zu-den-sommerferien`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/countdown`, lastModified: NOW, changeFrequency: "monthly" },
    ...COUNTDOWNS.map((c) => ({ url: `${SITE_URL}/wie-viele-tage-bis/${c.slug}`, lastModified: NOW, changeFrequency: "daily" as const })),
  ];

  const thisYear = berlinNow().year;
  for (const y of NAV_YEARS) {
    entries.push({ url: `${SITE_URL}/kalender/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/kalender-zum-ausdrucken/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/feiertage/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/brueckentage/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/arbeitstage/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/kalenderwochen/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/urlaubsplaner/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    // Einzelne Kalenderwochen nur für aktuelles + nächstes Jahr (Umfang).
    if (y === thisYear || y === thisYear + 1) {
      for (let w = 1; w <= isoWeeksInYear(y); w++) {
        entries.push({ url: `${SITE_URL}/kw/${w}-${y}`, lastModified: NOW, changeFrequency: "weekly" });
      }
    }
    entries.push({ url: `${SITE_URL}/mondphasen/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/vollmond/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/neumond/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/zeitumstellung/${y}`, lastModified: NOW, changeFrequency: "yearly" });
    entries.push({ url: `${SITE_URL}/jahreszeiten/${y}`, lastModified: NOW, changeFrequency: "yearly" });
    // Schulferien nur für Jahre/Länder mit vorhandenen Daten.
    const sfStates = statesWithData(y);
    if (sfStates.length > 0) {
      entries.push({ url: `${SITE_URL}/schulferien/${y}`, lastModified: NOW, changeFrequency: "monthly" });
      const FERIEN_TYPES = ["sommerferien", "osterferien", "herbstferien", "weihnachtsferien"] as const;
      for (const code of sfStates) {
        const slug = stateByCode(code).slug;
        entries.push({ url: `${SITE_URL}/schulferien/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
        if (isSchulferienIndexable(y, code)) {
          for (const t of FERIEN_TYPES) {
            if (getFerienByTyp(y, code, t)) {
              entries.push({ url: `${SITE_URL}/${t}/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
            }
          }
        }
      }
    }
    for (const ms of MONTH_SLUGS_DE) {
      entries.push({ url: `${SITE_URL}/kalender/${ms}-${y}`, lastModified: NOW, changeFrequency: "monthly" });
    }
    for (const slug of STATE_SLUGS) {
      entries.push({ url: `${SITE_URL}/kalender/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/feiertage/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/brueckentage/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/arbeitstage/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
      // Monatskalender je Bundesland nur für das aktuelle und nächste Jahr (Umfang).
      if (y === thisYear || y === thisYear + 1) {
        for (const ms of MONTH_SLUGS_DE) {
          entries.push({ url: `${SITE_URL}/kalender/${ms}-${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
        }
      }
    }
  }

  // Kalenderblätter (Tagesseiten) für das aktuelle und nächste Jahr.
  for (const y of [thisYear, thisYear + 1]) {
    for (let m0 = 0; m0 < 12; m0++) {
      const dim = new Date(Date.UTC(y, m0 + 1, 0)).getUTCDate();
      for (let d = 1; d <= dim; d++) {
        const iso = `${y}-${String(m0 + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
        entries.push({ url: `${SITE_URL}/kalenderblatt/${iso}`, lastModified: NOW, changeFrequency: "yearly" });
      }
    }
  }

  // Blog-Beiträge (Seed + KI aus der DB).
  try {
    for (const p of await getAllPosts()) {
      entries.push({ url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(`${p.publishedAt}T00:00:00Z`), changeFrequency: "monthly" });
    }
  } catch {
    // DB nicht erreichbar → nur statische Einträge
  }

  return entries;
}
