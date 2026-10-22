import { test } from "node:test";
import assert from "node:assert/strict";
import { easterSunday, getAllFeiertage, getFeiertage, workFreeHolidaySet } from "../src/lib/de/feiertage.ts";
import { STATE_CODES, type StateCode } from "../src/lib/de/bundeslaender.ts";

// Referenz: Feiertagsgesetze der Länder; Übersichten DGB (dgb.de/service/ratgeber/feiertage/)
// und feiertage-deutschland.de (2026/2027/2028). Geprüft 2026-10-22.

const isoOf = (d: Date) => d.toISOString().slice(0, 10);
const slugs = (y: number, s: StateCode, partial = false) =>
  getFeiertage(y, s, { includePartial: partial, includeSundayLegal: false }).map((h) => h.slug);
const count = (y: number, s: StateCode) => slugs(y, s).length;

test("Ostersonntag 2026–2030 (Gauß/Meeus)", () => {
  assert.equal(isoOf(easterSunday(2026)), "2026-04-05");
  assert.equal(isoOf(easterSunday(2027)), "2027-03-28");
  assert.equal(isoOf(easterSunday(2028)), "2028-04-16");
  assert.equal(isoOf(easterSunday(2029)), "2029-04-01");
  assert.equal(isoOf(easterSunday(2030)), "2030-04-21");
  for (const y of [2026, 2027, 2028, 2029, 2030]) assert.equal(easterSunday(y).getUTCDay(), 0, `Ostern ${y} ist kein Sonntag`);
});

test("Bewegliche Feiertage 2027/2028 (abgeleitet von Ostern)", () => {
  const by = (y: number, slug: string) => getAllFeiertage(y).find((h) => h.slug === slug && h.scope !== "partial")!.date;
  assert.equal(by(2027, "karfreitag"), "2027-03-26");
  assert.equal(by(2027, "ostermontag"), "2027-03-29");
  assert.equal(by(2027, "christi-himmelfahrt"), "2027-05-06");
  assert.equal(by(2027, "pfingstmontag"), "2027-05-17");
  assert.equal(by(2027, "fronleichnam"), "2027-05-27");
  assert.equal(by(2027, "buss-und-bettag"), "2027-11-17");
  assert.equal(by(2028, "karfreitag"), "2028-04-14");
  assert.equal(by(2028, "ostermontag"), "2028-04-17");
  assert.equal(by(2028, "christi-himmelfahrt"), "2028-05-25");
  assert.equal(by(2028, "pfingstmontag"), "2028-06-05");
  assert.equal(by(2028, "fronleichnam"), "2028-06-15");
  assert.equal(by(2028, "buss-und-bettag"), "2028-11-22");
});

// Zahl der landesweit arbeitsfreien gesetzlichen Feiertage (ohne „teilweise“
// und ohne Sonntags-Feiertage Brandenburgs). 2026 und 2027 identisch, 2028 hat
// Berlin zusätzlich den einmaligen 17. Juni.
const EXPECTED: Record<StateCode, number> = {
  BW: 12, BY: 12, BE: 10, BB: 10, HB: 10, HH: 10, HE: 10, MV: 11,
  NI: 10, NW: 11, RP: 11, SL: 12, SN: 11, ST: 11, SH: 10, TH: 11,
};

for (const y of [2026, 2027, 2028]) {
  test(`Anzahl gesetzlicher Feiertage ${y} in allen 16 Ländern`, () => {
    for (const s of STATE_CODES) {
      const expected = EXPECTED[s] + (y === 2028 && s === "BE" ? 1 : 0);
      assert.equal(count(y, s), expected, `${s} ${y}: ${slugs(y, s).join(",")}`);
    }
  });
}

test("Regionale Feiertage: Länderlisten 2026–2028", () => {
  for (const y of [2026, 2027, 2028]) {
    const states = (slug: string, scope: "state" | "partial") =>
      getAllFeiertage(y)
        .filter((h) => h.slug === slug && h.scope === scope)
        .flatMap((h) => h.states)
        .sort();
    assert.deepEqual(states("heilige-drei-koenige", "state"), ["BW", "BY", "ST"]);
    assert.deepEqual(states("fronleichnam", "state"), ["BW", "BY", "HE", "NW", "RP", "SL"]);
    assert.deepEqual(states("fronleichnam", "partial"), ["SN", "TH"]);
    assert.deepEqual(states("mariae-himmelfahrt", "state"), ["SL"]);
    assert.deepEqual(states("mariae-himmelfahrt", "partial"), ["BY"]);
    assert.deepEqual(states("augsburger-friedensfest", "partial"), ["BY"]);
    assert.deepEqual(states("reformationstag", "state"), ["BB", "HB", "HH", "MV", "NI", "SH", "SN", "ST", "TH"]);
    assert.deepEqual(states("allerheiligen", "state"), ["BW", "BY", "NW", "RP", "SL"]);
    assert.deepEqual(states("buss-und-bettag", "state"), ["SN"]);
    assert.deepEqual(states("internationaler-frauentag", "state"), ["BE", "MV"]);
    assert.deepEqual(states("weltkindertag", "state"), ["TH"]);
    const sundayLegal = getAllFeiertage(y).filter((h) => h.scope === "sunday-legal");
    assert.deepEqual(sundayLegal.map((h) => h.slug).sort(), ["ostersonntag", "pfingstsonntag"]);
    for (const h of sundayLegal) assert.deepEqual(h.states, ["BB"]);
  }
});

test("„Gilt nur in Teilen des Landes“: jede partial-Definition trägt eine Erklärung", () => {
  for (const h of getAllFeiertage(2026)) {
    if (h.scope === "partial" || h.scope === "sunday-legal") {
      assert.ok(h.note && h.note.length > 20, `${h.slug} ohne note`);
    }
  }
  // Augsburger Friedensfest darf nie landesweit zählen.
  assert.ok(!slugs(2026, "BY").includes("augsburger-friedensfest"));
  assert.ok(slugs(2026, "BY", true).includes("augsburger-friedensfest"));
});

test("Historie Reformationstag: Norden erst ab 2018, 2017 einmalig bundesweit", () => {
  for (const s of ["HB", "HH", "NI", "SH"] as StateCode[]) {
    assert.ok(!slugs(2015, s).includes("reformationstag"), `${s} 2015`);
    assert.ok(!slugs(2016, s).includes("reformationstag"), `${s} 2016`);
    assert.ok(slugs(2018, s).includes("reformationstag"), `${s} 2018`);
  }
  for (const s of STATE_CODES) assert.ok(slugs(2017, s).includes("reformationstag"), `${s} 2017`);
  for (const s of ["BW", "BY", "BE", "HE", "NW", "RP", "SL"] as StateCode[]) {
    assert.ok(!slugs(2016, s).includes("reformationstag"), `${s} 2016`);
    assert.ok(!slugs(2018, s).includes("reformationstag"), `${s} 2018`);
  }
  // Osten durchgehend.
  for (const s of ["BB", "MV", "SN", "ST", "TH"] as StateCode[]) assert.ok(slugs(2015, s).includes("reformationstag"), `${s} 2015`);
  assert.equal(count(2017, "BE"), 10);
  assert.equal(count(2016, "HH"), 9);
});

test("Historie Frauentag (BE 2019, MV 2023) und Weltkindertag (TH 2019)", () => {
  assert.ok(!slugs(2018, "BE").includes("internationaler-frauentag"));
  assert.ok(slugs(2019, "BE").includes("internationaler-frauentag"));
  assert.ok(!slugs(2022, "MV").includes("internationaler-frauentag"));
  assert.ok(slugs(2023, "MV").includes("internationaler-frauentag"));
  assert.ok(!slugs(2018, "TH").includes("weltkindertag"));
  assert.ok(slugs(2019, "TH").includes("weltkindertag"));
  assert.equal(count(2018, "TH"), 10);
  assert.equal(count(2019, "TH"), 11);
});

test("Berlin: einmalige Feiertage 8. Mai 2020, 8. Mai 2025, 17. Juni 2028", () => {
  const dates = (y: number, s: StateCode) => getFeiertage(y, s).map((h) => h.date);
  assert.ok(dates(2020, "BE").includes("2020-05-08"));
  assert.ok(dates(2025, "BE").includes("2025-05-08"));
  assert.ok(dates(2028, "BE").includes("2028-06-17"));
  for (const y of [2019, 2021, 2024, 2026, 2027]) assert.ok(!dates(y, "BE").includes(`${y}-05-08`), `BE ${y}`);
  for (const y of [2026, 2027, 2029]) assert.ok(!dates(y, "BE").includes(`${y}-06-17`), `BE ${y}`);
  // Nur Berlin.
  for (const s of STATE_CODES) {
    if (s === "BE") continue;
    assert.ok(!dates(2025, s).includes("2025-05-08"), `${s} 2025`);
    assert.ok(!dates(2028, s).includes("2028-06-17"), `${s} 2028`);
  }
  assert.ok(workFreeHolidaySet(2025, "BE").has("2025-05-08"));
  assert.equal(count(2025, "BE"), 11);
  assert.equal(count(2020, "BE"), 11);
  for (const h of getAllFeiertage(2028).filter((x) => x.date === "2028-06-17")) assert.ok(h.note);
});

test("Jedes Datum liegt im abgefragten Jahr und ist eindeutig pro Land", () => {
  for (const y of [2015, 2017, 2020, 2026, 2027, 2028, 2035]) {
    for (const s of STATE_CODES) {
      const list = getFeiertage(y, s);
      const seen = new Set<string>();
      for (const h of list) {
        assert.ok(h.date.startsWith(`${y}-`), `${s} ${y}: ${h.slug} ${h.date}`);
        const k = `${h.date}|${h.slug}|${h.scope}`;
        assert.ok(!seen.has(k), `${s} ${y}: doppelt ${k}`);
        seen.add(k);
      }
    }
  }
});
