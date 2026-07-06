import { easterSunday } from "./holidays";
import { getSeasonDate } from "./astroYear";
import { schoolYearEnd, schoolYearStart } from "./school";

// Odliczania „ile dni do…". Każde ma pełny slug URL (np. ile-dni-do-wakacji),
// funkcję zwracającą NASTĘPNE wystąpienie oraz treść.

export type CountdownDef = {
  slug: string;
  name: string; // dopełniacz: "wakacji", "Bożego Narodzenia"
  h1: string;
  emoji: string;
  target: (from: Date) => Date; // najbliższe wystąpienie (UTC instant ~ północ)
  about: string;
  popular?: boolean;
};

function atUTC(year: number, month0: number, day: number): Date {
  return new Date(Date.UTC(year, month0, day));
}

/** Najbliższe wystąpienie stałej daty (miesiąc/dzień) licząc od `from`. */
function nextFixed(from: Date, month0: number, day: number): Date {
  const y = from.getUTCFullYear();
  const thisYear = atUTC(y, month0, day);
  return from.getTime() <= thisYear.getTime() ? thisYear : atUTC(y + 1, month0, day);
}

function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return atUTC(y, m - 1, d);
}

function nextEaster(from: Date): Date {
  const y = from.getUTCFullYear();
  const e = easterSunday(y);
  return from.getTime() <= e.getTime() ? e : easterSunday(y + 1);
}

function nextSeason(from: Date, which: 0 | 1 | 2 | 3): Date {
  const y = from.getUTCFullYear();
  const s = getSeasonDate(y, which);
  return from.getTime() <= s.getTime() ? s : getSeasonDate(y + 1, which);
}

function nextWeekend(from: Date): Date {
  // najbliższa sobota (włącznie z dziś, jeśli dziś sobota)
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));
  const dow = d.getUTCDay(); // 0=nd,6=sob
  const add = (6 - dow + 7) % 7;
  d.setUTCDate(d.getUTCDate() + add);
  return d;
}

/** Koniec roku szkolnego / początek wakacji — najbliższy. */
function nextSummerBreak(from: Date): Date {
  const y = from.getUTCFullYear();
  const end = parseISO(schoolYearEnd(y));
  return from.getTime() <= end.getTime() ? end : parseISO(schoolYearEnd(y + 1));
}

function nextSchoolStart(from: Date): Date {
  const y = from.getUTCFullYear();
  const s = parseISO(schoolYearStart(y));
  return from.getTime() <= s.getTime() ? s : parseISO(schoolYearStart(y + 1));
}

export const COUNTDOWNS: CountdownDef[] = [
  {
    slug: "ile-dni-do-wakacji",
    name: "wakacji",
    h1: "Ile dni do wakacji?",
    emoji: "🏖️",
    target: nextSummerBreak,
    about: "Wakacje letnie zaczynają się w dniu zakończenia zajęć w szkole — w ostatni piątek po 20 czerwca.",
    popular: true,
  },
  {
    slug: "ile-dni-do-bozego-narodzenia",
    name: "Bożego Narodzenia",
    h1: "Ile dni do Bożego Narodzenia?",
    emoji: "🎄",
    target: (f) => nextFixed(f, 11, 25),
    about: "Boże Narodzenie obchodzimy 25 grudnia. Wigilia wypada dzień wcześniej — 24 grudnia.",
    popular: true,
  },
  {
    slug: "ile-dni-do-sylwestra",
    name: "Sylwestra",
    h1: "Ile dni do Sylwestra?",
    emoji: "🎆",
    target: (f) => nextFixed(f, 11, 31),
    about: "Sylwester to ostatni dzień roku — 31 grudnia. O północy witamy Nowy Rok.",
    popular: true,
  },
  {
    slug: "ile-dni-do-nowego-roku",
    name: "Nowego Roku",
    h1: "Ile dni do Nowego Roku?",
    emoji: "🥂",
    target: (f) => nextFixed(f, 0, 1),
    about: "Nowy Rok zaczyna się 1 stycznia — to dzień ustawowo wolny od pracy.",
  },
  {
    slug: "ile-dni-do-wielkanocy",
    name: "Wielkanocy",
    h1: "Ile dni do Wielkanocy?",
    emoji: "🐣",
    target: nextEaster,
    about: "Wielkanoc to święto ruchome — wypada w pierwszą niedzielę po pierwszej wiosennej pełni księżyca.",
    popular: true,
  },
  {
    slug: "ile-dni-do-majowki",
    name: "majówki",
    h1: "Ile dni do majówki?",
    emoji: "🇵🇱",
    target: (f) => nextFixed(f, 4, 1),
    about: "Majówka to długi weekend na początku maja: Święto Pracy (1 maja) i Święto Konstytucji 3 Maja.",
    popular: true,
  },
  {
    slug: "ile-dni-do-walentynek",
    name: "walentynek",
    h1: "Ile dni do walentynek?",
    emoji: "❤️",
    target: (f) => nextFixed(f, 1, 14),
    about: "Walentynki, czyli Dzień Zakochanych, obchodzimy 14 lutego.",
  },
  {
    slug: "ile-dni-do-dnia-dziecka",
    name: "Dnia Dziecka",
    h1: "Ile dni do Dnia Dziecka?",
    emoji: "🎈",
    target: (f) => nextFixed(f, 5, 1),
    about: "Dzień Dziecka w Polsce obchodzimy 1 czerwca.",
  },
  {
    slug: "ile-dni-do-andrzejek",
    name: "andrzejek",
    h1: "Ile dni do andrzejek?",
    emoji: "🔮",
    target: (f) => nextFixed(f, 10, 29),
    about: "Andrzejki to wieczór wróżb w noc z 29 na 30 listopada.",
  },
  {
    slug: "ile-dni-do-mikolajek",
    name: "mikołajek",
    h1: "Ile dni do mikołajek?",
    emoji: "🎅",
    target: (f) => nextFixed(f, 11, 6),
    about: "Mikołajki obchodzimy 6 grudnia — to dzień drobnych prezentów.",
  },
  {
    slug: "ile-dni-do-wiosny",
    name: "wiosny",
    h1: "Ile dni do wiosny?",
    emoji: "🌷",
    target: (f) => nextSeason(f, 0),
    about: "Astronomiczna wiosna zaczyna się w momencie równonocy wiosennej (ok. 20 marca).",
    popular: true,
  },
  {
    slug: "ile-dni-do-lata",
    name: "lata",
    h1: "Ile dni do lata?",
    emoji: "☀️",
    target: (f) => nextSeason(f, 1),
    about: "Astronomiczne lato zaczyna się w momencie przesilenia letniego (ok. 21 czerwca) — to najdłuższy dzień w roku.",
  },
  {
    slug: "ile-dni-do-weekendu",
    name: "weekendu",
    h1: "Ile dni do weekendu?",
    emoji: "🎉",
    target: nextWeekend,
    about: "Weekend zaczyna się w sobotę. Sprawdź, ile dni zostało do najbliższej soboty.",
    popular: true,
  },
  {
    slug: "ile-dni-do-powrotu-do-szkoly",
    name: "powrotu do szkoły",
    h1: "Ile dni do powrotu do szkoły?",
    emoji: "🎒",
    target: nextSchoolStart,
    about: "Nowy rok szkolny zaczyna się 1 września (jeśli wypada w piątek lub sobotę — w najbliższy poniedziałek).",
  },
];

export function getCountdown(slug: string): CountdownDef | undefined {
  return COUNTDOWNS.find((c) => c.slug === slug);
}

export function countdownMeta(slug: string): { title: string; description: string; alternates: { canonical: string } } {
  const def = getCountdown(slug);
  if (!def) return { title: "", description: "", alternates: { canonical: `/${slug}` } };
  return {
    title: `${def.h1} — licznik dni`,
    description: `${def.h1} Sprawdź na żywo, ile dni, godzin i minut zostało do ${def.name}. ${def.about}`,
    alternates: { canonical: `/${slug}` },
  };
}

export function popularCountdowns(): CountdownDef[] {
  return COUNTDOWNS.filter((c) => c.popular);
}

/** Liczba pełnych dni od dziś (lokalnie) do daty docelowej. */
export function daysUntil(target: Date, from: Date = new Date()): number {
  const a = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
  const b = Date.UTC(target.getUTCFullYear(), target.getUTCMonth(), target.getUTCDate());
  return Math.round((b - a) / 86400000);
}
