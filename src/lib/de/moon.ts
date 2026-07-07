// Continuous moon phase (8 phases, German labels) + moonrise for the daily
// tear-off card. Ported from the PL calendar/astro libs; Europe/Berlin, Berlin
// as default location (same low-precision Montenbruck moon model).

import { DEFAULT_LOCATION } from "./sun";

const TZ = "Europe/Berlin";
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);
const SYNODIC_MONTH_MS = 29.530588861 * 24 * 60 * 60 * 1000;

export type MoonPhaseName =
  | "new" | "waxing-crescent" | "first-quarter" | "waxing-gibbous"
  | "full" | "waning-gibbous" | "last-quarter" | "waning-crescent";

const MOON_PHASES: { max: number; name: MoonPhaseName; icon: string; label: string }[] = [
  { max: 1.84566, name: "new", icon: "🌑", label: "Neumond" },
  { max: 5.53699, name: "waxing-crescent", icon: "🌒", label: "Zunehmende Sichel" },
  { max: 9.22831, name: "first-quarter", icon: "🌓", label: "Erstes Viertel" },
  { max: 12.91963, name: "waxing-gibbous", icon: "🌔", label: "Zunehmender Mond" },
  { max: 16.61096, name: "full", icon: "🌕", label: "Vollmond" },
  { max: 20.30228, name: "waning-gibbous", icon: "🌖", label: "Abnehmender Mond" },
  { max: 23.99361, name: "last-quarter", icon: "🌗", label: "Letztes Viertel" },
  { max: 27.68493, name: "waning-crescent", icon: "🌘", label: "Abnehmende Sichel" },
  { max: 29.530588861, name: "new", icon: "🌑", label: "Neumond" },
];

function getMoonAge(date: Date): number {
  const cycles = (date.getTime() - KNOWN_NEW_MOON) / SYNODIC_MONTH_MS;
  const fraction = cycles - Math.floor(cycles);
  return fraction * 29.530588861;
}

export function getMoonPhaseDE(date: Date): { icon: string; label: string } {
  const age = getMoonAge(date);
  const p = MOON_PHASES.find((x) => age < x.max) ?? MOON_PHASES[MOON_PHASES.length - 1];
  return { icon: p.icon, label: p.label };
}

// --- Moon rise/set (low precision) ---
const rad = (d: number) => (d * Math.PI) / 180;
const frac = (x: number) => x - Math.floor(x);

function julianCentury(jd: number) {
  return (jd - 2451545) / 36525;
}

function moonPosition(jd: number): { ra: number; dec: number } {
  const T = julianCentury(jd);
  const P2 = 2 * Math.PI;
  const ARC = 206264.8062;
  const COSEPS = 0.91748;
  const SINEPS = 0.39778;
  const L0 = frac(0.606433 + 1336.855225 * T);
  const L = P2 * frac(0.374897 + 1325.55241 * T);
  const LS = P2 * frac(0.993133 + 99.997361 * T);
  const D = P2 * frac(0.827361 + 1236.853086 * T);
  const F = P2 * frac(0.259086 + 1342.227825 * T);
  const DL =
    22640 * Math.sin(L) - 4586 * Math.sin(L - 2 * D) + 2370 * Math.sin(2 * D) + 769 * Math.sin(2 * L) -
    668 * Math.sin(LS) - 412 * Math.sin(2 * F) - 212 * Math.sin(2 * L - 2 * D) - 206 * Math.sin(L + LS - 2 * D) +
    192 * Math.sin(L + 2 * D) - 165 * Math.sin(LS - 2 * D) - 125 * Math.sin(D) - 110 * Math.sin(L + LS) +
    148 * Math.sin(L - LS) - 55 * Math.sin(2 * F - 2 * D);
  const S = F + (DL + 412 * Math.sin(2 * F) + 541 * Math.sin(LS)) / ARC;
  const H = F - 2 * D;
  const N =
    -526 * Math.sin(H) + 44 * Math.sin(L + H) - 31 * Math.sin(-L + H) - 23 * Math.sin(LS + H) +
    11 * Math.sin(-LS + H) - 25 * Math.sin(-2 * L + F) + 21 * Math.sin(-L + F);
  const lambda = P2 * frac(L0 + DL / 1296000);
  const beta = (18520 * Math.sin(S) + N) / ARC;
  const cosB = Math.cos(beta);
  const x = cosB * Math.cos(lambda);
  const V = cosB * Math.sin(lambda);
  const W = Math.sin(beta);
  const y = COSEPS * V - SINEPS * W;
  const z = SINEPS * V + COSEPS * W;
  const rho = Math.sqrt(x * x + y * y);
  let ra = Math.atan2(y, x);
  if (ra < 0) ra += P2;
  const dec = Math.atan2(z, rho);
  return { ra, dec };
}

function gmstDeg(jd: number): number {
  const d = jd - 2451545;
  const T = d / 36525;
  let g = 280.46061837 + 360.98564736629 * d + T * T * (0.000387933 - T / 38710000);
  g = ((g % 360) + 360) % 360;
  return g;
}

function moonAltitude(jd: number, lat: number, lngEast: number): number {
  const { ra, dec } = moonPosition(jd);
  const lstDeg = gmstDeg(jd) + lngEast;
  const H = rad(lstDeg) - ra;
  const latR = rad(lat);
  const sinAlt = Math.sin(latR) * Math.sin(dec) + Math.cos(latR) * Math.cos(dec) * Math.cos(H);
  return Math.asin(sinAlt);
}

function tzOffsetMinutes(instant: Date): number {
  const asUTC = new Date(instant.toLocaleString("en-US", { timeZone: "UTC" }));
  const asTZ = new Date(instant.toLocaleString("en-US", { timeZone: TZ }));
  return (asTZ.getTime() - asUTC.getTime()) / 60000;
}

/** Moonrise time (HH:MM, Europe/Berlin) during the given local day, or null. */
export function getMoonrise(
  year: number,
  month0: number,
  day: number,
  lat = DEFAULT_LOCATION.lat,
  lng = DEFAULT_LOCATION.lng,
): string | null {
  const h0 = rad(0.125);
  const offsetMin = tzOffsetMinutes(new Date(Date.UTC(year, month0, day, 12)));
  const localMidnightMs = Date.UTC(year, month0, day) - offsetMin * 60000;
  let moonrise: number | null = null;
  let prevAlt = moonAltitude(2440587.5 + localMidnightMs / 86400000, lat, lng) - h0;
  for (let hour = 1; hour <= 24; hour++) {
    const ms = localMidnightMs + hour * 3600000;
    const alt = moonAltitude(2440587.5 + ms / 86400000, lat, lng) - h0;
    if (prevAlt < 0 && alt >= 0) {
      const t = prevAlt / (prevAlt - alt);
      moonrise = ms - 3600000 + t * 3600000;
    }
    prevAlt = alt;
  }
  if (moonrise === null) return null;
  return new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(moonrise));
}
