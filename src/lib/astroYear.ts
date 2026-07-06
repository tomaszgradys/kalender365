import { getMoonAge } from "./calendar";

// ---------------------------------------------------------------------------
// Fazy księżyca na cały rok
// ---------------------------------------------------------------------------

export type MoonPhaseType = "new" | "first" | "full" | "last";
export type MoonPhaseEvent = { date: string; type: MoonPhaseType; label: string; icon: string };

const SYNODIC = 29.530588861;
const BOUNDS: { age: number; type: MoonPhaseType; label: string; icon: string }[] = [
  { age: 0, type: "new", label: "Nów", icon: "🌑" },
  { age: SYNODIC / 4, type: "first", label: "Pierwsza kwadra", icon: "🌓" },
  { age: SYNODIC / 2, type: "full", label: "Pełnia", icon: "🌕" },
  { age: (SYNODIC * 3) / 4, type: "last", label: "Ostatnia kwadra", icon: "🌗" },
];

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

/** Wszystkie fazy główne (nów, kwadry, pełnia) w danym roku, posortowane po dacie. */
export function getMoonPhasesForYear(year: number): MoonPhaseEvent[] {
  const events: MoonPhaseEvent[] = [];
  const ageAt = (y: number, m: number, d: number) => getMoonAge(new Date(Date.UTC(y, m, d, 12)));

  let prev = ageAt(year, 0, 0); // 31 grudnia roku poprzedniego
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year, 11, 31));

  for (let t = start.getTime(); t <= end.getTime(); t += 86400000) {
    const d = new Date(t);
    const curr = getMoonAge(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 12)));

    // nów — wiek „przeskakuje" przez 0
    if (curr < prev) {
      const closerPrev = SYNODIC - prev < curr;
      const chosen = closerPrev ? new Date(t - 86400000) : d;
      pushEvent(events, chosen, BOUNDS[0], year);
    }
    // kwadry i pełnia
    for (let i = 1; i < BOUNDS.length; i++) {
      const b = BOUNDS[i];
      if (prev < b.age && curr >= b.age) {
        const closerPrev = b.age - prev < curr - b.age;
        const chosen = closerPrev ? new Date(t - 86400000) : d;
        pushEvent(events, chosen, b, year);
      }
    }
    prev = curr;
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

function pushEvent(
  arr: MoonPhaseEvent[],
  d: Date,
  b: { type: MoonPhaseType; label: string; icon: string },
  year: number,
) {
  if (d.getUTCFullYear() !== year) return;
  const date = `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
  if (arr.some((e) => e.date === date && e.type === b.type)) return;
  arr.push({ date, type: b.type, label: b.label, icon: b.icon });
}

// ---------------------------------------------------------------------------
// Pory roku — równonoce i przesilenia (algorytm Meeus, przybliżony)
// ---------------------------------------------------------------------------

export type Season = { key: "wiosna" | "lato" | "jesien" | "zima"; name: string; date: string; time: string };

const PERIODIC_TERMS: [number, number, number][] = [
  [485, 324.96, 1934.136], [203, 337.23, 32964.467], [199, 342.08, 20.186], [182, 27.85, 445267.112],
  [156, 73.14, 45036.886], [136, 171.52, 22518.443], [77, 222.54, 65928.934], [74, 296.72, 3034.906],
  [70, 243.58, 9037.513], [58, 119.81, 33718.147], [52, 297.17, 150.678], [50, 21.02, 2281.226],
  [45, 247.54, 29929.562], [44, 325.15, 31555.956], [29, 60.93, 4443.417], [18, 155.12, 67555.328],
  [17, 288.79, 4562.452], [16, 198.04, 62894.029], [14, 199.76, 31436.921], [12, 95.39, 14577.848],
  [12, 287.11, 31931.756], [12, 320.81, 34777.259], [9, 227.73, 1222.114], [8, 15.45, 16859.074],
];

function seasonJDE(year: number, which: 0 | 1 | 2 | 3): number {
  const Y = (year - 2000) / 1000;
  const base = [
    [2451623.80984, 365242.37404, 0.05169, -0.00411, -0.00057],
    [2451716.56767, 365241.62603, 0.00325, 0.00888, -0.0003],
    [2451810.21715, 365242.01767, -0.11575, 0.00337, 0.00078],
    [2451900.05952, 365242.74049, -0.06223, -0.00823, 0.00032],
  ][which];
  const jde0 = base[0] + base[1] * Y + base[2] * Y * Y + base[3] * Y ** 3 + base[4] * Y ** 4;
  const T = (jde0 - 2451545) / 36525;
  const W = (35999.373 * T - 2.47) * (Math.PI / 180);
  const dLambda = 1 + 0.0334 * Math.cos(W) + 0.0007 * Math.cos(2 * W);
  let S = 0;
  for (const [A, B, C] of PERIODIC_TERMS) S += A * Math.cos((B + C * T) * (Math.PI / 180));
  return jde0 + (0.00001 * S) / dLambda;
}

function jdeToDate(jde: number): Date {
  return new Date((jde - 2440587.5) * 86400000);
}

/** Surowa data (instant) danej pory roku: 0=wiosna,1=lato,2=jesień,3=zima. */
export function getSeasonDate(year: number, which: 0 | 1 | 2 | 3): Date {
  return jdeToDate(seasonJDE(year, which));
}

export function getSeasons(year: number): Season[] {
  const defs: { key: Season["key"]; name: string; which: 0 | 1 | 2 | 3 }[] = [
    { key: "wiosna", name: "Pierwszy dzień wiosny (równonoc wiosenna)", which: 0 },
    { key: "lato", name: "Pierwszy dzień lata (przesilenie letnie)", which: 1 },
    { key: "jesien", name: "Pierwszy dzień jesieni (równonoc jesienna)", which: 2 },
    { key: "zima", name: "Pierwszy dzień zimy (przesilenie zimowe)", which: 3 },
  ];
  return defs.map((def) => {
    const date = jdeToDate(seasonJDE(year, def.which));
    return {
      key: def.key,
      name: def.name,
      date: new Intl.DateTimeFormat("pl-PL", { timeZone: "Europe/Warsaw", day: "numeric", month: "long", year: "numeric" }).format(date),
      time: new Intl.DateTimeFormat("pl-PL", { timeZone: "Europe/Warsaw", hour: "2-digit", minute: "2-digit" }).format(date),
    };
  });
}

// ---------------------------------------------------------------------------
// Zmiana czasu (czas letni / zimowy) — ostatnia niedziela marca i października
// ---------------------------------------------------------------------------

function lastSundayOfMonth(year: number, month0: number): Date {
  const last = new Date(Date.UTC(year, month0 + 1, 0));
  const dow = last.getUTCDay(); // 0=niedziela
  last.setUTCDate(last.getUTCDate() - dow);
  return last;
}

export type DSTChange = { date: string; label: string; detail: string };

export function getDSTChanges(year: number): DSTChange[] {
  const spring = lastSundayOfMonth(year, 2); // marzec
  const autumn = lastSundayOfMonth(year, 9); // październik
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("pl-PL", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" }).format(d);
  return [
    {
      date: fmt(spring),
      label: "Zmiana na czas letni",
      detail: "W nocy przesuwamy zegary z 2:00 na 3:00 — śpimy godzinę krócej.",
    },
    {
      date: fmt(autumn),
      label: "Zmiana na czas zimowy",
      detail: "W nocy przesuwamy zegary z 3:00 na 2:00 — śpimy godzinę dłużej.",
    },
  ];
}

// ---------------------------------------------------------------------------
// Niedziele handlowe (reguła obowiązująca od 2020)
// ---------------------------------------------------------------------------

function lastSundayDate(year: number, month0: number): string {
  const d = lastSundayOfMonth(year, month0);
  return `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`;
}

/** Zwraca daty niedziel handlowych w danym roku (reguła 2020+). */
export function getTradingSundays(year: number): string[] {
  const result = new Set<string>();
  // ostatnie niedziele stycznia, kwietnia, czerwca, sierpnia
  for (const m of [0, 3, 5, 7]) result.add(lastSundayDate(year, m));
  // niedziela przed Wielkanocą (Niedziela Palmowa) — 7 dni przed Wielkanocą
  // liczona w astroYear bez importu holidays, więc oblicz Wielkanoc lokalnie
  const easter = computeEaster(year);
  const palm = new Date(easter);
  palm.setUTCDate(easter.getUTCDate() - 7);
  result.add(`${palm.getUTCFullYear()}-${pad(palm.getUTCMonth() + 1)}-${pad(palm.getUTCDate())}`);
  // dwie niedziele poprzedzające Boże Narodzenie
  const xmas = new Date(Date.UTC(year, 11, 25));
  const beforeXmas: Date[] = [];
  const cursor = new Date(xmas);
  while (beforeXmas.length < 2) {
    cursor.setUTCDate(cursor.getUTCDate() - 1);
    if (cursor.getUTCDay() === 0) beforeXmas.push(new Date(cursor));
  }
  for (const d of beforeXmas) result.add(`${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`);
  return [...result].sort();
}

function computeEaster(year: number): Date {
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
