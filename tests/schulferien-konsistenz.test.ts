import { test } from "node:test";
import assert from "node:assert/strict";
import { getSchulferien, isSchulferienIndexable, getFerienByTyp, statesWithData } from "../src/lib/de/schulferien.ts";
import { STATE_CODES } from "../src/lib/de/bundeslaender.ts";

// Referenz: KMK-Ferienkalender FER2025_26, FER2026_27, FER2027_28, FER2028_29
// (Stand 09.10.2025), https://www.kmk.org/service/ferienregelung/ferienkalender.html
// Lokale Kopien: Claude/kalender365-recovery/dane/kmk/. Geprüft 2026-10-22.

const YEARS = [2026, 2027, 2028];
const dayMs = 86400000;
const t = (iso: string) => Date.parse(iso + "T00:00:00Z");

test("Alle 16 Länder haben Daten für 2026, 2027 und 2028; 2029 nicht", () => {
  for (const y of YEARS) assert.equal(statesWithData(y).length, 16, `Jahr ${y}`);
  assert.equal(statesWithData(2029).length, 0);
  assert.equal(getSchulferien(2029, "BY"), null);
});

test("Jede Periode: start ≤ ende, keine Überlappung innerhalb eines Landes/Jahres", () => {
  for (const y of YEARS) {
    for (const s of STATE_CODES) {
      const rec = getSchulferien(y, s)!;
      assert.ok(rec, `${y}/${s} fehlt`);
      const sorted = [...rec.periods].sort((a, b) => a.start.localeCompare(b.start));
      for (let i = 0; i < sorted.length; i++) {
        const p = sorted[i];
        assert.match(p.start, /^\d{4}-\d{2}-\d{2}$/);
        assert.match(p.end, /^\d{4}-\d{2}-\d{2}$/);
        assert.ok(!Number.isNaN(t(p.start)) && !Number.isNaN(t(p.end)), `${y}/${s} ${p.typ}: ungültiges Datum`);
        assert.ok(p.start <= p.end, `${y}/${s} ${p.typ}: ${p.start} > ${p.end}`);
        if (i > 0) {
          const prev = sorted[i - 1];
          assert.ok(prev.end < p.start, `${y}/${s}: ${prev.typ} ${prev.end} überlappt ${p.typ} ${p.start}`);
        }
        // Alle Termine (außer Weihnachtsende) liegen im Kalenderjahr.
        assert.ok(p.start.startsWith(`${y}-`), `${y}/${s} ${p.typ}: Start ${p.start} außerhalb des Jahres`);
      }
    }
  }
});

test("Weihnachtsferien: Beginn im Dezember, Ende im Dezember oder im Januar des Folgejahres", () => {
  for (const y of YEARS) {
    for (const s of STATE_CODES) {
      const x = getFerienByTyp(y, s, "weihnachtsferien");
      assert.ok(x, `${y}/${s}: keine Weihnachtsferien`);
      assert.ok(x!.start.startsWith(`${y}-12-`), `${y}/${s}: Start ${x!.start}`);
      assert.ok(x!.end.startsWith(`${y}-12-`) || x!.end.startsWith(`${y + 1}-01-`), `${y}/${s}: Ende ${x!.end}`);
      // Heiligabend bis 2. Weihnachtstag immer frei.
      assert.ok(x!.start <= `${y}-12-24` || x!.start === `${y}-12-27`, `${y}/${s}: Start ${x!.start}`);
      assert.ok(x!.end >= `${y}-12-29`, `${y}/${s}: Ende ${x!.end}`);
    }
  }
});

test("Sommerferien: genau eine Periode, 6 Wochen (±2 Tage), zwischen Mitte Juni und Mitte September", () => {
  for (const y of YEARS) {
    for (const s of STATE_CODES) {
      const rec = getSchulferien(y, s)!;
      const sommer = rec.periods.filter((p) => p.typ === "sommerferien");
      assert.equal(sommer.length, 1, `${y}/${s}: ${sommer.length} Sommerferien-Einträge`);
      const [p] = sommer;
      const len = (t(p.end) - t(p.start)) / dayMs + 1;
      assert.ok(len >= 40 && len <= 46, `${y}/${s}: Sommerferien ${len} Tage`);
      assert.ok(p.start >= `${y}-06-15` && p.end <= `${y}-09-15`, `${y}/${s}: ${p.start}–${p.end}`);
    }
  }
});

test("Einzelne Ferientage tragen die Notiz „beweglicher Ferientag“", () => {
  for (const y of YEARS) {
    for (const s of STATE_CODES) {
      for (const p of getSchulferien(y, s)!.periods) {
        if (p.start === p.end) assert.ok(p.note, `${y}/${s} ${p.typ} ${p.start}: ohne Notiz`);
        else assert.equal(p.note, undefined);
      }
    }
  }
});

test("Ankerdaten 2028 aus den KMK-PDFs FER2027_28 / FER2028_29", () => {
  const by = getFerienByTyp(2028, "BY", "sommerferien")!;
  assert.equal(by.start, "2028-07-31");
  assert.equal(by.end, "2028-09-11");
  const sh = getFerienByTyp(2028, "SH", "sommerferien")!;
  assert.equal(sh.start, "2028-06-24");
  assert.equal(sh.end, "2028-08-04");
  const nw = getFerienByTyp(2028, "NW", "herbstferien")!;
  assert.equal(nw.start, "2028-10-23");
  assert.equal(nw.end, "2028-11-04");
  const be = getFerienByTyp(2028, "BE", "herbstferien")!;
  assert.equal(be.start, "2028-10-02");
  assert.equal(be.end, "2028-10-14");
  const hb = getFerienByTyp(2028, "HB", "weihnachtsferien")!;
  assert.equal(hb.start, "2028-12-27");
  assert.equal(hb.end, "2029-01-06");
  const hh = getFerienByTyp(2028, "HH", "winterferien")!;
  assert.equal(hh.start, "2028-01-28");
  assert.equal(hh.end, "2028-01-28");
  const bwOstern = getSchulferien(2028, "BW")!.periods.filter((p) => p.typ === "osterferien");
  assert.deepEqual(bwOstern.map((p) => [p.start, p.end]), [["2028-04-13", "2028-04-13"], ["2028-04-18", "2028-04-22"]]);
  // Länder ohne Winter-/Pfingstferien 2028.
  assert.equal(getFerienByTyp(2028, "BW", "winterferien"), null);
  assert.equal(getFerienByTyp(2028, "HE", "pfingstferien"), null);
  assert.equal(getFerienByTyp(2028, "SH", "winterferien"), null);
});

test("Indexierbarkeit folgt dem Verifizierungsstand (lastVerifiedAt je Jahr)", () => {
  for (const y of YEARS) {
    for (const s of STATE_CODES) {
      assert.equal(isSchulferienIndexable(y, s), true, `${y}/${s}`);
      const m = getSchulferien(y, s)!.meta;
      assert.ok(m.lastVerifiedAt && /^\d{4}-\d{2}-\d{2}$/.test(m.lastVerifiedAt));
      assert.ok(m.retrievedAt);
      assert.ok(m.source.includes("KMK"));
    }
  }
  assert.equal(getSchulferien(2026, "BY")!.meta.lastVerifiedAt, "2026-07-09");
  assert.equal(getSchulferien(2028, "BY")!.meta.lastVerifiedAt, "2026-10-22");
  assert.ok(getSchulferien(2028, "BY")!.meta.source.includes("FER2028_29"));
  assert.equal(isSchulferienIndexable(2029, "BY"), false);
});
