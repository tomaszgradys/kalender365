import { Document, Page, View, Text, Image, StyleSheet, Font } from "@react-pdf/renderer";
import type { MonthData } from "./calendar";
import type { Locale } from "./months";
import { MONTH_NAMES, WEEKDAY_SHORT } from "./months";
import { SITE_URL } from "./site";

let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  Font.register({
    family: "DejaVu",
    fonts: [
      { src: `${SITE_URL}/fonts/DejaVuSans.ttf` },
      { src: `${SITE_URL}/fonts/DejaVuSans-Bold.ttf`, fontWeight: "bold" },
    ],
  });
  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: { padding: 32, paddingBottom: 60, fontFamily: "DejaVu", color: "#0f172a" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 2, color: "#003890" },
  subtitle: { fontSize: 10, color: "#64748b", marginBottom: 16 },
  headRow: { flexDirection: "row", borderBottom: "1 solid #cbd5e1", paddingBottom: 6, marginBottom: 4 },
  weekCol: { width: "10%", fontSize: 8, color: "#94a3b8" },
  dayColHead: { width: "12.857%", fontSize: 9, fontWeight: "bold", color: "#475569", textAlign: "center" },
  row: { flexDirection: "row", borderBottom: "0.5 solid #e2e8f0", paddingVertical: 8, alignItems: "flex-start" },
  weekCell: { width: "10%", fontSize: 8, color: "#94a3b8", paddingTop: 2 },
  dayCell: { width: "12.857%", alignItems: "center", paddingVertical: 2, borderRadius: 3 },
  dayCellBreak: { backgroundColor: "#fef3c7" }, // wolne od szkoły (bursztynowy)
  dayNumber: { fontSize: 11, color: "#1e293b" },
  dayNumberMuted: { fontSize: 11, color: "#cbd5e1" },
  dayNumberHoliday: { fontSize: 11, color: "#e11d48", fontWeight: "bold" },
  dayNumberSunday: { fontSize: 11, color: "#e11d48" },
  dayNumberSaturday: { fontSize: 11, color: "#fb7185" },
  holidayLabel: { fontSize: 5.5, color: "#e11d48", textAlign: "center", marginTop: 2 },
  colorLegend: { flexDirection: "row", flexWrap: "wrap", marginTop: 14, marginBottom: 2 },
  legendItem: { flexDirection: "row", alignItems: "center", marginRight: 14 },
  swatch: { width: 8, height: 8, borderRadius: 2, marginRight: 4 },
  legendItemText: { fontSize: 7.5, color: "#64748b" },
  legend: { marginTop: 24 },
  legendTitle: { fontSize: 10, fontWeight: "bold", marginBottom: 6, color: "#334155" },
  legendRow: { flexDirection: "row", fontSize: 8, color: "#475569", marginBottom: 3 },
  legendDate: { width: 60, color: "#94a3b8" },
  footer: { position: "absolute", left: 32, right: 32, bottom: 22, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footLeft: { flexDirection: "row", alignItems: "center" },
  footLogo: { width: 16, height: 16, marginRight: 6 },
  footText: { fontSize: 8, color: "#94a3b8" },
  qrBox: { alignItems: "center" },
  qr: { width: 40, height: 40 },
  qrCap: { fontSize: 6, color: "#94a3b8", marginTop: 1 },

  // ── Kalendarz roczny na 1 A4 ──
  yearPage: { padding: 22, paddingBottom: 44, fontFamily: "DejaVu", color: "#0f172a" },
  yearTitle: { fontSize: 20, fontWeight: "bold", color: "#003890" },
  yearSubtitle: { fontSize: 9, color: "#64748b", marginBottom: 8 },
  yearGrid: { flexDirection: "row", flexWrap: "wrap" },
  miniMonth: { width: "33.333%", paddingHorizontal: 5, paddingVertical: 5 },
  miniTitle: { fontSize: 9, fontWeight: "bold", color: "#08284f", marginBottom: 2 },
  miniHead: { flexDirection: "row", marginBottom: 1 },
  miniHeadCell: { width: "14.28%", fontSize: 5.5, color: "#94a3b8", textAlign: "center" },
  miniRow: { flexDirection: "row" },
  miniDayCell: { width: "14.28%", alignItems: "center", paddingVertical: 0.8, borderRadius: 2 },
  miniDayBreak: { backgroundColor: "#fef3c7" },
  miniDay: { fontSize: 7, color: "#1e293b" },
  miniDayMuted: { fontSize: 7, color: "#e2e8f0" },
  miniDayHoliday: { fontSize: 7, color: "#e11d48", fontWeight: "bold" },
  miniDaySunday: { fontSize: 7, color: "#e11d48" },
  miniDaySaturday: { fontSize: 7, color: "#fb7185" },
});

const LOGO_URL = `${SITE_URL}/brand/png/web/mark-calendar-color-256.png`;

export function MonthCalendarPdf({
  data,
  locale,
  qr,
  breakDates,
}: {
  data: MonthData;
  locale: Locale;
  qr: string;
  breakDates?: Set<string>;
}) {
  registerFonts();
  const monthName = MONTH_NAMES[locale][data.month];
  const isBreak = (iso: string) => !!breakDates?.has(iso);
  return (
    <Document title={`${monthName} ${data.year} — kalendarz.pro`}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {monthName} {data.year}
        </Text>
        <Text style={styles.subtitle}>kalendarz.pro — darmowe kalendarze do druku</Text>

        <View style={styles.headRow}>
          <Text style={styles.weekCol}>{locale === "pl" ? "Tydz." : "Wk"}</Text>
          {WEEKDAY_SHORT[locale].map((d) => (
            <Text key={d} style={styles.dayColHead}>
              {d}
            </Text>
          ))}
        </View>

        {data.weeks.map((week, wi) => (
          <View key={wi} style={styles.row}>
            <Text style={styles.weekCell}>{week[0].isoWeek}</Text>
            {week.map((day, di) => {
              const brk = day.inCurrentMonth && !day.holiday && isBreak(day.date);
              const numStyle = !day.inCurrentMonth
                ? styles.dayNumberMuted
                : day.holiday
                  ? styles.dayNumberHoliday
                  : di === 6
                    ? styles.dayNumberSunday
                    : di === 5
                      ? styles.dayNumberSaturday
                      : styles.dayNumber;
              return (
                <View key={day.date} style={brk ? [styles.dayCell, styles.dayCellBreak] : styles.dayCell}>
                  <Text style={numStyle}>{day.day}</Text>
                  {day.inCurrentMonth && day.holiday && (
                    <Text style={styles.holidayLabel}>{day.holiday.name[locale]}</Text>
                  )}
                </View>
              );
            })}
          </View>
        ))}

        {/* Legenda kolorów */}
        <View style={styles.colorLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: "#e11d48" }]} />
            <Text style={styles.legendItemText}>niedziele i święta</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: "#fb7185" }]} />
            <Text style={styles.legendItemText}>soboty</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: "#fde68a" }]} />
            <Text style={styles.legendItemText}>wolne od szkoły</Text>
          </View>
        </View>

        {data.holidaysInMonth.length > 0 && (
          <View style={styles.legend}>
            <Text style={styles.legendTitle}>
              {locale === "pl" ? "Święta w tym miesiącu" : "Holidays this month"}
            </Text>
            {data.holidaysInMonth.map((h) => (
              <View key={h.date} style={styles.legendRow}>
                <Text style={styles.legendDate}>{h.date}</Text>
                <Text>{h.name[locale]}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer} fixed>
          <View style={styles.footLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={LOGO_URL} style={styles.footLogo} />
            <Text style={styles.footText}>wygenerowano na kalendarz.pro</Text>
          </View>
          <View style={styles.qrBox}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={qr} style={styles.qr} />
            <Text style={styles.qrCap}>kalendarz.pro</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}

// Jeden kompaktowy mini-miesiąc (do kalendarza rocznego na 1 A4).
function MiniMonthPdf({ data, locale, isBreak }: { data: MonthData; locale: Locale; isBreak: (iso: string) => boolean }) {
  return (
    <View style={styles.miniMonth}>
      <Text style={styles.miniTitle}>{MONTH_NAMES[locale][data.month]}</Text>
      <View style={styles.miniHead}>
        {WEEKDAY_SHORT[locale].map((d, i) => (
          <Text key={i} style={styles.miniHeadCell}>{d[0]}</Text>
        ))}
      </View>
      {data.weeks.map((week, wi) => (
        <View key={wi} style={styles.miniRow}>
          {week.map((day, di) => {
            const brk = day.inCurrentMonth && !day.holiday && isBreak(day.date);
            const s = !day.inCurrentMonth
              ? styles.miniDayMuted
              : day.holiday
                ? styles.miniDayHoliday
                : di === 6
                  ? styles.miniDaySunday
                  : di === 5
                    ? styles.miniDaySaturday
                    : styles.miniDay;
            return (
              <View key={day.date} style={brk ? [styles.miniDayCell, styles.miniDayBreak] : styles.miniDayCell}>
                <Text style={s}>{day.day}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

// Cały rok na jednej stronie A4 — kolory, legenda, logo + QR.
export function YearCalendarPdf({
  year,
  months,
  breakDates,
  qr,
  locale,
}: {
  year: number;
  months: MonthData[];
  breakDates: Set<string>;
  qr: string;
  locale: Locale;
}) {
  registerFonts();
  const isBreak = (iso: string) => breakDates.has(iso);
  return (
    <Document title={`Kalendarz ${year} — kalendarz.pro`}>
      <Page size="A4" style={styles.yearPage}>
        <Text style={styles.yearTitle}>Kalendarz {year}</Text>
        <Text style={styles.yearSubtitle}>kalendarz.pro — darmowy kalendarz roczny do druku</Text>

        <View style={styles.yearGrid}>
          {months.map((data, m) => (
            <MiniMonthPdf key={m} data={data} locale={locale} isBreak={isBreak} />
          ))}
        </View>

        <View style={styles.colorLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: "#e11d48" }]} />
            <Text style={styles.legendItemText}>niedziele i święta</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: "#fb7185" }]} />
            <Text style={styles.legendItemText}>soboty</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: "#fde68a" }]} />
            <Text style={styles.legendItemText}>wakacje i wolne od szkoły</Text>
          </View>
        </View>

        <View style={styles.footer} fixed>
          <View style={styles.footLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={LOGO_URL} style={styles.footLogo} />
            <Text style={styles.footText}>wygenerowano na kalendarz.pro</Text>
          </View>
          <View style={styles.qrBox}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={qr} style={styles.qr} />
            <Text style={styles.qrCap}>kalendarz.pro</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
