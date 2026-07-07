// Sun sign (Sternzeichen) by date — German names.

export type Zodiac = { name: string; symbol: string };

const ZODIAC: { name: string; symbol: string; from: [number, number] }[] = [
  { name: "Steinbock", symbol: "♑", from: [12, 22] },
  { name: "Wassermann", symbol: "♒", from: [1, 20] },
  { name: "Fische", symbol: "♓", from: [2, 19] },
  { name: "Widder", symbol: "♈", from: [3, 21] },
  { name: "Stier", symbol: "♉", from: [4, 20] },
  { name: "Zwillinge", symbol: "♊", from: [5, 21] },
  { name: "Krebs", symbol: "♋", from: [6, 21] },
  { name: "Löwe", symbol: "♌", from: [7, 23] },
  { name: "Jungfrau", symbol: "♍", from: [8, 23] },
  { name: "Waage", symbol: "♎", from: [9, 23] },
  { name: "Skorpion", symbol: "♏", from: [10, 23] },
  { name: "Schütze", symbol: "♐", from: [11, 22] },
  { name: "Steinbock", symbol: "♑", from: [12, 22] },
];

export function getZodiacDE(month0: number, day: number): Zodiac {
  const m = month0 + 1;
  let result: Zodiac = { name: "Steinbock", symbol: "♑" };
  for (const z of ZODIAC) {
    const [zm, zd] = z.from;
    if (m > zm || (m === zm && day >= zd)) result = { name: z.name, symbol: z.symbol };
  }
  return result;
}
