import { MONTH_SLUGS } from "./months";
import { url } from "./urls";
import { warsawNow, isoWeekOf } from "./now";

// Rejestr typów kalendarzy — źródło prawdy dla menu, huba i SEO.

export type ThumbKey =
  | "year"
  | "month"
  | "day"
  | "print"
  | "week"
  | "freedays"
  | "holidays"
  | "party"
  | "easter"
  | "shopping"
  | "moon"
  | "garden"
  | "fish"
  | "seasons"
  | "clock"
  | "sun"
  | "zodiac"
  | "school"
  | "snow"
  | "cake"
  | "counter"
  | "weekday"
  | "name";

export type CalendarCategory =
  | "Podstawowe"
  | "Święta i dni wolne"
  | "Księżyc i natura"
  | "Astronomia i czas"
  | "Szkoła i praca"
  | "Ludzie"
  | "Odliczania"
  | "Narzędzia";

export type CalendarType = {
  slug: string;
  label: string;
  desc: string;
  category: CalendarCategory;
  thumb: ThumbKey;
  /** Buduje docelowy URL — dla typów rocznych podaje bieżący rok itd. */
  href: (ctx: DateCtx) => string;
  popular?: boolean;
};

export type DateCtx = { year: number; month0: number; day: number };

export function nowCtx(): DateCtx {
  return warsawNow();
}

export const CALENDAR_TYPES: CalendarType[] = [
  // Podstawowe
  {
    slug: "kalendarz-roczny",
    label: "Kalendarz roczny",
    desc: "Cały rok na jednej stronie — wszystkie miesiące, święta i dni wolne.",
    category: "Podstawowe",
    thumb: "year",
    href: (c) => url.year(c.year),
    popular: true,
  },
  {
    slug: "kalendarz-miesieczny",
    label: "Kalendarz miesięczny",
    desc: "Widok jednego miesiąca z numerami tygodni i fazami księżyca.",
    category: "Podstawowe",
    thumb: "month",
    href: (c) => url.month(c.year, c.month0),
    popular: true,
  },
  {
    slug: "kartka-z-kalendarza",
    label: "Kartka z kalendarza",
    desc: "Jeden dzień: imieniny, święta, słońce, księżyc, przysłowie.",
    category: "Podstawowe",
    thumb: "day",
    href: (c) => url.day(c.year, c.month0, c.day),
    popular: true,
  },
  {
    slug: "kalendarz-do-druku",
    label: "Kalendarz do druku (PDF)",
    desc: "Gotowe pliki PDF do wydrukowania — miesięczne i roczne.",
    category: "Podstawowe",
    thumb: "print",
    href: (c) => url.printMonth(c.year, c.month0),
    popular: true,
  },
  {
    slug: "numery-tygodni",
    label: "Numery tygodni",
    desc: "Który to tydzień roku wg ISO 8601 wraz z zakresem dat.",
    category: "Podstawowe",
    thumb: "week",
    // Domyślnie bieżący tydzień ISO (a nie zawsze tydzień 1).
    href: (c) => {
      const { isoYear, week } = isoWeekOf(c.year, c.month0, c.day);
      return `/tydzien/${isoYear}/${week}`;
    },
  },

  // Święta i dni wolne
  {
    slug: "dni-wolne-od-pracy",
    label: "Dni wolne od pracy",
    desc: "Wszystkie dni ustawowo wolne w danym roku.",
    category: "Święta i dni wolne",
    thumb: "freedays",
    href: (c) => `/dni-wolne-od-pracy/${c.year}`,
    popular: true,
  },
  {
    slug: "dni-robocze",
    label: "Dni robocze",
    desc: "Liczba dni roboczych w roku i w każdym miesiącu.",
    category: "Święta i dni wolne",
    thumb: "week",
    href: (c) => `/dni-robocze/${c.year}`,
  },
  {
    slug: "dlugie-weekendy",
    label: "Długie weekendy",
    desc: "Długie weekendy i dni do wzięcia (mostki urlopowe).",
    category: "Święta i dni wolne",
    thumb: "freedays",
    href: (c) => `/dlugie-weekendy/${c.year}`,
    popular: true,
  },
  {
    slug: "planer-urlopu",
    label: "Planer urlopu",
    desc: "Oblicz najlepsze kombinacje urlopu, by mieć najwięcej dni wolnego.",
    category: "Święta i dni wolne",
    thumb: "counter",
    href: (c) => `/planer-urlopu/${c.year}`,
    popular: true,
  },
  {
    slug: "kalendarz-swiat",
    label: "Kalendarz świąt",
    desc: "Święta państwowe, kościelne i ruchome z datami.",
    category: "Święta i dni wolne",
    thumb: "holidays",
    href: (c) => `/swieta/${c.year}`,
  },
  {
    slug: "swieta-nietypowe",
    label: "Święta nietypowe",
    desc: "Nietypowe i wesołe święta na każdy dzień roku.",
    category: "Święta i dni wolne",
    thumb: "party",
    href: (c) => `/swieta-nietypowe/${c.year}`,
  },
  {
    slug: "wielkanoc",
    label: "Wielkanoc i święta ruchome",
    desc: "Data Wielkanocy, tłustego czwartku, Bożego Ciała i innych.",
    category: "Święta i dni wolne",
    thumb: "easter",
    href: (c) => `/wielkanoc/${c.year}`,
  },
  {
    slug: "niedziele-handlowe",
    label: "Niedziele handlowe",
    desc: "Kiedy zrobisz zakupy w niedzielę — pełna lista dat.",
    category: "Święta i dni wolne",
    thumb: "shopping",
    href: (c) => `/niedziele-handlowe/${c.year}`,
    popular: true,
  },

  // Księżyc i natura
  {
    slug: "fazy-ksiezyca",
    label: "Fazy księżyca",
    desc: "Nów, pierwsza kwadra, pełnia i ostatnia kwadra w całym roku.",
    category: "Księżyc i natura",
    thumb: "moon",
    href: (c) => `/fazy-ksiezyca/${c.year}`,
    popular: true,
  },
  {
    slug: "pelnia-ksiezyca",
    label: "Pełnia księżyca",
    desc: "Daty wszystkich pełni księżyca w roku.",
    category: "Księżyc i natura",
    thumb: "moon",
    href: (c) => `/pelnia-ksiezyca/${c.year}`,
  },
  {
    slug: "now-ksiezyca",
    label: "Nów księżyca",
    desc: "Daty wszystkich nowi księżyca w roku.",
    category: "Księżyc i natura",
    thumb: "moon",
    href: (c) => `/now-ksiezyca/${c.year}`,
  },
  {
    slug: "kalendarz-ogrodnika",
    label: "Kalendarz ogrodnika",
    desc: "Najlepsze dni na siew i sadzenie według faz księżyca.",
    category: "Księżyc i natura",
    thumb: "garden",
    href: (c) => `/kalendarz-ogrodnika/${c.year}`,
  },
  {
    slug: "kalendarz-wedkarza",
    label: "Kalendarz wędkarza",
    desc: "Dni dobrego brania ryb w oparciu o fazy księżyca.",
    category: "Księżyc i natura",
    thumb: "fish",
    href: (c) => `/kalendarz-wedkarza/${c.year}`,
  },

  // Astronomia i czas
  {
    slug: "pory-roku",
    label: "Pory roku",
    desc: "Daty równonocy i przesileń — początek każdej pory roku.",
    category: "Astronomia i czas",
    thumb: "seasons",
    href: (c) => `/pory-roku/${c.year}`,
  },
  {
    slug: "zmiana-czasu",
    label: "Zmiana czasu",
    desc: "Kiedy przestawiamy zegary na czas letni i zimowy.",
    category: "Astronomia i czas",
    thumb: "clock",
    href: (c) => `/zmiana-czasu/${c.year}`,
    popular: true,
  },
  {
    slug: "wschod-zachod-slonca",
    label: "Wschody i zachody słońca",
    desc: "Godziny wschodu i zachodu słońca dla każdego dnia.",
    category: "Astronomia i czas",
    thumb: "sun",
    href: (c) => `/wschod-zachod-slonca/${c.year}/${MONTH_SLUGS.pl[c.month0]}`,
  },
  {
    slug: "zodiak",
    label: "Znaki zodiaku",
    desc: "Daty znaków zodiaku i sprawdzenie znaku po dacie urodzenia.",
    category: "Astronomia i czas",
    thumb: "zodiac",
    href: () => `/zodiak`,
  },

  // Szkoła i praca
  {
    slug: "kalendarz-szkolny",
    label: "Kalendarz szkolny",
    desc: "Początek i koniec roku szkolnego, ferie i dni wolne.",
    category: "Szkoła i praca",
    thumb: "school",
    href: (c) => `/kalendarz-szkolny/${c.year}`,
    popular: true,
  },
  {
    slug: "ferie-zimowe",
    label: "Ferie zimowe",
    desc: "Terminy ferii zimowych w podziale na województwa.",
    category: "Szkoła i praca",
    thumb: "snow",
    href: (c) => `/ferie-zimowe/${c.year}`,
    popular: true,
  },

  // Ludzie
  {
    slug: "kalendarz-imienin",
    label: "Kalendarz imienin",
    desc: "Wyszukiwarka imion i dat imienin na cały rok.",
    category: "Ludzie",
    thumb: "cake",
    href: () => `/imieniny`,
    popular: true,
  },

  // Odliczania
  {
    slug: "odliczania",
    label: "Odliczania",
    desc: "Ile dni do świąt, wakacji, weekendu i innych wydarzeń.",
    category: "Odliczania",
    thumb: "counter",
    href: () => `/odliczania`,
    popular: true,
  },
  {
    slug: "ile-dni-do-wakacji",
    label: "Ile dni do wakacji",
    desc: "Licznik dni do wakacji letnich.",
    category: "Odliczania",
    thumb: "counter",
    href: () => `/ile-dni-do-wakacji`,
  },
  {
    slug: "ile-dni-do-bozego-narodzenia",
    label: "Ile dni do świąt",
    desc: "Licznik dni do Bożego Narodzenia.",
    category: "Odliczania",
    thumb: "counter",
    href: () => `/ile-dni-do-bozego-narodzenia`,
  },
  {
    slug: "ile-dni-do-weekendu",
    label: "Ile dni do weekendu",
    desc: "Licznik dni do najbliższej soboty.",
    category: "Odliczania",
    thumb: "counter",
    href: () => `/ile-dni-do-weekendu`,
  },

  // Narzędzia
  {
    slug: "plan-lekcji",
    label: "Plan lekcji",
    desc: "Stwórz własny plan lekcji z własnym zdjęciem i pobierz PDF.",
    category: "Narzędzia",
    thumb: "school",
    href: () => `/plan-lekcji`,
    popular: true,
  },
  {
    slug: "kalkulator-dni",
    label: "Kalkulator dni",
    desc: "Ile dni między datami i ile dni zostało do wydarzenia.",
    category: "Narzędzia",
    thumb: "counter",
    href: () => `/kalkulator-dni`,
  },
  {
    slug: "kalkulator-wieku",
    label: "Kalkulator wieku",
    desc: "Dokładny wiek: lata, dni i tygodnie życia, znak zodiaku.",
    category: "Narzędzia",
    thumb: "cake",
    href: () => `/kalkulator-wieku`,
  },
  {
    slug: "kalkulator-dni-roboczych",
    label: "Kalkulator dni roboczych",
    desc: "Dni robocze między datami — policz urlop lub termin.",
    category: "Narzędzia",
    thumb: "week",
    href: () => `/kalkulator-dni-roboczych`,
  },
  {
    slug: "kalkulator-ciazy",
    label: "Kalkulator ciąży",
    desc: "Tydzień ciąży, trymestr i przewidywany termin porodu.",
    category: "Narzędzia",
    thumb: "counter",
    href: () => `/kalkulator-ciazy`,
  },
  {
    slug: "dzien-tygodnia",
    label: "Jaki to dzień tygodnia",
    desc: "Sprawdź, w jaki dzień tygodnia wypada dowolna data.",
    category: "Narzędzia",
    thumb: "weekday",
    href: () => `/dzien-tygodnia`,
  },
];

export const CATEGORY_ORDER: CalendarCategory[] = [
  "Podstawowe",
  "Święta i dni wolne",
  "Księżyc i natura",
  "Astronomia i czas",
  "Szkoła i praca",
  "Ludzie",
  "Odliczania",
  "Narzędzia",
];

export function calendarsByCategory(): { category: CalendarCategory; items: CalendarType[] }[] {
  return CATEGORY_ORDER.map((category) => ({
    category,
    items: CALENDAR_TYPES.filter((c) => c.category === category),
  }));
}

export function popularCalendars(): CalendarType[] {
  return CALENDAR_TYPES.filter((c) => c.popular);
}

export function getCalendarBySlug(slug: string): CalendarType | undefined {
  return CALENDAR_TYPES.find((c) => c.slug === slug);
}
