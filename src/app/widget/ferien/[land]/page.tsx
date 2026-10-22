import { notFound } from "next/navigation";
import { stateBySlug, STATE_SLUGS } from "@/lib/de/bundeslaender";
import { getSchulferien, FERIEN_TYP_LABEL } from "@/lib/de/schulferien";
import { getFeiertage } from "@/lib/de/feiertage";
import { formatShortDE, weekdayDE } from "@/lib/de/locale";
import { berlinNow } from "@/lib/de/now";
import { SITE_URL } from "@/lib/de/site";

// Einbettbares Ferien-Widget: /widget/ferien/{bundesland}?jahr=2027&feiertage=0
// Zeigt die nächsten Schulferien (ab heute, über den Jahreswechsel hinweg) und
// optional die nächsten gesetzlichen Feiertage des Landes. Täglich neu gerendert.
export const revalidate = 3600;
export const dynamicParams = true;

export function generateStaticParams() {
  return STATE_SLUGS.map((land) => ({ land }));
}

type Params = { params: Promise<{ land: string }>; searchParams: Promise<Record<string, string | string[] | undefined>> };

export default async function FerienWidgetPage({ params, searchParams }: Params) {
  const { land } = await params;
  const sp = await searchParams;
  const state = stateBySlug(land);
  if (!state) notFound();

  const now = berlinNow();
  const todayIso = `${now.year}-${String(now.month0 + 1).padStart(2, "0")}-${String(now.day).padStart(2, "0")}`;
  const jahrRaw = typeof sp.jahr === "string" ? Number(sp.jahr) : NaN;
  const pinned = Number.isInteger(jahrRaw) && jahrRaw >= 2000 && jahrRaw <= 2100 ? jahrRaw : null;
  const showFeiertage = sp.feiertage !== "0";
  const kompakt = sp.kompakt === "1";

  // Ferienperioden: bei fixem Jahr alle Perioden des Jahres, sonst die
  // nächsten ab heute (laufendes + folgendes Jahr).
  const years = pinned ? [pinned] : [now.year, now.year + 1];
  const periods = years
    .flatMap((y) => getSchulferien(y, state.code)?.periods ?? [])
    .filter((p) => (pinned ? true : p.end >= todayIso))
    .sort((a, b) => a.start.localeCompare(b.start))
    .slice(0, kompakt ? 4 : 8);
  const feiertage = showFeiertage
    ? years
        .flatMap((y) => getFeiertage(y, state.code, { includePartial: false, includeSundayLegal: false }))
        .filter((h) => (pinned ? h.date.startsWith(String(pinned)) : h.date >= todayIso))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, kompakt ? 3 : 5)
    : [];
  const titelJahr = pinned ? String(pinned) : `${now.year}/${now.year + 1}`;
  const quelle = `${SITE_URL}/schulferien/${pinned ?? now.year}/${state.slug}`;
  const laufend = periods.find((p) => p.start <= todayIso && p.end >= todayIso);

  const td: React.CSSProperties = { padding: "6px 8px", borderTop: "1px solid #e2e8f0", verticalAlign: "top" };
  return (
    <div style={{ padding: 12, maxWidth: 520 }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 8 }}>
        <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#0b2a6f" }}>Schulferien {state.name} {titelJahr}</h1>
        {laufend && !pinned && (
          <span style={{ fontSize: 11, fontWeight: 700, color: "#15803d", background: "#dcfce7", borderRadius: 999, padding: "2px 8px", whiteSpace: "nowrap" }}>
            gerade {FERIEN_TYP_LABEL[laufend.typ]}
          </span>
        )}
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 8 }}>
        <tbody>
          {periods.length === 0 && (
            <tr><td style={td}>Für {titelJahr} liegen noch keine bestätigten Ferientermine vor.</td></tr>
          )}
          {periods.map((p) => (
            <tr key={p.typ + p.start}>
              <td style={{ ...td, fontWeight: 700, color: "#0b2a6f", whiteSpace: "nowrap" }}>{FERIEN_TYP_LABEL[p.typ]}</td>
              <td style={td}>
                {p.start === p.end
                  ? `${weekdayDE(p.start)}, ${formatShortDE(p.start)}`
                  : `${formatShortDE(p.start)} – ${formatShortDE(p.end)}`}
                {p.note ? <span style={{ color: "#64748b" }}> ({p.note})</span> : null}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {feiertage.length > 0 && (
        <>
          <h2 style={{ margin: "12px 0 4px", fontSize: 13, fontWeight: 700, color: "#334155" }}>Nächste Feiertage in {state.name}</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <tbody>
              {feiertage.map((h) => (
                <tr key={h.date + h.slug}>
                  <td style={{ ...td, whiteSpace: "nowrap" }}>{weekdayDE(h.date).slice(0, 2)}., {formatShortDE(h.date)}</td>
                  <td style={td}>{h.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <p style={{ margin: "10px 0 0", fontSize: 11, color: "#64748b" }}>
        Quelle: Ferienregelungen der Länder (KMK), ohne Gewähr ·{" "}
        <a href={quelle} target="_blank" rel="noopener" style={{ color: "#0b2a6f", fontWeight: 600, textDecoration: "none" }}>
          alle Termine auf kalender365.pro
        </a>
      </p>
    </div>
  );
}
