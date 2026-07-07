// Sonnenauf-/-untergang (NOAA-Algorithmus). Standardort Berlin; Zeiten in
// Europe/Berlin. Portiert aus der PL-Version, mit deutschem Standardort/Locale.

export const DEFAULT_LOCATION = { name: "Berlin", lat: 52.52, lng: 13.405 };
const TZ = "Europe/Berlin";

const RAD = Math.PI / 180;
const DEG = 180 / Math.PI;
const rad = (d: number) => d * RAD;
const deg = (r: number) => r * DEG;

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

const julianCentury = (jd: number) => (jd - 2451545) / 36525;
const geomMeanLongSun = (t: number) => (((280.46646 + t * (36000.76983 + t * 0.0003032)) % 360) + 360) % 360;
const geomMeanAnomalySun = (t: number) => 357.52911 + t * (35999.05029 - 0.0001537 * t);
const eccentricityEarthOrbit = (t: number) => 0.016708634 - t * (0.000042037 + 0.0000001267 * t);
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
  return deg(Etime) * 4;
}

function solarEventUTC(jd: number, lat: number, lngEast: number, angleDeg: number, kind: -1 | 0 | 1): number | null {
  const compute = (jdAt: number) => {
    const t = julianCentury(jdAt);
    const eqTime = equationOfTime(t);
    const solarDec = sunDeclination(t);
    const noon = 720 - 4 * lngEast - eqTime;
    if (kind === 0) return { time: noon, ok: true };
    const latR = rad(lat);
    const decR = rad(solarDec);
    const cosH = Math.cos(rad(angleDeg)) / (Math.cos(latR) * Math.cos(decR)) - Math.tan(latR) * Math.tan(decR);
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
  return new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(ms));
}

export type SunTimes = {
  sunrise: string | null;
  solarNoon: string;
  sunset: string | null;
  dayLengthText: string;
  dayLengthMinutes: number;
};

export function getSunTimes(
  year: number,
  month0: number,
  day: number,
  lat = DEFAULT_LOCATION.lat,
  lng = DEFAULT_LOCATION.lng,
): SunTimes {
  const jd = julianDay(year, month0, day);
  const sunrise = solarEventUTC(jd, lat, lng, 90.833, -1);
  const noon = solarEventUTC(jd, lat, lng, 0, 0)!;
  const sunset = solarEventUTC(jd, lat, lng, 90.833, 1);
  let dayLengthMinutes = 0;
  if (sunrise !== null && sunset !== null) dayLengthMinutes = Math.round(sunset - sunrise);
  const h = Math.floor(dayLengthMinutes / 60);
  const m = dayLengthMinutes % 60;
  return {
    sunrise: sunrise === null ? null : formatUTCMinutes(year, month0, day, sunrise),
    solarNoon: formatUTCMinutes(year, month0, day, noon),
    sunset: sunset === null ? null : formatUTCMinutes(year, month0, day, sunset),
    dayLengthMinutes,
    dayLengthText: `${h} Std. ${m} Min.`,
  };
}

// Grössere deutsche Städte für die Ortsauswahl auf der Sonnen-Seite.
export const CITIES = [
  { name: "Berlin", lat: 52.52, lng: 13.405 },
  { name: "Hamburg", lat: 53.5511, lng: 9.9937 },
  { name: "München", lat: 48.1351, lng: 11.582 },
  { name: "Köln", lat: 50.9375, lng: 6.9603 },
  { name: "Frankfurt am Main", lat: 50.1109, lng: 8.6821 },
  { name: "Stuttgart", lat: 48.7758, lng: 9.1829 },
  { name: "Leipzig", lat: 51.3397, lng: 12.3731 },
  { name: "Dortmund", lat: 51.5136, lng: 7.4653 },
];
