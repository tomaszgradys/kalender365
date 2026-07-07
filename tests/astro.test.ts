import { test } from "node:test";
import assert from "node:assert/strict";
import { getMoonPhaseInstants } from "../src/lib/de/moonPhases.ts";
import { getSeasons, getDSTChanges } from "../src/lib/de/astroYear.ts";
import { getSunTimes } from "../src/lib/de/sun.ts";

test("Moon phases 2026: 13 full moons, 12 new moons, exactly 1 Blue Moon (2026-05-31)", () => {
  const all = getMoonPhaseInstants(2026);
  assert.equal(all.filter((p) => p.type === "full").length, 13);
  assert.equal(all.filter((p) => p.type === "new").length, 12);
  const blue = all.filter((p) => p.blueMoon);
  assert.equal(blue.length, 1);
  assert.equal(blue[0].date, "2026-05-31");
});

test("Every moon phase has a Berlin-local HH:MM time and a zodiac sign", () => {
  for (const p of getMoonPhaseInstants(2026)) {
    assert.match(p.time, /^\d{2}:\d{2}$/);
    assert.ok(p.zodiacSign.length > 0);
  }
});

test("DST 2026: last Sunday of March and October", () => {
  const [spring, autumn] = getDSTChanges(2026);
  assert.equal(spring.iso, "2026-03-29"); // last Sunday of March 2026
  assert.equal(autumn.iso, "2026-10-25"); // last Sunday of October 2026
  assert.match(new Date(spring.iso + "T00:00:00Z").getUTCDay().toString(), /^0$/); // Sunday
});

test("Seasons 2026 return four labelled entries", () => {
  const s = getSeasons(2026);
  assert.equal(s.length, 4);
  assert.deepEqual(s.map((x) => x.key), ["fruehling", "sommer", "herbst", "winter"]);
});

test("Sun times for Berlin in June are earlier/later than in December (longer day)", () => {
  const june = getSunTimes(2026, 5, 21); // ~summer solstice
  const dec = getSunTimes(2026, 11, 21); // ~winter solstice
  assert.ok(june.dayLengthMinutes > dec.dayLengthMinutes);
  assert.ok(june.dayLengthMinutes > 900); // >15h in June (Berlin)
  assert.ok(dec.dayLengthMinutes < 540); // <9h in December (Berlin)
});
