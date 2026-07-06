import type { MetadataRoute } from "next";
import { ALL_YEARS, MONTH_SLUGS } from "@/lib/months";
import { SITE_URL } from "@/lib/site";
import { getAllNames } from "@/lib/nameDays";
import { isoWeeksInYear } from "@/lib/weeks";
import { daysInMonth } from "@/lib/dayInfo";
import { COUNTDOWNS } from "@/lib/countdowns";
import { warsawNow, warsawToday } from "@/lib/now";
import { getPublishedSummaries, nonEmptyCategories } from "@/lib/blog";
import { FERIE } from "@/lib/school";
import { WOJEWODZTWA, wojSlug } from "@/lib/vacationPlanner";

const CURRENT_YEAR = warsawNow().year;
const NOW = warsawToday();

// Typy kalendarzy rocznych, których strony budujemy dla całego okna lat.
const YEAR_SLUGS = [
  "swieta",
  "swieta-nietypowe",
  "wielkanoc",
  "niedziele-handlowe",
  "fazy-ksiezyca",
  "pelnia-ksiezyca",
  "now-ksiezyca",
  "kalendarz-ogrodnika",
  "kalendarz-wedkarza",
  "pory-roku",
  "zmiana-czasu",
  "kalendarz-szkolny",
  "ferie-zimowe",
];

// Serwis jest wyłącznie po polsku — sekcja /en została usunięta (redirect 308 na /).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/kalendarze`, lastModified: NOW, changeFrequency: "weekly" },
    { url: `${SITE_URL}/imieniny`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/zodiak`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/kalkulator-dni`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/dzien-tygodnia`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/odliczania`, lastModified: NOW, changeFrequency: "daily" },
    { url: `${SITE_URL}/generatory`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/plan-lekcji`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/narzedzia`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/planer-urlopu/${warsawNow().year}`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/dni-wolne-do-kalendarza`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/kalkulator-wieku`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/kalkulator-dni-roboczych`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/kalkulator-ciazy`, lastModified: NOW, changeFrequency: "monthly" },
    { url: `${SITE_URL}/o-nas`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/jak-liczymy`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/polityka-prywatnosci`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/polityka-cookies`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/regulamin`, lastModified: NOW, changeFrequency: "yearly" },
    { url: `${SITE_URL}/blog`, lastModified: NOW, changeFrequency: "daily" },
  ];

  // Blog — opublikowane wpisy (seed + AI z bazy) + strony kategorii.
  for (const p of await getPublishedSummaries()) {
    const d = new Date(`${p.publishedAt}T00:00:00Z`);
    entries.push({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: Number.isNaN(d.getTime()) ? NOW : d,
      changeFrequency: "monthly",
    });
  }
  // Tylko kategorie z wpisami — puste są noindex, więc nie trafiają do sitemap.
  for (const cat of await nonEmptyCategories()) {
    entries.push({ url: `${SITE_URL}/blog/kategoria/${cat}`, lastModified: NOW, changeFrequency: "weekly" });
  }

  // Ferie zimowe wg województwa (tylko lata z danymi w FERIE).
  for (const year of Object.keys(FERIE)) {
    if (Number(year) < CURRENT_YEAR) continue; // pomiń przeszłe lata
    for (const w of WOJEWODZTWA) {
      entries.push({ url: `${SITE_URL}/ferie-zimowe/${year}/${wojSlug(w)}`, lastModified: NOW, changeFrequency: "monthly" });
    }
  }

  // odliczania „ile dni do…"
  for (const c of COUNTDOWNS) {
    entries.push({ url: `${SITE_URL}/${c.slug}`, lastModified: NOW, changeFrequency: "daily" });
  }

  entries.push({ url: `${SITE_URL}/kalendarz`, lastModified: NOW, changeFrequency: "daily" });

  // strony typów kalendarzy rocznych
  for (const year of ALL_YEARS) {
    for (const slug of YEAR_SLUGS) {
      entries.push({ url: `${SITE_URL}/${slug}/${year}`, lastModified: NOW, changeFrequency: "yearly" });
    }
    for (const slug of MONTH_SLUGS.pl) {
      entries.push({ url: `${SITE_URL}/wschod-zachod-slonca/${year}/${slug}`, lastModified: NOW, changeFrequency: "yearly" });
    }
  }

  for (const year of ALL_YEARS) {
    // rdzeń kalendarza — kanoniczne /kalendarz/…
    entries.push({ url: `${SITE_URL}/kalendarz/${year}`, lastModified: NOW, changeFrequency: "yearly" });
    entries.push({ url: `${SITE_URL}/dni-wolne-od-pracy/${year}`, lastModified: NOW, changeFrequency: "yearly" });
    entries.push({ url: `${SITE_URL}/dni-robocze/${year}`, lastModified: NOW, changeFrequency: "yearly" });
    entries.push({ url: `${SITE_URL}/dlugie-weekendy/${year}`, lastModified: NOW, changeFrequency: "yearly" });
    entries.push({ url: `${SITE_URL}/kalendarz-do-druku/${year}`, lastModified: NOW, changeFrequency: "yearly" });

    for (const slug of MONTH_SLUGS.pl) {
      const my = `${slug}-${year}`;
      entries.push({ url: `${SITE_URL}/kalendarz/${my}`, lastModified: NOW, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/kalendarz-do-druku/${my}`, lastModified: NOW, changeFrequency: "monthly" });
      entries.push({ url: `${SITE_URL}/dni-robocze/${my}`, lastModified: NOW, changeFrequency: "monthly" });
    }

    // strony numerów tygodni
    const weeks = isoWeeksInYear(year);
    for (let w = 1; w <= weeks; w++) {
      entries.push({ url: `${SITE_URL}/tydzien/${year}/${w}`, lastModified: NOW, changeFrequency: "yearly" });
    }
  }

  // strony dni „kartka z kalendarza" — bieżący i przyszły rok
  for (const year of [CURRENT_YEAR, CURRENT_YEAR + 1].filter((y) => ALL_YEARS.includes(y))) {
    for (let m = 0; m < 12; m++) {
      const dim = daysInMonth(year, m);
      for (let d = 1; d <= dim; d++) {
        entries.push({
          url: `${SITE_URL}/kalendarz/${MONTH_SLUGS.pl[m]}-${year}/${d}`,
          lastModified: NOW,
          changeFrequency: "yearly",
        });
      }
    }
  }

  // strony imienin
  for (const n of getAllNames()) {
    entries.push({ url: `${SITE_URL}/imieniny/${n.slug}`, lastModified: NOW, changeFrequency: "monthly" });
  }

  return entries;
}
