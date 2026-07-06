// Astronomical calculations for the day page: sun & moon rise/set for Poland.
// Default location: Warszawa (52.2297 N, 21.0122 E). Times formatted in Europe/Warsaw.

export const DEFAULT_LOCATION = { name: "Warszawa", lat: 52.2297, lng: 21.0122 };
const TZ = "Europe/Warsaw";

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;

function rad(d: number) {
  return d * RAD;
}
function deg(r: number) {
  return r * DEG;
}

/** Julian day for 0h UTC of a Gregorian calendar date. */
function julianDay(year: number, month0: number, day: number): number {
  let y = year;
  let m = month0 + 1;
  if (m <= 2) {
    y -= 1;
    m += 12;
  }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

// ---------------------------------------------------------------------------
// Sun — NOAA solar position algorithm
// ---------------------------------------------------------------------------

function julianCentury(jd: number) {
  return (jd - 2451545) / 36525;
}
function geomMeanLongSun(t: number) {
  return ((280.46646 + t * (36000.76983 + t * 0.0003032)) % 360 + 360) % 360;
}
function geomMeanAnomalySun(t: number) {
  return 357.52911 + t * (35999.05029 - 0.0001537 * t);
}
function eccentricityEarthOrbit(t: number) {
  return 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
}
function sunEqOfCenter(t: number) {
  const m = rad(geomMeanAnomalySun(t));
  return (
    Math.sin(m) * (1.914602 - t * (0.004817 + 0.000014 * t)) +
    Math.sin(2 * m) * (0.019993 - 0.000101 * t) +
    Math.sin(3 * m) * 0.000289
  );
}
function sunApparentLong(t: number) {
  const trueLong = geomMeanLongSun(t) + sunEqOfCenter(t);
  const omega = 125.04 - 1934.136 * t;
  return trueLong - 0.00569 - 0.00478 * Math.sin(rad(omega));
}
function obliquityCorrection(t: number) {
  const seconds = 21.448 - t * (46.815 + t * (0.00059 - t * 0.001813));
  const e0 = 23 + (26 + seconds / 60) / 60;
  const omega = 125.04 - 1934.136 * t;
  return e0 + 0.00256 * Math.cos(rad(omega));
}
function sunDeclination(t: number) {
  const e = rad(obliquityCorrection(t));
  const lambda = rad(sunApparentLong(t));
  return deg(Math.asin(Math.sin(e) * Math.sin(lambda)));
}
function equationOfTime(t: number) {
  const epsilon = rad(obliquityCorrection(t));
  const l0 = rad(geomMeanLongSun(t));
  const e = eccentricityEarthOrbit(t);
  const m = rad(geomMeanAnomalySun(t));
  let y = Math.tan(epsilon / 2);
  y *= y;
  const Etime =
    y * Math.sin(2 * l0) -
    2 * e * Math.sin(m) +
    4 * e * y * Math.sin(m) * Math.cos(2 * l0) -
    0.5 * y * y * Math.sin(4 * l0) -
    1.25 * e * e * Math.sin(2 * m);
  return deg(Etime) * 4; // minutes
}

/** Returns UTC minutes from 0h for a solar event, or null (never rises/sets that day). */
function solarEventUTC(
  jd: number,
  lat: number,
  lngEast: number,
  angleDeg: number,
  kind: -1 | 0 | 1, // -1 rise, +1 set, 0 noon
): number | null {
  const compute = (jdAt: number) => {
    const t = julianCentury(jdAt);
    const eqTime = equationOfTime(t);
    const solarDec = sunDeclination(t);
    const noon = 720 - 4 * lngEast - eqTime;
    if (kind === 0) return { time: noon, ok: true };
    const latR = rad(lat);
    const decR = rad(solarDec);
    const cosH =
      Math.cos(rad(angleDeg)) / (Math.cos(latR) * Math.cos(decR)) - Math.tan(latR) * Math.tan(decR);
    if (cosH > 1 || cosH < -1) return { time: noon, ok: false };
    const ha = deg(Math.acos(cosH));
    return { time: noon + kind * 4 * ha, ok: true };
  };

  let res = compute(jd);
  if (!res.ok) return null;
  res = compute(jd + res.time / 1440);
  if (!res.ok) return null;
  return res.time;
}

function formatUTCMinutes(year: number, month0: number, day: number, utcMinutes: number): string {
  const ms = Date.UTC(year, month0, day) + Math.round(utcMinutes * 60000);
  return new Intl.DateTimeFormat("pl-PL", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date(ms));
}

export type SunTimes = {
  dawn: string | null;
  sunrise: string | null;
  solarNoon: string;
  sunset: string | null;
  dusk: string | null;
  dayLengthMinutes: number;
  dayLengthText: string;
};

export function getSunTimes(
  year: number,
  month0: number,
  day: number,
  lat = DEFAULT_LOCATION.lat,
  lng = DEFAULT_LOCATION.lng,
): SunTimes {
  const jd = julianDay(year, month0, day);
  const dawn = solarEventUTC(jd, lat, lng, 96, -1);
  const sunrise = solarEventUTC(jd, lat, lng, 90.833, -1);
  const noon = solarEventUTC(jd, lat, lng, 0, 0)!;
  const sunset = solarEventUTC(jd, lat, lng, 90.833, 1);
  const dusk = solarEventUTC(jd, lat, lng, 96, 1);

  let dayLengthMinutes = 0;
  if (sunrise !== null && sunset !== null) dayLengthMinutes = Math.round(sunset - sunrise);
  const h = Math.floor(dayLengthMinutes / 60);
  const m = dayLengthMinutes % 60;

  return {
    dawn: dawn === null ? null : formatUTCMinutes(year, month0, day, dawn),
    sunrise: sunrise === null ? null : formatUTCMinutes(year, month0, day, sunrise),
    solarNoon: formatUTCMinutes(year, month0, day, noon),
    sunset: sunset === null ? null : formatUTCMinutes(year, month0, day, sunset),
    dusk: dusk === null ? null : formatUTCMinutes(year, month0, day, dusk),
    dayLengthMinutes,
    dayLengthText: `${h} h ${m} min`,
  };
}

// ---------------------------------------------------------------------------
// Moon — MiniMoon (Montenbruck) position + rise/set by altitude crossing
// ---------------------------------------------------------------------------

function frac(x: number) {
  return x - Math.floor(x);
}

/** Low-precision geocentric equatorial coordinates of the Moon. Returns RA/Dec in radians. */
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
    22640 * Math.sin(L) -
    4586 * Math.sin(L - 2 * D) +
    2370 * Math.sin(2 * D) +
    769 * Math.sin(2 * L) -
    668 * Math.sin(LS) -
    412 * Math.sin(2 * F) -
    212 * Math.sin(2 * L - 2 * D) -
    206 * Math.sin(L + LS - 2 * D) +
    192 * Math.sin(L + 2 * D) -
    165 * Math.sin(LS - 2 * D) -
    125 * Math.sin(D) -
    110 * Math.sin(L + LS) +
    148 * Math.sin(L - LS) -
    55 * Math.sin(2 * F - 2 * D);

  const S = F + (DL + 412 * Math.sin(2 * F) + 541 * Math.sin(LS)) / ARC;
  const H = F - 2 * D;
  const N =
    -526 * Math.sin(H) +
    44 * Math.sin(L + H) -
    31 * Math.sin(-L + H) -
    23 * Math.sin(LS + H) +
    11 * Math.sin(-LS + H) -
    25 * Math.sin(-2 * L + F) +
    21 * Math.sin(-L + F);

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

/** Greenwich mean sidereal time in degrees for a Julian day. */
function gmstDeg(jd: number): number {
  const d = jd - 2451545;
  const T = d / 36525;
  let g = 280.46061837 + 360.98564736629 * d + T * T * (0.000387933 - T / 38710000);
  g = ((g % 360) + 360) % 360;
  return g;
}

/** Moon altitude (radians) at a UTC instant (as jd), for a location. */
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

export type MoonTimes = { moonrise: string | null; moonset: string | null };

/**
 * Moon rise/set that occur during the local (Warsaw) calendar day.
 * Scans the local day hour by hour, detecting horizon crossings of the Moon's
 * altitude (h0 = +0.125° accounts for parallax, refraction and semidiameter).
 */
export function getMoonTimes(
  year: number,
  month0: number,
  day: number,
  lat = DEFAULT_LOCATION.lat,
  lng = DEFAULT_LOCATION.lng,
): MoonTimes {
  const h0 = rad(0.125);
  // Offset for local noon of that date (stable across the day except DST edges).
  const offsetMin = tzOffsetMinutes(new Date(Date.UTC(year, month0, day, 12)));
  const localMidnightMs = Date.UTC(year, month0, day) - offsetMin * 60000;

  let moonrise: number | null = null;
  let moonset: number | null = null;

  let prevAlt = moonAltitude(
    2440587.5 + localMidnightMs / 86400000,
    lat,
    lng,
  ) - h0;

  for (let hour = 1; hour <= 24; hour++) {
    const ms = localMidnightMs + hour * 3600000;
    const jd = 2440587.5 + ms / 86400000;
    const alt = moonAltitude(jd, lat, lng) - h0;

    if (prevAlt < 0 && alt >= 0) {
      const t = prevAlt / (prevAlt - alt); // linear crossing fraction within the hour
      moonrise = ms - 3600000 + t * 3600000;
    } else if (prevAlt >= 0 && alt < 0) {
      const t = prevAlt / (prevAlt - alt);
      moonset = ms - 3600000 + t * 3600000;
    }
    prevAlt = alt;
  }

  const fmt = (ms: number | null) =>
    ms === null
      ? null
      : new Intl.DateTimeFormat("pl-PL", {
          timeZone: TZ,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date(ms));

  return { moonrise: fmt(moonrise), moonset: fmt(moonset) };
}
