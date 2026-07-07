/* eslint-disable jsx-a11y/alt-text */
// PDF-Kalender (deutsch) mit @react-pdf/renderer. Standardschrift Helvetica
// deckt Umlaute (äöüß) ab. Monats- und Jahreskalender, optional je Bundesland.

import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { MONTH_NAMES_DE, WEEKDAY_SHORT_DE } from "./locale";
import { monthView, monthMatrix } from "./calendar";
import { getFeiertage } from "./feiertage";
import type { StateCode } from "./bundeslaender";

const NAVY = "#003890";
const GREEN = "#00b978";
const GREY = "#94a3b8";
const LIGHT = "#e2e8f0";

const s = StyleSheet.create({
  page: { padding: 32, fontSize: 10, color: "#0f172a", fontFamily: "Helvetica" },
  h1: { fontSize: 20, fontFamily: "Helvetica-Bold", color: NAVY },
  sub: { fontSize: 10, color: GREY, marginTop: 2, marginBottom: 12 },
  row: { flexDirection: "row" },
  headCell: { flex: 1, textAlign: "center", fontFamily: "Helvetica-Bold", color: GREY, paddingVertical: 4, fontSize: 9 },
  kwHead: { width: 26, textAlign: "center", fontFamily: "Helvetica-Bold", color: GREY, paddingVertical: 4, fontSize: 8 },
  cell: { flex: 1, textAlign: "center", paddingVertical: 6, borderWidth: 0.5, borderColor: LIGHT },
  kwCell: { width: 26, textAlign: "center", paddingVertical: 6, borderWidth: 0.5, borderColor: LIGHT, color: GREY, fontSize: 8 },
  footer: { position: "absolute", bottom: 20, left: 32, right: 32, textAlign: "center", color: GREY, fontSize: 8 },
});

function MonthGrid({ year, month0, state }: { year: number; month0: number; state?: StateCode }) {
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
            <Text
              key={j}
              style={[
                s.cell,
                d.holiday ? { color: GREEN, fontFamily: "Helvetica-Bold" } : d.weekend ? { color: GREY } : {},
              ]}
            >
              {d.day === 0 ? "" : d.day}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );
}

export function MonthDoc({ year, month0, state }: { year: number; month0: number; state?: { code: StateCode; name: string } }) {
  const feiertage = getFeiertage(year, state?.code ?? "BY", { includePartial: false });
  const monthHolidays = state
    ? feiertage.filter((h) => h.date.startsWith(`${year}-${String(month0 + 1).padStart(2, "0")}-`))
    : [];
  return (
    <Document title={`Kalender ${MONTH_NAMES_DE[month0]} ${year}`}>
      <Page size="A4" style={s.page}>
        <Text style={s.h1}>{MONTH_NAMES_DE[month0]} {year}</Text>
        <Text style={s.sub}>{state ? `Bundesland: ${state.name}` : "Deutschland"}</Text>
        <MonthGrid year={year} month0={month0} state={state?.code} />
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
        <Text style={s.footer} render={() => "Kalender365.pro"} fixed />
      </Page>
    </Document>
  );
}

export function YearDoc({ year, state }: { year: number; state?: { code: StateCode; name: string } }) {
  return (
    <Document title={`Kalender ${year}`}>
      <Page size="A4" orientation="landscape" style={s.page}>
        <Text style={s.h1}>Kalender {year}</Text>
        <Text style={s.sub}>{state ? `Bundesland: ${state.name}` : "Deutschland"}</Text>
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
                          d.holiday ? { color: GREEN, fontFamily: "Helvetica-Bold" } : d.weekend ? { color: GREY } : {},
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
        <Text style={s.footer} render={() => "Kalender365.pro"} fixed />
      </Page>
    </Document>
  );
}
