/* eslint-disable jsx-a11y/alt-text */
// PDF-Kalender (deutsch) mit @react-pdf/renderer. Standardschrift Helvetica
// deckt Umlaute (äöüß) ab. Monats- und Jahreskalender, optional je Bundesland,
// mit Farblegende, Logo und QR-Code (Deep-Link zurück zur passenden Seite).

import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import { MONTH_NAMES_DE, WEEKDAY_SHORT_DE } from "./locale";
import { monthView, monthMatrix } from "./calendar";
import { getFeiertage } from "./feiertage";
import { getSchulferien } from "./schulferien";
import { SITE_URL } from "./site";
import type { StateCode } from "./bundeslaender";

const NAVY = "#003890";
const GREEN = "#00b978";
const GREEN_BG = "#dcfce7";
const AMBER_BG = "#fef3c7";
const AMBER = "#b45309";
const GREY = "#94a3b8";
const LIGHT = "#e2e8f0";

const LOGO_URL = `${SITE_URL}/brand/png/web/mark-calendar-color-256.png`;

const s = StyleSheet.create({
  page: { padding: 32, paddingBottom: 60, fontSize: 10, color: "#0f172a", fontFamily: "Helvetica" },
  h1: { fontSize: 20, fontFamily: "Helvetica-Bold", color: NAVY },
  sub: { fontSize: 10, color: GREY, marginTop: 2, marginBottom: 12 },
  row: { flexDirection: "row" },
  headCell: { flex: 1, textAlign: "center", fontFamily: "Helvetica-Bold", color: GREY, paddingVertical: 4, fontSize: 9 },
  kwHead: { width: 26, textAlign: "center", fontFamily: "Helvetica-Bold", color: GREY, paddingVertical: 4, fontSize: 8 },
  cell: { flex: 1, textAlign: "center", paddingVertical: 6, borderWidth: 0.5, borderColor: LIGHT },
  kwCell: { width: 26, textAlign: "center", paddingVertical: 6, borderWidth: 0.5, borderColor: LIGHT, color: GREY, fontSize: 8 },
  // Farblegende
  legend: { flexDirection: "row", flexWrap: "wrap", marginTop: 14 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 16 },
  swatch: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  legendText: { fontSize: 8, color: GREY },
  // Fußzeile mit Logo + QR
  footer: { position: "absolute", left: 32, right: 32, bottom: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footLeft: { flexDirection: "row", alignItems: "center" },
  footLogo: { width: 16, height: 16, marginRight: 6 },
  footText: { fontSize: 8, color: GREY },
  qrBox: { alignItems: "center" },
  qr: { width: 40, height: 40 },
  qrCap: { fontSize: 6, color: GREY, marginTop: 1 },
});

/** ISO dates inside any school-holiday period of a Bundesland (empty without state). */
function ferienSet(year: number, state?: StateCode): Set<string> {
  const set = new Set<string>();
  if (!state) return set;
  const rec = getSchulferien(year, state);
  if (!rec) return set;
  for (const p of rec.periods) {
    for (let t = Date.parse(`${p.start}T00:00:00Z`); t <= Date.parse(`${p.end}T00:00:00Z`); t += 86400000) {
      set.add(new Date(t).toISOString().slice(0, 10));
    }
  }
  return set;
}

function Legend({ withFerien }: { withFerien: boolean }) {
  return (
    <View style={s.legend}>
      <View style={s.legendItem}>
        <View style={[s.swatch, { backgroundColor: GREEN_BG }]} />
        <Text style={s.legendText}>Feiertag</Text>
      </View>
      <View style={s.legendItem}>
        <View style={[s.swatch, { backgroundColor: LIGHT }]} />
        <Text style={s.legendText}>Wochenende</Text>
      </View>
      {withFerien && (
        <View style={s.legendItem}>
          <View style={[s.swatch, { backgroundColor: AMBER_BG }]} />
          <Text style={s.legendText}>Schulferien</Text>
        </View>
      )}
    </View>
  );
}

function Footer({ qr }: { qr?: string }) {
  return (
    <View style={s.footer} fixed>
      <View style={s.footLeft}>
        <Image src={LOGO_URL} style={s.footLogo} />
        <Text style={s.footText}>erstellt auf Kalender365.pro</Text>
      </View>
      {qr && (
        <View style={s.qrBox}>
          <Image src={qr} style={s.qr} />
          <Text style={s.qrCap}>kalender365.pro</Text>
        </View>
      )}
    </View>
  );
}

function dayStyle(d: { day: number; weekend: boolean; holiday: boolean; iso: string }, ferien: Set<string>) {
  if (d.holiday) return { backgroundColor: GREEN_BG, color: GREEN, fontFamily: "Helvetica-Bold" as const };
  if (ferien.has(d.iso)) return { backgroundColor: AMBER_BG, color: AMBER };
  if (d.weekend) return { color: GREY };
  return {};
}

function MonthGrid({ year, month0, state, ferien }: { year: number; month0: number; state?: StateCode; ferien: Set<string> }) {
  const weeks = monthView(year, month0, state);
  return (
    <View>
      <View style={s.row}>
        <Text style={s.kwHead}>KW</Text>
        {WEEKDAY_SHORT_DE.map((w) => (
          <Text key={w} style={s.headCell}>{w}</Text>
        ))}
      </View>
      {weeks.map((wk) => (
        <View key={wk.kw} style={s.row}>
          <Text style={s.kwCell}>{wk.kw}</Text>
          {wk.days.map((d, j) => (
            <Text key={j} style={[s.cell, dayStyle(d, ferien)]}>{d.day === 0 ? "" : d.day}</Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function MonthDoc({ year, month0, state, qr }: { year: number; month0: number; state?: { code: StateCode; name: string }; qr?: string }) {
  const ferien = ferienSet(year, state?.code);
  const feiertage = getFeiertage(year, state?.code ?? "BY", { includePartial: false });
  const monthHolidays = state
    ? feiertage.filter((h) => h.date.startsWith(`${year}-${String(month0 + 1).padStart(2, "0")}-`))
    : [];
  return (
    <Document title={`Kalender ${MONTH_NAMES_DE[month0]} ${year}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>{MONTH_NAMES_DE[month0]} {year}</Text>
        <Text style={s.sub}>{state ? `Bundesland: ${state.name}` : "Deutschland"}</Text>
        <MonthGrid year={year} month0={month0} state={state?.code} ferien={ferien} />
        <Legend withFerien={!!state && ferien.size > 0} />
        {state && monthHolidays.length > 0 && (
          <View style={{ marginTop: 12 }}>
            <Text style={{ fontFamily: "Helvetica-Bold", color: NAVY, marginBottom: 4 }}>Feiertage</Text>
            {monthHolidays.map((h) => (
              <Text key={h.slug} style={{ marginBottom: 2 }}>
                {h.date.slice(8)}.{h.date.slice(5, 7)}. — {h.name}
              </Text>
            ))}
          </View>
        )}
        <Footer qr={qr} />
      </Page>
    </Document>
  );
}

export function YearDoc({ year, state, qr }: { year: number; state?: { code: StateCode; name: string }; qr?: string }) {
  const ferien = ferienSet(year, state?.code);
  return (
    <Document title={`Kalender ${year}`}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <Text style={s.h1}>Kalender {year}{state ? ` – ${state.name}` : ""}</Text>
        <Text style={s.sub}>{state ? `Bundesland: ${state.name}` : "Deutschland"} · alle 12 Monate auf einer Seite</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {MONTH_NAMES_DE.map((name, m) => {
            const weeks = monthMatrix(year, m, state?.code);
            return (
              <View key={m} style={{ width: "25%", padding: 4 }}>
                <Text style={{ fontFamily: "Helvetica-Bold", color: NAVY, fontSize: 9, marginBottom: 2 }}>{name}</Text>
                <View style={s.row}>
                  {WEEKDAY_SHORT_DE.map((w) => (
                    <Text key={w} style={{ flex: 1, textAlign: "center", fontSize: 6, color: GREY }}>{w}</Text>
                  ))}
                </View>
                {weeks.map((wk, i) => (
                  <View key={i} style={s.row}>
                    {wk.map((d, j) => (
                      <Text
                        key={j}
                        style={[
                          { flex: 1, textAlign: "center", fontSize: 6, paddingVertical: 1 },
                          dayStyle(d, ferien),
                        ]}
                      >
                        {d.day === 0 ? "" : d.day}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          })}
        </View>
        <Legend withFerien={!!state && ferien.size > 0} />
        <Footer qr={qr} />
      </Page>
    </Document>
  );
}
