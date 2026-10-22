import { test } from "node:test";
import assert from "node:assert/strict";
import { yearSummary } from "../src/lib/de/calendar.ts";
import {
  arbeitstageInYear,
  werktageInYear,
  arbeitstageBetween,
  arbeitstageDetails,
} from "../src/lib/de/arbeitstage.ts";
import { getBrueckentage, getLangeWochenenden } from "../src/lib/de/brueckentage.ts";
import { getSchulferien, isSchulferienIndexable } from "../src/lib/de/schulferien.ts";

test("Arbeitstage differ by Bundesland (BY has more holidays than BE → fewer Arbeitstage)", () => {
  const by = arbeitstageInYear(2026, "BY");
  const be = arbeitstageInYear(2026, "BE");
  assert.ok(by < be, `expected BY(${by}) < BE(${be})`);
});

test("Werktage (6-day week) > Arbeitstage (5-day week) for the same state", () => {
  assert.ok(werktageInYear(2026, "NW") > arbeitstageInYear(2026, "NW"));
});

test("arbeitstageBetween is inclusive and skips weekends + holidays", () => {
  // 2026-01-01 (Neujahr, Thu) .. 2026-01-02 (Fri): only Jan 2 counts.
  assert.equal(arbeitstageBetween("2026-01-01", "2026-01-02", "BE"), 1);
  // A single Saturday counts as 0.
  assert.equal(arbeitstageBetween("2026-01-03", "2026-01-03", "BE"), 0);
});

test("No Polish Saturday-give-back rule: a holiday on Saturday does not add an Arbeitstag", () => {
  // Neujahr 2022-01-01 was a Saturday. Under PL rules that would grant a day
  // back; under German counting the year just has Sat as a normal weekend.
  const a = arbeitstageInYear(2022, "BE");
  // sanity: value in the plausible range for a 5-day week year (~250-255).
  assert.ok(a >= 248 && a <= 256, `unexpected Arbeitstage: ${a}`);
});

test("Brückentage are ranked by efficiency (best deal first)", () => {
  const b = getBrueckentage(2026, "BY");
  assert.ok(b.length > 0);
  for (let i = 1; i < b.length; i++) {
    assert.ok(b[i - 1].effizienz >= b[i].effizienz);
  }
  // Every bridge yields more free days than vacation days used.
  for (const x of b) assert.ok(x.freieTage > x.urlaubstage);
});

test("Lange Wochenenden are all >=3 consecutive free days", () => {
  const lw = getLangeWochenenden(2026, "NW");
  for (const w of lw) assert.ok(w.length >= 3);
});

test("Schulferien data is present and verified for seeded states", () => {
  assert.ok(getSchulferien(2026, "BY"));
  assert.equal(isSchulferienIndexable(2026, "BY"), true); // now seeded + verified
  assert.ok(getSchulferien(2026, "HE")); // all 16 states now seeded
  assert.equal(getSchulferien(2030, "BY"), null); // no data for far-future year
});

test("yearSummary: Feiertage zählt ALLE gesetzlichen Feiertage, nicht nur die an Werktagen", () => {
  const s = yearSummary(2027);
  assert.equal(s.feiertageCount, 9, "Deutschland hat 9 bundesweite Feiertage");
  assert.ok(s.feiertageAnWerktagen <= s.feiertageCount);
  const by = yearSummary(2027, "BY");
  assert.ok(by.feiertageCount >= 12, "Bayern ≥ 12 arbeitsfreie Feiertage");
});

test("arbeitstageDetails 2027 Bayern: 253 Arbeitstage, Werktage = Arbeitstage + Samstage ohne Sa-Feiertage, Feiertagsliste mit Namen", () => {
  const d = arbeitstageDetails("2027-01-01", "2027-12-31", "BY");
  assert.equal(d.kalendertage, 365);
  assert.equal(d.arbeitstage5, 253);
  assert.equal(d.arbeitstage6, d.arbeitstage5 + d.samstage - d.feiertageSa.length);
  assert.ok(d.feiertageMoFr.some((h) => h.name === "Fronleichnam"));
  // 1. Mai 2027 ist ein Samstag → nur bei 6-Tage-Woche abgezogen.
  assert.ok(d.feiertageSa.some((h) => h.date === "2027-05-01"));
  assert.ok(!d.feiertageMoFr.some((h) => h.date === "2027-05-01"));
  // 3. Oktober 2027 ist ein Sonntag → informativ.
  assert.ok(d.feiertageSo.some((h) => h.date === "2027-10-03"));
});

test("arbeitstageDetails: ungültiger oder leerer Zeitraum liefert Nullen", () => {
  const d = arbeitstageDetails("2027-02-01", "2027-01-01", "BE");
  assert.equal(d.kalendertage, 0);
  assert.equal(d.arbeitstage5, 0);
});
