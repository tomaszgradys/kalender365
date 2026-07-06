export type Holiday = {
  date: string; // YYYY-MM-DD
  name: { pl: string; en: string };
  movable: boolean;
};

/** Anonymous Gregorian algorithm (Meeus/Jones/Butcher) */
export function easterSunday(year: number): Date {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setUTCDate(d.getUTCDate() + days);
  return d;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Polish statutory public holidays for a given year. */
export function getPolishHolidays(year: number): Holiday[] {
  const easter = easterSunday(year);
  const fixed: Holiday[] = [
    { date: `${year}-01-01`, name: { pl: "Nowy Rok", en: "New Year's Day" }, movable: false },
    { date: `${year}-01-06`, name: { pl: "Święto Trzech Króli", en: "Epiphany" }, movable: false },
    { date: `${year}-05-01`, name: { pl: "Święto Pracy", en: "Labour Day" }, movable: false },
    { date: `${year}-05-03`, name: { pl: "Święto Konstytucji 3 Maja", en: "Constitution Day" }, movable: false },
    { date: `${year}-08-15`, name: { pl: "Wniebowzięcie Najświętszej Maryi Panny", en: "Assumption of Mary" }, movable: false },
    { date: `${year}-11-01`, name: { pl: "Wszystkich Świętych", en: "All Saints' Day" }, movable: false },
    { date: `${year}-11-11`, name: { pl: "Narodowe Święto Niepodległości", en: "Independence Day" }, movable: false },
    { date: `${year}-12-25`, name: { pl: "Boże Narodzenie (pierwszy dzień)", en: "Christmas Day" }, movable: false },
    { date: `${year}-12-26`, name: { pl: "Boże Narodzenie (drugi dzień)", en: "St. Stephen's Day" }, movable: false },
  ];
  const movable: Holiday[] = [
    { date: toISODate(easter), name: { pl: "Wielkanoc", en: "Easter Sunday" }, movable: true },
    { date: toISODate(addDays(easter, 1)), name: { pl: "Poniedziałek Wielkanocny", en: "Easter Monday" }, movable: true },
    { date: toISODate(addDays(easter, 49)), name: { pl: "Zielone Świątki", en: "Pentecost" }, movable: true },
    { date: toISODate(addDays(easter, 60)), name: { pl: "Boże Ciało", en: "Corpus Christi" }, movable: true },
  ];
  return [...fixed, ...movable].sort((a, b) => a.date.localeCompare(b.date));
}

/** Statutory (non-working) holidays only — excludes Easter Sunday which usually falls on a Sunday anyway. */
export function getNonWorkingHolidays(year: number): Holiday[] {
  return getPolishHolidays(year).filter((h) => h.name.pl !== "Wielkanoc");
}

export type MovableFeast = { date: string; name: string; description: string };

/** Święta ruchome zależne od daty Wielkanocy. */
export function getMovableFeasts(year: number): MovableFeast[] {
  const easter = easterSunday(year);
  const d = (offset: number) => toISODate(addDays(easter, offset));
  return [
    { date: d(-52), name: "Tłusty czwartek", description: "Ostatni czwartek karnawału (52 dni przed Wielkanocą)" },
    { date: d(-49), name: "Ostatnia niedziela karnawału", description: "Koniec zapustów" },
    { date: d(-47), name: "Ostatki (wtorek)", description: "Ostatni dzień karnawału" },
    { date: d(-46), name: "Środa Popielcowa", description: "Początek Wielkiego Postu" },
    { date: d(-7), name: "Niedziela Palmowa", description: "Początek Wielkiego Tygodnia" },
    { date: d(-3), name: "Wielki Czwartek", description: "Ustanowienie Eucharystii" },
    { date: d(-2), name: "Wielki Piątek", description: "Męka Pańska" },
    { date: d(-1), name: "Wielka Sobota", description: "Święcenie pokarmów" },
    { date: d(0), name: "Wielkanoc (Niedziela Wielkanocna)", description: "Zmartwychwstanie Pańskie" },
    { date: d(1), name: "Poniedziałek Wielkanocny", description: "Lany poniedziałek (dzień wolny)" },
    { date: d(42), name: "Wniebowstąpienie Pańskie", description: "7. niedziela wielkanocna (obchodzone w Polsce w niedzielę)" },
    { date: d(49), name: "Zielone Świątki (Zesłanie Ducha Świętego)", description: "50 dni po Wielkanocy (dzień wolny)" },
    { date: d(60), name: "Boże Ciało", description: "60 dni po Wielkanocy (dzień wolny)" },
  ];
}
