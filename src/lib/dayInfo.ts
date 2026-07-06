import type { MoonPhaseName } from "./calendar";

export const MOON_PHASE_PL: Record<MoonPhaseName, string> = {
  new: "Nów",
  "waxing-crescent": "Przybywający sierp",
  "first-quarter": "Pierwsza kwadra",
  "waxing-gibbous": "Przybywający Księżyc garbaty",
  full: "Pełnia",
  "waning-gibbous": "Ubywający Księżyc garbaty",
  "last-quarter": "Ostatnia kwadra",
  "waning-crescent": "Ubywający sierp",
};

type Zodiac = { name: string; symbol: string };

const ZODIAC: { name: string; symbol: string; from: [number, number] }[] = [
  { name: "Koziorożec", symbol: "♑", from: [12, 22] },
  { name: "Wodnik", symbol: "♒", from: [1, 20] },
  { name: "Ryby", symbol: "♓", from: [2, 19] },
  { name: "Baran", symbol: "♈", from: [3, 21] },
  { name: "Byk", symbol: "♉", from: [4, 20] },
  { name: "Bliźnięta", symbol: "♊", from: [5, 21] },
  { name: "Rak", symbol: "♋", from: [6, 21] },
  { name: "Lew", symbol: "♌", from: [7, 23] },
  { name: "Panna", symbol: "♍", from: [8, 23] },
  { name: "Waga", symbol: "♎", from: [9, 23] },
  { name: "Skorpion", symbol: "♏", from: [10, 23] },
  { name: "Strzelec", symbol: "♐", from: [11, 22] },
  { name: "Koziorożec", symbol: "♑", from: [12, 22] },
];

export function getZodiac(month0: number, day: number): Zodiac {
  const m = month0 + 1;
  // znajdź ostatni przedział, którego początek jest <= (m, day)
  let result: Zodiac = { name: "Koziorożec", symbol: "♑" };
  for (const z of ZODIAC) {
    const [zm, zd] = z.from;
    if (m > zm || (m === zm && day >= zd)) {
      result = { name: z.name, symbol: z.symbol };
    }
  }
  return result;
}

export function daysInMonth(year: number, month0: number): number {
  return new Date(Date.UTC(year, month0 + 1, 0)).getUTCDate();
}
