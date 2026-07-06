import { test } from "node:test";
import assert from "node:assert/strict";
import {
  easterSunday,
  bussUndBettag,
  getAllFeiertage,
  getFeiertage,
  getNationalFeiertage,
  workFreeHolidaySet,
} from "../src/lib/de/feiertage.ts";
import { isoWeeksInYear } from "../src/lib/de/weeks.ts";

const isoOf = (d: Date) => d.toISOString().slice(0, 10);

test("Easter Sunday 2026 and 2027 (Meeus/Jones/Butcher)", () => {
  assert.equal(isoOf(easterSunday(2026)), "2026-04-05");
  assert.equal(isoOf(easterSunday(2027)), "2027-03-28");
});

test("ISO week count: 2026 has 53 weeks, 2027 has 52", () => {
  assert.equal(isoWeeksInYear(2026), 53);
  assert.equal(isoWeeksInYear(2027), 52);
});

test("Buß- und Bettag is the Wednesday before 23 November", () => {
  // 2026-11-23 is a Monday → Wednesday before is 2026-11-18.
  assert.equal(isoOf(bussUndBettag(2026)), "2026-11-18");
  assert.equal(new Date(isoOf(bussUndBettag(2026)) + "T00:00:00Z").getUTCDay(), 3);
  // 2027-11-23 is a Tuesday → Wednesday before is 2027-11-17.
  assert.equal(isoOf(bussUndBettag(2027)), "2027-11-17");
});

test("Nationwide baseline: exactly 9 national holidays", () => {
  const nat = getNationalFeiertage(2026);
  assert.equal(nat.length, 9);
  const slugs = nat.map((h) => h.slug).sort();
  assert.deepEqual(slugs, [
    "1-weihnachtsfeiertag",
    "2-weihnachtsfeiertag",
    "christi-himmelfahrt",
    "karfreitag",
    "neujahr",
    "ostermontag",
    "pfingstmontag",
    "tag-der-arbeit",
    "tag-der-deutschen-einheit",
  ]);
});

test("Bayern 2026: 13 statutory work-free days incl. Fronleichnam & Allerheiligen", () => {
  const by = getFeiertage(2026, "BY", { includePartial: false });
  const slugs = by.map((h) => h.slug);
  assert.ok(slugs.includes("heilige-drei-koenige"));
  assert.ok(slugs.includes("fronleichnam"));
  assert.ok(slugs.includes("allerheiligen"));
  // 9 national + Heilige Drei Könige + Fronleichnam + Allerheiligen = 12 certain state-wide.
  assert.equal(by.length, 12);
  // Mariä Himmelfahrt in BY is partial (not counted unless includePartial).
  const withPartial = getFeiertage(2026, "BY", { includePartial: true }).map((h) => h.slug);
  assert.ok(withPartial.includes("mariae-himmelfahrt"));
});

test("Berlin 2026: Internationaler Frauentag applies (since 2019)", () => {
  const be = getFeiertage(2026, "BE").map((h) => h.slug);
  assert.ok(be.includes("internationaler-frauentag"));
  // Berlin has no Fronleichnam / Reformationstag.
  assert.ok(!be.includes("fronleichnam"));
  assert.ok(!be.includes("reformationstag"));
});

test("MV 2026: Frauentag applies (since 2023) and Reformationstag", () => {
  const mv = getFeiertage(2026, "MV").map((h) => h.slug);
  assert.ok(mv.includes("internationaler-frauentag"));
  assert.ok(mv.includes("reformationstag"));
});
test("MV 2022: Frauentag does NOT yet apply", () => {
  const mv = getFeiertage(2022, "MV").map((h) => h.slug);
  assert.ok(!mv.includes("internationaler-frauentag"));
});

test("NRW 2026: Fronleichnam & Allerheiligen, no Reformationstag", () => {
  const nw = getFeiertage(2026, "NW").map((h) => h.slug);
  assert.ok(nw.includes("fronleichnam"));
  assert.ok(nw.includes("allerheiligen"));
  assert.ok(!nw.includes("reformationstag"));
});

test("Sachsen 2026: Buß- und Bettag (state) + Fronleichnam only partial", () => {
  const sn = getFeiertage(2026, "SN", { includePartial: false }).map((h) => h.slug);
  assert.ok(sn.includes("buss-und-bettag"));
  assert.ok(sn.includes("reformationstag"));
  assert.ok(!sn.includes("fronleichnam")); // partial only, excluded
  const snPartial = getFeiertage(2026, "SN", { includePartial: true }).map((h) => h.slug);
  assert.ok(snPartial.includes("fronleichnam"));
});

test("Thüringen 2026: Weltkindertag + Reformationstag; Fronleichnam partial", () => {
  const th = getFeiertage(2026, "TH", { includePartial: false }).map((h) => h.slug);
  assert.ok(th.includes("weltkindertag"));
  assert.ok(th.includes("reformationstag"));
  assert.ok(!th.includes("fronleichnam"));
});

test("Saarland 2026: Mariä Himmelfahrt is full statutory (not partial)", () => {
  const sl = getFeiertage(2026, "SL", { includePartial: false });
  const mh = sl.find((h) => h.slug === "mariae-himmelfahrt");
  assert.ok(mh);
  assert.equal(mh!.scope, "state");
});

test("Brandenburg 2026: Oster-/Pfingstsonntag are sunday-legal (fall on Sunday)", () => {
  const bb = getFeiertage(2026, "BB", { includeSundayLegal: true });
  const os = bb.find((h) => h.slug === "ostersonntag");
  const ps = bb.find((h) => h.slug === "pfingstsonntag");
  assert.ok(os && os.scope === "sunday-legal");
  assert.ok(ps && ps.scope === "sunday-legal");
  // both must be Sundays
  for (const h of [os!, ps!]) {
    assert.equal(new Date(h.date + "T00:00:00Z").getUTCDay(), 0);
  }
  // and they must NOT be in the work-free set (never reduce Arbeitstage).
  const wf = workFreeHolidaySet(2026, "BB");
  assert.ok(!wf.has(os!.date));
  assert.ok(!wf.has(ps!.date));
});

test("workFreeHolidaySet excludes partial and sunday-legal", () => {
  const by = workFreeHolidaySet(2026, "BY");
  // Augsburger Friedensfest (08-08, partial) must not be in the state set.
  assert.ok(!by.has("2026-08-08"));
  // Mariä Himmelfahrt (partial in BY) must not be in the set.
  assert.ok(!by.has("2026-08-15"));
});

test("getAllFeiertage is date-sorted", () => {
  const all = getAllFeiertage(2026);
  for (let i = 1; i < all.length; i++) {
    assert.ok(all[i - 1].date <= all[i].date);
  }
});
