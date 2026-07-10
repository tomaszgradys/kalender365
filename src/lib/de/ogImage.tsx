import { ImageResponse } from "next/og";
import type { ReactElement } from "react";

// Gemeinsame Vorlage für dynamische Open-Graph-/Twitter-Vorschaubilder.
// Einzige Quelle der Markenoptik (Wortmarke, Farben, Fußzeile) für ALLE
// Seitentypen. Vollständig selbstständig (kein externes Asset, System-Sans,
// Häkchen als Inline-SVG) → CSP-konform und ohne Font-Datei umlautfähig.
//
// Jeder Seitentyp liefert nur seine Felder (kicker/title/subtitle); so bekommt
// jeder geteilte Link eine eigene, sprechende Vorschau statt eines generischen
// Bildes: „Feiertage 2026 · Bayern", „Sommerferien 2026 · Niedersachsen" usw.

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

const NAVY = "#003890";
const GREEN = "#16a34a";

export type OgFields = {
  /** Kleine Oberzeile (Kategorie), z. B. „Gesetzliche Feiertage". */
  kicker?: string;
  /** Hauptzeile, z. B. „Feiertage 2026". Kurz halten (eine Zeile). */
  title: string;
  /** Unterzeile, z. B. Bundesland oder Zusatz. */
  subtitle?: string;
};

function OgCard({ kicker, title, subtitle }: OgFields): ReactElement {
  return (
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
        <div style={{ display: "flex", fontSize: 56, fontWeight: 800, letterSpacing: -2 }}>
          <span style={{ color: NAVY }}>Kalender365</span>
          <span style={{ color: GREEN }}>.pro</span>
        </div>
      </div>

      {/* Kicker + Titel + Untertitel */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {kicker ? (
          <div
            style={{
              display: "flex",
              fontSize: 30,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: GREEN,
              marginBottom: 14,
            }}
          >
            {kicker}
          </div>
        ) : null}
        <div style={{ display: "flex", fontSize: 72, fontWeight: 800, color: NAVY, lineHeight: 1.05 }}>{title}</div>
        {subtitle ? (
          <div style={{ display: "flex", marginTop: 18, fontSize: 34, color: "#475569" }}>{subtitle}</div>
        ) : null}
      </div>

      {/* Fußzeile — Häkchen als Inline-SVG (keine externe Schriftart nötig) */}
      <div style={{ display: "flex", alignItems: "center", fontSize: 26, color: "#64748b" }}>
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" style={{ marginRight: 14 }}>
          <path d="M20 6 9 17l-5-5" stroke={GREEN} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Kostenlos für Deutschland und alle 16 Bundesländer
      </div>
    </div>
  );
}

/** Rendert das markenkonforme OG-Bild (1200×630) für die gegebenen Felder. */
export function renderOgImage(fields: OgFields): ImageResponse {
  return new ImageResponse(<OgCard {...fields} />, { ...OG_SIZE });
}
