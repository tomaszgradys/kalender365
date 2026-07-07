import { test } from "node:test";
import assert from "node:assert/strict";
import { getZodiacDE } from "../src/lib/de/zodiac.ts";
import { getNamenstage } from "../src/lib/de/namenstage.ts";
import { getMoonPhaseDE, getMoonrise } from "../src/lib/de/moon.ts";
import { getBauernregel } from "../src/lib/de/bauernregeln.ts";

test("Zodiac boundaries (German names)", () => {
  assert.equal(getZodiacDE(6, 7).name, "Krebs"); // 7 July
  assert.equal(getZodiacDE(0, 1).name, "Steinbock"); // 1 Jan
  assert.equal(getZodiacDE(11, 25).name, "Steinbock"); // 25 Dec
  assert.equal(getZodiacDE(2, 25).name, "Widder"); // 25 Mar
});

test("Namenstage: known day returns names, unknown day is empty", () => {
  assert.deepEqual(getNamenstage(11, 6), ["Nikolaus"]); // 6 Dec
  assert.equal(getNamenstage(6, 7).length, 0); // 7 Jul not in the curated set
});

test("Continuous moon phase returns a German label + icon", () => {
  const p = getMoonPhaseDE(new Date(Date.UTC(2026, 6, 7, 12)));
  assert.ok(p.icon.length > 0);
  assert.match(p.label, /Mond|Viertel|Sichel/);
});

test("Moonrise is a HH:MM time (or null on a skipped-rise day)", () => {
  const r = getMoonrise(2026, 6, 10);
  assert.match(r!, /^\d{2}:\d{2}$/);
  // 2026-07-07: the moon has no rise during the local day → null.
  assert.equal(getMoonrise(2026, 6, 7), null);
});

test("Bauernregel: dated rule wins, otherwise a non-empty rotation", () => {
  assert.match(getBauernregel(5, 27), /Siebenschläfer/); // 27 June
  assert.ok(getBauernregel(3, 3).length > 0); // arbitrary day → pool
});
