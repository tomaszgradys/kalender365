import test from "node:test";
import assert from "node:assert/strict";
import { ferienInRange, ferienNachTyp, regionaleFeiertageInRange, mondphasenInRange, sonneInWoche } from "../src/lib/de/kwInfo.ts";

test("KW 43/2026 (19.–25.10.): Herbstferien in mehreren Ländern, Berlin dabei", () => {
  const f = ferienInRange("2026-10-19", "2026-10-25");
  assert.ok(f.length >= 5, "zu wenige Ferienländer");
  assert.ok(f.some((x) => x.code === "BE" && x.typ === "herbstferien"));
  const g = ferienNachTyp(f);
  assert.ok(g.some((x) => x.typ === "herbstferien"));
});

test("KW 44/2026 (26.10.–1.11.): Reformationstag (regional, 31.10.) und Allerheiligen (1.11.) sind regionale Feiertage", () => {
  const r = regionaleFeiertageInRange("2026-10-26", "2026-11-01");
  assert.ok(r.some((h) => h.slug === "reformationstag" && h.date === "2026-10-31"));
  assert.ok(r.some((h) => h.slug === "allerheiligen" && h.date === "2026-11-01"));
  assert.ok(!r.some((h) => h.scope === "national"));
});

test("Jahreswechsel-KW 53/2026 (28.12.2026–3.1.2027) liefert Ferien aus beiden Jahren ohne Dubletten", () => {
  const f = ferienInRange("2026-12-28", "2027-01-03");
  const keys = f.map((x) => `${x.code}|${x.typ}|${x.start}`);
  assert.equal(new Set(keys).size, keys.length);
  assert.ok(f.some((x) => x.typ === "weihnachtsferien"));
});

test("Mondphasen und Sonne: KW 44/2026 hat den Vollmond vom 26.10., Tageslänge nimmt im Oktober ab", () => {
  const m = mondphasenInRange("2026-10-26", "2026-11-01");
  assert.ok(m.some((x) => x.type === "full" && x.date === "2026-10-26"), JSON.stringify(m));
  assert.equal(mondphasenInRange("2026-10-19", "2026-10-25").length, 0);
  const s = sonneInWoche("2026-10-19", "2026-10-25");
  assert.equal(s.ort, "Berlin");
  assert.ok(s.deltaMinuten < 0);
  assert.match(s.montag.sunrise ?? "", /^\d{2}:\d{2}$/);
});
