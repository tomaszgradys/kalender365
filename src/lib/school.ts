import { easterSunday } from "./holidays";
import { formatISODatePL } from "./format";

function iso(d: Date) {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}
function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + n);
  return x;
}

/** Rozpoczęcie roku szkolnego: 1 września, a jeśli to pt/sb/nd → najbliższy poniedziałek. */
export function schoolYearStart(year: number): string {
  let d = new Date(Date.UTC(year, 8, 1));
  const wd = d.getUTCDay(); // 0=nd
  if (wd === 5 || wd === 6 || wd === 0) {
    while (d.getUTCDay() !== 1) d = addDays(d, 1);
  }
  return iso(d);
}

/** Zakończenie roku szkolnego: najbliższy piątek po 20 czerwca. */
export function schoolYearEnd(year: number): string {
  let d = new Date(Date.UTC(year, 5, 21));
  while (d.getUTCDay() !== 5) d = addDays(d, 1);
  return iso(d);
}

export type SchoolMilestone = { label: string; value: string; note?: string };

/** Kamienie milowe roku szkolnego [startYear]/[startYear+1]. */
export function getSchoolYear(startYear: number): SchoolMilestone[] {
  const endYear = startYear + 1;
  const easter = easterSunday(endYear);
  const springBreakStart = iso(addDays(easter, -3)); // Wielki Czwartek
  const springBreakEnd = iso(addDays(easter, 1)); // Poniedziałek Wielkanocny

  return [
    { label: "Rozpoczęcie roku szkolnego", value: formatISODatePL(schoolYearStart(startYear)) },
    {
      label: "Zimowa przerwa świąteczna",
      value: `${23} grudnia ${startYear} – 1 stycznia ${endYear}`,
      note: "orientacyjnie (dokładne dni ustala MEN)",
    },
    { label: "Ferie zimowe", value: "styczeń–luty (zależnie od województwa)", note: "patrz sekcja ferie" },
    {
      label: "Wiosenna przerwa świąteczna",
      value: `${formatISODatePL(springBreakStart)} – ${formatISODatePL(springBreakEnd)}`,
    },
    { label: "Zakończenie roku szkolnego", value: formatISODatePL(schoolYearEnd(endYear)) },
  ];
}

// Ferie zimowe — dane kuratowane (rok = rok kalendarzowy ferii).
// Struktura: rok → tury (zakres dat) → lista województw.
export type FerieTurn = { dates: string; regions: string[] };

export const FERIE: Record<number, FerieTurn[]> = {
  2025: [
    { dates: "20 stycznia – 2 lutego 2025", regions: ["kujawsko-pomorskie", "lubuskie", "małopolskie", "świętokrzyskie", "wielkopolskie"] },
    { dates: "27 stycznia – 9 lutego 2025", regions: ["podlaskie", "warmińsko-mazurskie"] },
    { dates: "3 – 16 lutego 2025", regions: ["dolnośląskie", "mazowieckie", "opolskie", "zachodniopomorskie"] },
    { dates: "17 lutego – 2 marca 2025", regions: ["lubelskie", "łódzkie", "podkarpackie", "pomorskie", "śląskie"] },
  ],
  2026: [
    { dates: "19 stycznia – 1 lutego 2026", regions: ["kujawsko-pomorskie", "lubuskie", "małopolskie", "świętokrzyskie", "wielkopolskie"] },
    { dates: "26 stycznia – 8 lutego 2026", regions: ["podlaskie", "warmińsko-mazurskie"] },
    { dates: "2 – 15 lutego 2026", regions: ["dolnośląskie", "mazowieckie", "opolskie", "zachodniopomorskie"] },
    { dates: "16 lutego – 1 marca 2026", regions: ["lubelskie", "łódzkie", "podkarpackie", "pomorskie", "śląskie"] },
  ],
};

export function getFerie(year: number): FerieTurn[] | null {
  return FERIE[year] ?? null;
}
