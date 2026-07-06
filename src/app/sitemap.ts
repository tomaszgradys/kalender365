import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/de/site";
import { NAV_YEARS } from "@/lib/de/year";
import { STATE_SLUGS } from "@/lib/de/bundeslaender";
import { berlinToday } from "@/lib/de/now";

const NOW = berlinToday();

// Nur fertige, indexierbare deutsche Routen. Schulferien bleiben ausgeschlossen,
// bis die Termine verifiziert sind (siehe schulferien.ts / SEO-Gate). Impressum
// ist ausgeschlossen, solange nur Platzhalterdaten hinterlegt sind.
export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/generatoren`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/tage-rechner`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/arbeitstage-rechner`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/wochentag-rechner`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/so-berechnen-wir`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/datenschutz`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/cookies`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/nutzungsbedingungen`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/kontakt`, lastModified: NOW, changeFrequency: "yearly" },
  ];

  for (const y of NAV_YEARS) {
    entries.push({ url: `${SITE_URL}/kalender/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/feiertage/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/brueckentage/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/arbeitstage/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/kalenderwochen/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    entries.push({ url: `${SITE_URL}/urlaubsplaner/${y}`, lastModified: NOW, changeFrequency: "monthly" });
    for (const slug of STATE_SLUGS) {
      entries.push({ url: `${SITE_URL}/feiertage/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/brueckentage/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/arbeitstage/${y}/${slug}`, lastModified: NOW, changeFrequency: "monthly" });
    }
  }

  return entries;
}
