import { test } from "node:test";
import assert from "node:assert/strict";
import { getSchulferien, isSchulferienIndexable, getFerienByTyp, statesWithData } from "../src/lib/de/schulferien.ts";
import { STATE_CODES } from "../src/lib/de/bundeslaender.ts";

test("All 16 Bundesländer have data for 2026 and 2027", () => {
  assert.equal(statesWithData(2026).length, 16);
  assert.equal(statesWithData(2027).length, 16);
});

test("Anchor dates: Bayern & NRW Sommerferien 2026", () => {
  const by = getFerienByTyp(2026, "BY", "sommerferien")!;
  assert.equal(by.start, "2026-08-03");
  assert.equal(by.end, "2026-09-14");
  const nw = getFerienByTyp(2026, "NW", "sommerferien")!;
  assert.equal(nw.start, "2026-07-20");
  assert.equal(nw.end, "2026-09-01");
});

test("Weihnachtsferien roll over into the next year", () => {
  const bw = getFerienByTyp(2026, "BW", "weihnachtsferien")!;
  assert.equal(bw.start, "2026-12-23");
  assert.equal(bw.end, "2027-01-09");
});

test("Single-day (bewegliche) Ferientage: start === end with note", () => {
  const nw = getFerienByTyp(2026, "NW", "pfingstferien")!;
  assert.equal(nw.start, "2026-05-26");
  assert.equal(nw.end, "2026-05-26");
  assert.ok(nw.note);
});

test("Every period is a valid, ordered ISO range", () => {
  for (const y of [2026, 2027]) {
    for (const s of STATE_CODES) {
      const rec = getSchulferien(y, s);
      assert.ok(rec, `${y}/${s} missing`);
      for (const p of rec!.periods) {
        assert.match(p.start, /^\d{4}-\d{2}-\d{2}$/);
        assert.match(p.end, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(p.start <= p.end, `${y}/${s} ${p.typ}: ${p.start} > ${p.end}`);
      }
    }
  }
});

test("Records are now indexable (verified) and carry source metadata", () => {
  assert.equal(isSchulferienIndexable(2026, "BY"), true);
  assert.equal(isSchulferienIndexable(2027, "NW"), true);
  const rec = getSchulferien(2026, "BY")!;
  assert.ok(rec.meta.sourceUrl.startsWith("https://"));
  assert.ok(rec.meta.lastVerifiedAt);
});
