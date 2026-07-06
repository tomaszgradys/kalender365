export type Locale = "pl" | "en";

export const MONTH_SLUGS: Record<Locale, string[]> = {
  pl: [
    "styczen",
    "luty",
    "marzec",
    "kwiecien",
    "maj",
    "czerwiec",
    "lipiec",
    "sierpien",
    "wrzesien",
    "pazdziernik",
    "listopad",
    "grudzien",
  ],
  en: [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ],
};

export const MONTH_NAMES: Record<Locale, string[]> = {
  pl: [
    "Styczeń",
    "Luty",
    "Marzec",
    "Kwiecień",
    "Maj",
    "Czerwiec",
    "Lipiec",
    "Sierpień",
    "Wrzesień",
    "Październik",
    "Listopad",
    "Grudzień",
  ],
  en: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],
};

// Locative form used after the preposition "w/we" — "w styczniu 2026", "w lipcu 2026".
export const MONTH_NAMES_LOCATIVE_PL = [
  "styczniu",
  "lutym",
  "marcu",
  "kwietniu",
  "maju",
  "czerwcu",
  "lipcu",
  "sierpniu",
  "wrześniu",
  "październiku",
  "listopadzie",
  "grudniu",
];

// Genitive form used in Polish phrases like "Kalendarz stycznia 2026"
export const MONTH_NAMES_GENITIVE_PL = [
  "stycznia",
  "lutego",
  "marca",
  "kwietnia",
  "maja",
  "czerwca",
  "lipca",
  "sierpnia",
  "września",
  "października",
  "listopada",
  "grudnia",
];

export const WEEKDAY_NAMES: Record<Locale, string[]> = {
  pl: ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota", "Niedziela"],
  en: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
};

export const WEEKDAY_SHORT: Record<Locale, string[]> = {
  pl: ["Pon", "Wt", "Śr", "Czw", "Pt", "Sob", "Ndz"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

export function monthSlugToIndex(locale: Locale, slug: string): number | null {
  const idx = MONTH_SLUGS[locale].indexOf(slug);
  return idx === -1 ? null : idx;
}

/** "lipiec-2026" → { monthIndex, year } (locale pl). */
export function parseMonthYearSlug(slug: string): { monthIndex: number; year: number } | null {
  const m = slug.match(/^([a-ząćęłńóśżź]+)-(\d{4})$/);
  if (!m) return null;
  const monthIndex = monthSlugToIndex("pl", m[1]);
  const year = Number(m[2]);
  if (monthIndex === null) return null;
  return { monthIndex, year };
}

export type CalendarSlug =
  | { kind: "year"; year: number }
  | { kind: "month"; year: number; monthIndex: number };

/** Rozpoznaje slug „2026" (rok) albo „lipiec-2026" (miesiąc). */
export function parseCalendarSlug(slug: string): CalendarSlug | null {
  if (/^\d{4}$/.test(slug)) {
    const year = Number(slug);
    return isValidYear(year) ? { kind: "year", year } : null;
  }
  const my = parseMonthYearSlug(slug);
  if (my && isValidYear(my.year)) return { kind: "month", year: my.year, monthIndex: my.monthIndex };
  return null;
}

// Pełny obsługiwany zakres (strony renderowane na żądanie i cache'owane).
export const MIN_YEAR = 1900;
export const MAX_YEAR = 2100;

// Okno prerenderowane statycznie przy buildzie (reszta zakresu = on-demand ISR).
export const STATIC_MIN_YEAR = 2015;
export const STATIC_MAX_YEAR = 2035;

export function isValidYear(year: number): boolean {
  return Number.isInteger(year) && year >= MIN_YEAR && year <= MAX_YEAR;
}

/**
 * Okno lat, które linkujemy wewnętrznie i indeksujemy = statyczne okno (to samo co w
 * sitemapie). Strony spoza tego zakresu nadal działają na żądanie (ISR), ale NIE
 * podajemy do nich linków prev/next ani ich nie indeksujemy — inaczej crawler mógłby
 * przejść cały zakres 1900–2100 krok po kroku i marnować crawl budget na cienkie,
 * niemal bliźniacze strony historycznych/przyszłych lat.
 */
export function isNavigableYear(year: number): boolean {
  return Number.isInteger(year) && year >= STATIC_MIN_YEAR && year <= STATIC_MAX_YEAR;
}

/** Metadane robots dla stron rocznych: noindex,follow poza oknem indeksowania.
 *  Przyjmuje number lub string (param z URL) — koeryzuje przez Number(). */
export function yearRobotsMeta(
  year: number | string,
): { robots?: { index: boolean; follow: boolean } } {
  return isNavigableYear(Number(year)) ? {} : { robots: { index: false, follow: true } };
}

/** Lata prerenderowane statycznie — używane w generateStaticParams, siatkach i sitemapie. */
export const STATIC_YEARS = Array.from(
  { length: STATIC_MAX_YEAR - STATIC_MIN_YEAR + 1 },
  (_, i) => STATIC_MIN_YEAR + i,
);

/** Alias zgodności — statyczne okno lat. */
export const ALL_YEARS = STATIC_YEARS;
