import { ImageResponse } from "next/og";

// Standard-OG-/Twitter-Bild für alle deutschen Seiten. Dynamisch generiert
// (kein externes Asset → CSP-konform), damit Social-Previews ein deutsches,
// markenkonformes Vorschaubild erhalten. Einzelseiten (z. B. Blog mit eigenem
// Titelbild) überschreiben dies über openGraph.images in generateMetadata.

export const alt = "Kalender365.pro – Kalender, Feiertage, Schulferien & PDF für Deutschland";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const NAVY = "#003890";
const GREEN = "#16a34a";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#ffffff",
          padding: "72px 80px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Wortmarke */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: 96,
              height: 96,
              borderRadius: 20,
              border: `6px solid ${NAVY}`,
              overflow: "hidden",
              marginRight: 28,
            }}
          >
            <div style={{ display: "flex", height: 26, background: NAVY }} />
            <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 30, height: 30, borderRadius: 8, background: GREEN }} />
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 68, fontWeight: 800, letterSpacing: -2 }}>
            <span style={{ color: NAVY }}>Kalender365</span>
            <span style={{ color: GREEN }}>.pro</span>
          </div>
        </div>

        {/* Claim */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 60, fontWeight: 800, color: NAVY, lineHeight: 1.1 }}>
            Kalender, Feiertage &amp; Schulferien
          </div>
          <div style={{ display: "flex", marginTop: 16, fontSize: 34, color: "#475569" }}>
            Brückentage · Kalenderwochen · Mondphasen · PDF zum Ausdrucken
          </div>
        </div>

        {/* Fußzeile */}
        <div style={{ display: "flex", alignItems: "center", fontSize: 28, color: "#64748b" }}>
          <span style={{ color: GREEN, marginRight: 12 }}>✓</span>
          Kostenlos für Deutschland und alle 16 Bundesländer
        </div>
      </div>
    ),
    { ...size },
  );
}
