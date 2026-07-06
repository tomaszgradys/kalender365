// Dokładne momenty faz Księżyca — algorytm Meeusa „Astronomical Algorithms", rozdz. 49.
// Zwraca datę I GODZINĘ (czas urzędowy w Polsce, z uwzględnieniem czasu letniego/zimowego),
// znak zodiaku Księżyca oraz flagę „Blue Moon" (druga pełnia w miesiącu kalendarzowym).
// Dokładność ~1 minuta — na poziomie najlepszych serwisów kalendarzowych.

export type PhaseType = "new" | "first" | "full" | "last";

export type MoonPhaseInstant = {
  /** Data lokalna (Europe/Warsaw) w formacie YYYY-MM-DD. */
  date: string;
  /** Godzina lokalna (Europe/Warsaw) HH:MM. */
  time: string;
  type: PhaseType;
  label: string;
  icon: string;
  /** Znak zodiaku, w którym znajduje się Księżyc w momencie fazy. */
  zodiacSign: string;
  zodiacSymbol: string;
  /** True dla drugiej pełni w tym samym miesiącu kalendarzowym (Blue Moon). */
  blueMoon: boolean;
};

const META: Record<PhaseType, { frac: number; label: string; icon: string }> = {
  new: { frac: 0, label: "Nów", icon: "🌑" },
  first: { frac: 0.25, label: "Pierwsza kwadra", icon: "🌓" },
  full: { frac: 0.5, label: "Pełnia", icon: "🌕" },
  last: { frac: 0.75, label: "Ostatnia kwadra", icon: "🌗" },
};

const ZODIAC: { name: string; symbol: string }[] = [
  { name: "Baran", symbol: "♈" },
  { name: "Byk", symbol: "♉" },
  { name: "Bliźnięta", symbol: "♊" },
  { name: "Rak", symbol: "♋" },
  { name: "Lew", symbol: "♌" },
  { name: "Panna", symbol: "♍" },
  { name: "Waga", symbol: "♎" },
  { name: "Skorpion", symbol: "♏" },
  { name: "Strzelec", symbol: "♐" },
  { name: "Koziorożec", symbol: "♑" },
  { name: "Wodnik", symbol: "♒" },
  { name: "Ryby", symbol: "♓" },
];

const RAD = Math.PI / 180;
const sin = (deg: number) => Math.sin(deg * RAD);
const cos = (deg: number) => Math.cos(deg * RAD);
const norm360 = (x: number) => ((x % 360) + 360) % 360;

// ΔT (TD − UT) w sekundach, przybliżenie Espenaka/Meeusa dla lat 2005–2050.
function deltaTseconds(year: number): number {
  const t = year - 2000;
  return 62.92 + 0.32217 * t + 0.005589 * t * t;
}

/** JDE (Dynamical Time) danej fazy dla lunacji k (k całkowite = nów; +0.25/0.5/0.75). */
function phaseJDE(k: number): number {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  let jde = 2451550.09766 + 29.530588861 * k + 0.00015437 * T2 - 0.000000150 * T3 + 0.00000000073 * T4;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;
  const M = norm360(2.5534 + 29.1053567 * k - 0.0000014 * T2 - 0.00000011 * T3); // anomalia Słońca
  const Mp = norm360(201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4); // anomalia Księżyca
  const F = norm360(160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4); // argument szerokości
  const Om = norm360(124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3); // węzeł wstępujący

  const phase = ((k % 1) + 1) % 1; // 0, .25, .5, .75

  if (phase < 0.01 || Math.abs(phase - 0.5) < 0.01) {
    // Nów i pełnia — ta sama lista poprawek (Meeus 49).
    jde +=
      -0.4072 * sin(Mp) +
      0.17241 * E * sin(M) +
      0.01608 * sin(2 * Mp) +
      0.01039 * sin(2 * F) +
      0.00739 * E * sin(Mp - M) +
      -0.00514 * E * sin(Mp + M) +
      0.00208 * E * E * sin(2 * M) +
      -0.00111 * sin(Mp - 2 * F) +
      -0.00057 * sin(Mp + 2 * F) +
      0.00056 * E * sin(2 * Mp + M) +
      -0.00042 * sin(3 * Mp) +
      0.00042 * E * sin(M + 2 * F) +
      0.00038 * E * sin(M - 2 * F) +
      -0.00024 * E * sin(2 * Mp - M) +
      -0.00017 * sin(Om) +
      -0.00007 * sin(Mp + 2 * M) +
      0.00004 * sin(2 * Mp - 2 * F) +
      0.00004 * sin(3 * M) +
      0.00003 * sin(Mp + M - 2 * F) +
      0.00003 * sin(2 * Mp + 2 * F) +
      -0.00003 * sin(Mp + M + 2 * F) +
      0.00003 * sin(Mp - M + 2 * F) +
      -0.00002 * sin(Mp - M - 2 * F) +
      -0.00002 * sin(3 * Mp + M) +
      0.00002 * sin(4 * Mp);
  } else {
    // Pierwsza i ostatnia kwadra.
    jde +=
      -0.62801 * sin(Mp) +
      0.17172 * E * sin(M) +
      -0.01183 * E * sin(Mp + M) +
      0.00862 * sin(2 * Mp) +
      0.00804 * sin(2 * F) +
      0.00454 * E * sin(Mp - M) +
      0.00204 * E * E * sin(2 * M) +
      -0.0018 * sin(Mp - 2 * F) +
      -0.0007 * sin(Mp + 2 * F) +
      -0.0004 * sin(3 * Mp) +
      -0.00034 * E * sin(2 * Mp - M) +
      0.00032 * E * sin(M + 2 * F) +
      0.00032 * E * sin(M - 2 * F) +
      -0.00028 * E * E * sin(Mp + 2 * M) +
      0.00027 * E * sin(2 * Mp + M) +
      -0.00017 * sin(Om) +
      -0.00005 * sin(Mp - M - 2 * F) +
      0.00004 * sin(2 * Mp + 2 * F) +
      -0.00004 * sin(Mp + M + 2 * F) +
      0.00004 * sin(Mp - 2 * M) +
      0.00003 * sin(Mp + M - 2 * F) +
      0.00003 * sin(3 * M) +
      0.00002 * sin(2 * Mp - 2 * F) +
      0.00002 * sin(Mp - M + 2 * F) +
      -0.00002 * sin(3 * Mp + M);

    const W =
      0.00306 -
      0.00038 * E * cos(M) +
      0.00026 * cos(Mp) -
      0.00002 * cos(Mp - M) +
      0.00002 * cos(Mp + M) +
      0.00002 * cos(2 * F);
    jde += phase < 0.5 ? W : -W; // pierwsza kwadra +W, ostatnia −W
  }

  // Poprawki planetarne A1..A14 (wspólne dla wszystkich faz).
  const A = [
    299.77 + 0.107408 * k - 0.009173 * T2,
    251.88 + 0.016321 * k,
    251.83 + 26.651886 * k,
    349.42 + 36.412478 * k,
    84.66 + 18.206239 * k,
    141.74 + 53.303771 * k,
    207.14 + 2.453732 * k,
    154.84 + 7.30686 * k,
    34.52 + 27.261239 * k,
    207.19 + 0.121824 * k,
    291.34 + 1.844379 * k,
    161.72 + 24.198154 * k,
    239.56 + 25.513099 * k,
    331.55 + 3.592518 * k,
  ];
  const Acoef = [
    0.000325, 0.000165, 0.000164, 0.000126, 0.00011, 0.000062, 0.00006, 0.000056, 0.000047, 0.000042,
    0.00004, 0.000037, 0.000035, 0.000023,
  ];
  for (let i = 0; i < A.length; i++) jde += Acoef[i] * sin(norm360(A[i]));

  return jde;
}

/** Przybliżona długość ekliptyczna Słońca (Meeus 25) dla danego JD (UT). */
function sunLongitude(jdUT: number): number {
  const T = (jdUT - 2451545) / 36525;
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * sin(M) +
    (0.019993 - 0.000101 * T) * sin(2 * M) +
    0.000289 * sin(3 * M);
  return norm360(L0 + C);
}

function jdToDate(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

// Części daty/godziny w strefie Europe/Warsaw (z DST).
const warsawFmt = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Warsaw",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});
function warsawParts(d: Date): { date: string; time: string; year: number } {
  const p: Record<string, string> = {};
  for (const part of warsawFmt.formatToParts(d)) p[part.type] = part.value;
  const hour = p.hour === "24" ? "00" : p.hour; // en-CA bywa zwraca 24:xx o północy
  return { date: `${p.year}-${p.month}-${p.day}`, time: `${hour}:${p.minute}`, year: Number(p.year) };
}

/** Wszystkie fazy główne danego roku (czas lokalny PL), z godziną, zodiakiem i Blue Moon. */
export function getMoonPhaseInstants(year: number): MoonPhaseInstant[] {
  const dT = deltaTseconds(year) / 86400; // ΔT w dobach
  const kApprox = (year - 2000) * 12.3685;
  const kStart = Math.floor(kApprox) - 2;
  const kEnd = Math.ceil(kApprox) + 14;

  const out: MoonPhaseInstant[] = [];
  const types: PhaseType[] = ["new", "first", "full", "last"];

  for (let ki = kStart; ki <= kEnd; ki++) {
    for (const type of types) {
      const k = ki + META[type].frac;
      const jdeTD = phaseJDE(k);
      const jdUT = jdeTD - dT; // TD → UT
      const d = jdToDate(jdUT);
      const wp = warsawParts(d);
      if (wp.year !== year) continue;

      const lonSun = sunLongitude(jdUT);
      const offset = { new: 0, first: 90, full: 180, last: 270 }[type];
      const lonMoon = norm360(lonSun + offset);
      const z = ZODIAC[Math.floor(lonMoon / 30) % 12];

      out.push({
        date: wp.date,
        time: wp.time,
        type,
        label: META[type].label,
        icon: META[type].icon,
        zodiacSign: z.name,
        zodiacSymbol: z.symbol,
        blueMoon: false,
      });
    }
  }

  out.sort((a, b) => (a.date === b.date ? a.time.localeCompare(b.time) : a.date.localeCompare(b.date)));

  // Blue Moon: druga (i kolejna) pełnia w tym samym miesiącu kalendarzowym.
  const fullByMonth = new Map<string, number>();
  for (const p of out) {
    if (p.type !== "full") continue;
    const m = p.date.slice(0, 7);
    const n = (fullByMonth.get(m) ?? 0) + 1;
    fullByMonth.set(m, n);
    if (n >= 2) p.blueMoon = true;
  }

  return out;
}
