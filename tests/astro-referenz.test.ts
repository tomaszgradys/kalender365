import { test } from "node:test";
import assert from "node:assert/strict";
import { getSeasonDate, getSeasons } from "../src/lib/de/astroYear.ts";
import { getMoonPhaseInstants } from "../src/lib/de/moonPhases.ts";
import { getSunTimes, DEFAULT_LOCATION } from "../src/lib/de/sun.ts";

// Referenz Jahreszeiten: USNO Astronomical Applications API (UT),
// https://aa.usno.navy.mil/api/seasons?year=2026 (…2027, 2028), abgerufen 2026-10-22.
// Referenz Mondphasen 2027: USNO https://aa.usno.navy.mil/api/moon/phases/year?year=2027
// und timeanddate.de/mond/phasen/deutschland/berlin?jahr=2027 (Ortszeit Berlin).

const USNO_SEASONS: Record<number, string[]> = {
  2026: ["2026-03-20T14:46Z", "2026-06-21T08:24Z", "2026-09-23T00:05Z", "2026-12-21T20:50Z"],
  2027: ["2027-03-20T20:25Z", "2027-06-21T14:11Z", "2027-09-23T06:02Z", "2027-12-22T02:42Z"],
  2028: ["2028-03-20T02:17Z", "2028-06-20T20:02Z", "2028-09-22T11:45Z", "2028-12-21T08:19Z"],
};

test("Jahreszeiten 2026–2028: Meeus (mit ΔT) gegen USNO auf ±2 Minuten", () => {
  for (const [y, refs] of Object.entries(USNO_SEASONS)) {
    refs.forEach((ref, i) => {
      const ours = getSeasonDate(Number(y), i as 0 | 1 | 2 | 3).getTime();
      const diffMin = Math.abs(ours - Date.parse(ref)) / 60000;
      assert.ok(diffMin <= 2, `${y} Jahreszeit ${i}: Abweichung ${diffMin.toFixed(1)} min (${new Date(ours).toISOString()} vs ${ref})`);
    });
  }
});

test("Jahreszeiten in Europe/Berlin: Datum exakt, Uhrzeit (MEZ/MESZ) auf ±1 Minute", () => {
  // USNO (UT) → Berlin: März/Dezember MEZ (+1 h), Juni/September MESZ (+2 h); USNO rundet auf Minuten.
  const expected: Record<number, [string, string][]> = {
    2026: [["20. März 2026", "15:46"], ["21. Juni 2026", "10:24"], ["23. September 2026", "02:05"], ["21. Dezember 2026", "21:50"]],
    2027: [["20. März 2027", "21:25"], ["21. Juni 2027", "16:11"], ["23. September 2027", "08:02"], ["22. Dezember 2027", "03:42"]],
    2028: [["20. März 2028", "03:17"], ["20. Juni 2028", "22:02"], ["22. September 2028", "13:45"], ["21. Dezember 2028", "09:19"]],
  };
  const toMin = (t: string) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5));
  for (const [y, refs] of Object.entries(expected)) {
    const s = getSeasons(Number(y));
    assert.deepEqual(s.map((x) => x.key), ["fruehling", "sommer", "herbst", "winter"]);
    refs.forEach(([date, time], i) => {
      assert.equal(s[i].date, date, `${y} Jahreszeit ${i}`);
      assert.ok(Math.abs(toMin(s[i].time) - toMin(time)) <= 1, `${y} Jahreszeit ${i}: ${s[i].time} vs ${time}`);
    });
  }
});

test("Mondphasen 2027: Vollmond-Daten (Berlin) und Anzahl je Phase", () => {
  const all = getMoonPhaseInstants(2027);
  const full = all.filter((p) => p.type === "full").map((p) => p.date);
  assert.deepEqual(full, [
    "2027-01-22", "2027-02-21", "2027-03-22", "2027-04-21", "2027-05-20", "2027-06-19",
    "2027-07-18", "2027-08-17", "2027-09-16", "2027-10-15", "2027-11-14", "2027-12-13",
  ]);
  const news = all.filter((p) => p.type === "new").map((p) => p.date);
  assert.deepEqual(news, [
    "2027-01-07", "2027-02-06", "2027-03-08", "2027-04-07", "2027-05-06", "2027-06-04",
    "2027-07-04", "2027-08-02", "2027-08-31", "2027-09-30", "2027-10-29", "2027-11-28", "2027-12-27",
  ]);
  assert.equal(all.filter((p) => p.type === "first").length, 12);
  assert.equal(all.filter((p) => p.type === "last").length, 12);
  assert.equal(all.filter((p) => p.blueMoon).length, 0); // 2027 kein Blue Moon
});

test("Mondphasen 2027: Uhrzeiten gegen USNO (UT→Berlin) auf ±5 Minuten", () => {
  const all = getMoonPhaseInstants(2027);
  const probe: [string, string, string][] = [
    // [type, Berlin-Datum, Berlin-Zeit] aus USNO (UT) umgerechnet: Jan/Feb/Nov/Dez MEZ (+1), sonst MESZ (+2)
    ["new", "2027-01-07", "21:24"],
    ["first", "2027-01-15", "21:34"],
    ["full", "2027-04-21", "00:27"],
    ["last", "2027-06-27", "06:54"],
    ["full", "2027-08-17", "09:29"],
    ["new", "2027-10-29", "15:36"],
    ["full", "2027-12-13", "17:09"],
  ];
  for (const [type, date, time] of probe) {
    const p = all.find((x) => x.type === type && x.date === date);
    assert.ok(p, `${type} ${date} fehlt`);
    const [h1, m1] = p!.time.split(":").map(Number);
    const [h2, m2] = time.split(":").map(Number);
    assert.ok(Math.abs(h1 * 60 + m1 - (h2 * 60 + m2)) <= 5, `${type} ${date}: ${p!.time} vs ${time}`);
  }
});

test("Sonnenzeiten: Standardort Berlin, Referenz 21.6.2026 und 21.12.2026 (±3 min)", () => {
  assert.equal(DEFAULT_LOCATION.name, "Berlin");
  const toMin = (s: string | null) => {
    assert.ok(s);
    const [h, m] = s!.split(":").map(Number);
    return h * 60 + m;
  };
  // timeanddate.de/sonne/deutschland/berlin: 21.06.2026 ↑04:43 ↓21:33; 21.12.2026 ↑08:15 ↓15:54 (MESZ/MEZ)
  const june = getSunTimes(2026, 5, 21);
  assert.ok(Math.abs(toMin(june.sunrise) - (4 * 60 + 43)) <= 3, `sunrise ${june.sunrise}`);
  assert.ok(Math.abs(toMin(june.sunset) - (21 * 60 + 33)) <= 3, `sunset ${june.sunset}`);
  const dec = getSunTimes(2026, 11, 21);
  assert.ok(Math.abs(toMin(dec.sunrise) - (8 * 60 + 15)) <= 3, `sunrise ${dec.sunrise}`);
  assert.ok(Math.abs(toMin(dec.sunset) - (15 * 60 + 54)) <= 3, `sunset ${dec.sunset}`);
  // München liegt südwestlich: Sonnenuntergang am 21.6. später als in Berlin (Länge), Tag kürzer (Breite).
  const muc = getSunTimes(2026, 5, 21, 48.1351, 11.582);
  assert.ok(toMin(muc.sunset) < toMin(june.sunset) + 10 && muc.dayLengthMinutes < june.dayLengthMinutes);
});
