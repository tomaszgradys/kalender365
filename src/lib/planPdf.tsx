import { Document, Page, View, Text, Image, StyleSheet, Font, pdf } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { SITE_URL } from "./site";

export type PlanCell = { subject: string; room: string; color: string };
export type PlanSlot = { from: string; to: string };
export type PlanData = {
  title: string;
  subtitle: string;
  accent: string;
  photo: string | null;
  saturday: boolean;
  slots: PlanSlot[];
  cells: PlanCell[][];
};

const DAY_LABELS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];

let fontsRegistered = false;
function registerFonts() {
  if (fontsRegistered) return;
  const base = typeof window !== "undefined" ? window.location.origin : SITE_URL;
  Font.register({
    family: "DejaVu",
    fonts: [
      { src: `${base}/fonts/DejaVuSans.ttf` },
      { src: `${base}/fonts/DejaVuSans-Bold.ttf`, fontWeight: "bold" },
    ],
  });
  fontsRegistered = true;
}

const styles = StyleSheet.create({
  page: { paddingHorizontal: 28, paddingTop: 26, paddingBottom: 54, fontFamily: "DejaVu", fontSize: 9, color: "#0f172a" },
  header: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  logo: { width: 34, height: 34 },
  photo: { width: 40, height: 40, borderRadius: 4, objectFit: "cover" },
  title: { fontSize: 20, fontWeight: "bold" },
  subtitle: { fontSize: 11, color: "#64748b", marginTop: 2 },
  row: { flexDirection: "row" },
  th: { color: "#ffffff", fontWeight: "bold", fontSize: 9, textAlign: "center", paddingVertical: 6, paddingHorizontal: 2, borderColor: "#ffffff", borderWidth: 0.5 },
  timeCell: { width: 62, borderColor: "#cbd5e1", borderWidth: 0.5, paddingVertical: 6, alignItems: "center", justifyContent: "center" },
  timeFrom: { fontSize: 9, fontWeight: "bold", color: "#334155" },
  timeTo: { fontSize: 8, color: "#94a3b8" },
  dayCell: { flex: 1, borderColor: "#cbd5e1", borderWidth: 0.5, paddingVertical: 6, paddingHorizontal: 3, alignItems: "center", justifyContent: "center", minHeight: 30 },
  subject: { fontSize: 9.5, fontWeight: "bold", textAlign: "center", color: "#0f172a" },
  room: { fontSize: 7.5, color: "#64748b", marginTop: 1 },
  footer: { position: "absolute", left: 28, right: 28, bottom: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  footLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  footLogo: { width: 16, height: 16 },
  footText: { fontSize: 8, color: "#94a3b8" },
  qrBox: { alignItems: "center" },
  qr: { width: 42, height: 42 },
  qrCap: { fontSize: 6.5, color: "#94a3b8", marginTop: 1 },
});

function PlanDoc({ state, qr, logo }: { state: PlanData; qr: string; logo: string }) {
  const cols = state.saturday ? 6 : 5;
  return (
    <Document title={`Plan lekcji — ${state.title}`}>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          {/* eslint-disable-next-line jsx-a11y/alt-text */}
          {state.photo ? <Image src={state.photo} style={styles.photo} /> : <Image src={logo} style={styles.logo} />}
          <View>
            <Text style={[styles.title, { color: state.accent }]}>{state.title || "Plan lekcji"}</Text>
            {!!state.subtitle && <Text style={styles.subtitle}>{state.subtitle}</Text>}
          </View>
        </View>

        {/* nagłówek tabeli */}
        <View style={styles.row}>
          <Text style={[styles.th, { width: 62, backgroundColor: state.accent }]}>Godzina</Text>
          {Array.from({ length: cols }, (_, c) => (
            <Text key={c} style={[styles.th, { flex: 1, backgroundColor: state.accent }]}>
              {DAY_LABELS[c]}
            </Text>
          ))}
        </View>

        {/* wiersze */}
        {state.slots.map((slot, r) => (
          <View style={styles.row} key={r} wrap={false}>
            <View style={styles.timeCell}>
              <Text style={styles.timeFrom}>{slot.from}</Text>
              <Text style={styles.timeTo}>{slot.to}</Text>
            </View>
            {Array.from({ length: cols }, (_, c) => {
              const cell = state.cells[r]?.[c] ?? { subject: "", room: "", color: "#ffffff" };
              return (
                <View key={c} style={[styles.dayCell, { backgroundColor: cell.color || "#ffffff" }]}>
                  {!!cell.subject && <Text style={styles.subject}>{cell.subject}</Text>}
                  {!!cell.room && <Text style={styles.room}>{cell.room}</Text>}
                </View>
              );
            })}
          </View>
        ))}

        {/* stopka: logo + tekst + QR */}
        <View style={styles.footer} fixed>
          <View style={styles.footLeft}>
            {/* eslint-disable-next-line jsx-a11y/alt-text */}
            <Image src={logo} style={styles.footLogo} />
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

export async function downloadPlanPdf(state: PlanData) {
  registerFonts();
  const qr = await QRCode.toDataURL(SITE_URL, { margin: 0, width: 240, color: { dark: "#003890", light: "#ffffff" } });
  const logo = `${typeof window !== "undefined" ? window.location.origin : SITE_URL}/brand/png/web/mark-calendar-color-256.png`;
  const blob = await pdf(<PlanDoc state={state} qr={qr} logo={logo} />).toBlob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const safe = (state.title || "plan-lekcji").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  a.download = `${safe || "plan-lekcji"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
