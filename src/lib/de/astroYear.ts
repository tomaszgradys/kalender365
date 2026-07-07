// Jahreszeiten (astronomische Anfänge) und Zeitumstellung für Deutschland.
// Astronomische Zeitpunkte nach Meeus; Zeitzone Europe/Berlin. Da Deutschland
// und Polen dieselbe Zeitzone/DST-Regel haben, sind die Instants identisch —
// nur Beschriftung und Locale sind deutsch.

export type Season = {
  key: "fruehling" | "sommer" | "herbst" | "winter";
  name: string;
  date: string;
  time: string;
};

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

export function getSeasonDate(year: number, which: 0 | 1 | 2 | 3): Date {
  return jdeToDate(seasonJDE(year, which));
}

export function getSeasons(year: number): Season[] {
  const defs: { key: Season["key"]; name: string; which: 0 | 1 | 2 | 3 }[] = [
    { key: "fruehling", name: "Frühlingsanfang (Tagundnachtgleiche)", which: 0 },
    { key: "sommer", name: "Sommeranfang (Sommersonnenwende)", which: 1 },
    { key: "herbst", name: "Herbstanfang (Tagundnachtgleiche)", which: 2 },
    { key: "winter", name: "Winteranfang (Wintersonnenwende)", which: 3 },
  ];
  return defs.map((def) => {
    const date = jdeToDate(seasonJDE(year, def.which));
    return {
      key: def.key,
      name: def.name,
      date: new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", day: "numeric", month: "long", year: "numeric" }).format(date),
      time: new Intl.DateTimeFormat("de-DE", { timeZone: "Europe/Berlin", hour: "2-digit", minute: "2-digit" }).format(date),
    };
  });
}

// Zeitumstellung — letzter Sonntag im März und Oktober (EU-Regel).
function lastSundayOfMonth(year: number, month0: number): Date {
  const last = new Date(Date.UTC(year, month0 + 1, 0));
  const dow = last.getUTCDay();
  last.setUTCDate(last.getUTCDate() - dow);
  return last;
}

export type DSTChange = { date: string; iso: string; label: string; detail: string };

export function getDSTChanges(year: number): DSTChange[] {
  const spring = lastSundayOfMonth(year, 2); // März
  const autumn = lastSundayOfMonth(year, 9); // Oktober
  const fmt = (d: Date) =>
    new Intl.DateTimeFormat("de-DE", { timeZone: "UTC", weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(d);
  const iso = (d: Date) => d.toISOString().slice(0, 10);
  return [
    {
      date: fmt(spring),
      iso: iso(spring),
      label: "Beginn der Sommerzeit",
      detail: "In der Nacht werden die Uhren von 2:00 auf 3:00 vorgestellt — eine Stunde weniger Schlaf.",
    },
    {
      date: fmt(autumn),
      iso: iso(autumn),
      label: "Ende der Sommerzeit (Winterzeit)",
      detail: "In der Nacht werden die Uhren von 3:00 auf 2:00 zurückgestellt — eine Stunde mehr Schlaf.",
    },
  ];
}
