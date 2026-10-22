"use client";

import { useState } from "react";
import { BUNDESLAENDER, type StateCode } from "@/lib/de/bundeslaender";
import { monthMatrix } from "@/lib/de/calendar";
import { MONTH_NAMES_DE, MONTH_SLUGS_DE } from "@/lib/de/locale";

// Interaktive Vorlagen-Auswahl: ein Bundesland wählen → alle Download-Links
// (PDF-Varianten, Excel, Monate) bekommen automatisch das passende ?land=.
// So gilt die Bundesland-Auswahl für JEDES Format, nicht nur für eines.

type Vorlage = {
  typ: string;
  title: string;
  desc: string;
  preview: "quer" | "hoch" | "planer" | "halbjahr";
  excel?: boolean;
};

const VORLAGEN: Vorlage[] = [
  { typ: "jahr-quer", title: "Jahreskalender · Querformat", desc: "Alle 12 Monate auf einer A4-Seite im Querformat – ideal für die Wand.", preview: "quer" },
  { typ: "jahr-hoch", title: "Jahreskalender · Hochformat", desc: "Alle 12 Monate auf einer A4-Seite im Hochformat – passt in jeden Ordner.", preview: "hoch" },
  { typ: "jahresplaner", title: "Jahresplaner zum Eintragen", desc: "Tage 1–31 als Zeilen, Monate als Spalten – die ganze Jahresübersicht auf einem Blatt.", preview: "planer", excel: true },
  { typ: "halbjahr", title: "Halbjahreskalender", desc: "Zwei Seiten (Jan–Jun, Jul–Dez) mit großen Monatsfeldern – viel Platz für Notizen.", preview: "halbjahr" },
];

// Echte Mini-Vorschau: die zwölf Monate des Jahres als kleine Rasterkalender mit
// den tatsächlichen Tagesnummern, Wochenenden grau, gesetzliche Feiertage grün.
function MiniMonat({ year, m, x, y, w, h, numbers, state }: { year: number; m: number; x: number; y: number; w: number; h: number; numbers: boolean; state?: StateCode }) {
  const rows = monthMatrix(year, m, state);
  const cw = w / 7;
  const ch = (h - 4) / 6.6;
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height={3.2} fill="#003890" rx="0.5" />
      {rows.map((row, r) =>
        row.map((d, c) => {
          if (!d.day) return null;
          const cx = c * cw;
          const cy = 4 + r * ch;
          const fill = d.holiday ? "#bbf7d0" : d.weekend ? "#eef2f7" : "none";
          return (
            <g key={`${r}-${c}`}>
              {fill !== "none" && <rect x={cx} y={cy} width={cw} height={ch} fill={fill} />}
              {numbers && (
                <text x={cx + cw / 2} y={cy + ch * 0.78} fontSize={ch * 0.72} textAnchor="middle" fill={d.weekend || d.holiday ? "#475569" : "#0f172a"} fontFamily="system-ui, sans-serif">
                  {d.day}
                </text>
              )}
            </g>
          );
        }),
      )}
    </g>
  );
}

function Preview({ kind, year, state }: { kind: Vorlage["preview"]; year: number; state?: StateCode }) {
  const cls = "h-full w-full";
  if (kind === "quer") {
    return (
      <svg viewBox="0 0 120 80" className={cls} role="img" aria-label={`Vorschau Jahreskalender ${year} Querformat`}>
        <rect x="0.5" y="0.5" width="119" height="79" rx="3" fill="#fff" stroke="#e2e8f0" />
        <rect x="6" y="4" width="40" height="3" rx="1" fill="#003890" />
        {Array.from({ length: 12 }).map((_, i) => (
          <MiniMonat key={i} year={year} m={i} x={6 + (i % 4) * 28} y={10 + Math.floor(i / 4) * 23} w={25} h={20} numbers state={state} />
        ))}
      </svg>
    );
  }
  if (kind === "hoch") {
    return (
      <svg viewBox="0 0 120 80" className={cls} role="img" aria-label={`Vorschau Jahreskalender ${year} Hochformat`}>
        <rect x="32.5" y="0.5" width="55" height="79" rx="3" fill="#fff" stroke="#e2e8f0" />
        <rect x="37" y="4" width="26" height="2.5" rx="1" fill="#003890" />
        {Array.from({ length: 12 }).map((_, i) => (
          <MiniMonat key={i} year={year} m={i} x={37 + (i % 3) * 16} y={9 + Math.floor(i / 3) * 17.5} w={14} h={15} numbers={false} state={state} />
        ))}
      </svg>
    );
  }
  if (kind === "planer") {
    // Jahresplaner: Zeilen = Tage 1–31, Spalten = Monate; Wochenenden/Feiertage markiert.
    return (
      <svg viewBox="0 0 120 80" className={cls} role="img" aria-label={`Vorschau Jahresplaner ${year}`}>
        <rect x="0.5" y="0.5" width="119" height="79" rx="3" fill="#fff" stroke="#e2e8f0" />
        <rect x="6" y="4" width="108" height="5" rx="1" fill="#003890" />
        {Array.from({ length: 12 }).map((_, m) => {
          const rows = monthMatrix(year, m, state).flat().filter((d) => d.day > 0);
          return rows.map((d) => {
            const fill = d.holiday ? "#bbf7d0" : d.weekend ? "#e2e8f0" : "#fff";
            return <rect key={`${m}-${d.day}`} x={10 + m * 8.7} y={10 + (d.day - 1) * 2.2} width={8.2} height={2} fill={fill} />;
          });
        })}
        {Array.from({ length: 12 }).map((_, m) => (
          <line key={m} x1={10 + m * 8.7} y1="9" x2={10 + m * 8.7} y2="78.5" stroke="#cbd5e1" strokeWidth="0.3" />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 80" className={cls} role="img" aria-label={`Vorschau Halbjahreskalender ${year}`}>
      <rect x="3.5" y="0.5" width="55" height="79" rx="3" fill="#fff" stroke="#e2e8f0" />
      <rect x="61.5" y="0.5" width="55" height="79" rx="3" fill="#fff" stroke="#e2e8f0" />
      {Array.from({ length: 12 }).map((_, i) => {
        const page = i < 6 ? 3.5 : 61.5;
        const k = i % 6;
        return <MiniMonat key={i} year={year} m={i} x={page + 4 + (k % 2) * 25} y={5 + Math.floor(k / 2) * 25} w={22} h={22} numbers={false} state={state} />;
      })}
    </svg>
  );
}

export default function AusdruckenDownloads({ year }: { year: number }) {
  const [land, setLand] = useState(""); // "" = Deutschland
  const q = land ? `?land=${land}` : "";
  const selected = BUNDESLAENDER.find((b) => b.slug === land);
  const regionLabel = selected ? selected.name : "Deutschland";

  return (
    <div>
      {/* Bundesland-Auswahl */}
      <div className="rounded-2xl border border-slate-200 bg-navy-50/40 p-4">
        <label htmlFor="land-select" className="text-sm font-semibold text-navy-800">
          Feiertage &amp; Schulferien Ihres Bundeslandes einschließen
        </label>
        <p className="mb-2 mt-0.5 text-xs text-slate-500">
          Auswahl gilt für alle Vorlagen unten. Aktuell: <span className="font-semibold text-navy-700">{regionLabel}</span>
        </p>
        <select
          id="land-select"
          value={land}
          onChange={(e) => setLand(e.target.value)}
          className="w-full max-w-sm rounded-lg border border-slate-300 bg-white px-3 py-2 text-base text-navy-800 focus:border-navy-500 focus:outline-none focus:ring-2 focus:ring-navy-200"
        >
          <option value="">Deutschland (nur bundesweite Feiertage)</option>
          {BUNDESLAENDER.map((b) => (
            <option key={b.code} value={b.slug}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Vorlagen-Karten */}
      <h2 className="mt-8 text-xl font-bold text-navy-800">Kalender {year} als PDF – 4 Jahresvorlagen ({regionLabel})</h2>
      <p className="mt-1 text-sm text-slate-600">Insgesamt 17 Druckvorlagen je Region: vier Jahresansichten, zwölf Monatskalender und ein Excel-Jahresplaner – jeweils mit Kalenderwochen, Wochenenden und den Feiertagen {selected ? `in ${selected.name}` : "bundesweit"}. Die Vorschau zeigt das echte Jahr {year}.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {VORLAGEN.map((v) => (
          <div key={v.typ} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="h-40 border-b border-slate-100 bg-slate-50 p-3">
              <Preview kind={v.preview} year={year} state={selected?.code} />
            </div>
            <div className="flex flex-1 flex-col p-4">
              <h3 className="font-bold text-navy-800">{v.title}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600">{v.desc}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={`/api/pdf/de/vorlage/${year}?typ=${v.typ}${land ? `&land=${land}` : ""}`}
                  className="rounded-lg bg-navy-600 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-700"
                >
                  📄 PDF ({regionLabel})
                </a>
                {v.excel && (
                  <a
                    href={`/api/xlsx/de/${year}${q}`}
                    className="rounded-lg border border-brand-green-500 px-3 py-2 text-sm font-semibold text-brand-green-700 hover:bg-brand-green-50"
                  >
                    ⬇ Excel (.xlsx)
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Excel eigenständig hervorheben */}
      <h2 className="mt-8 text-xl font-bold text-navy-800">Kalender {year} als Excel (.xlsx) – Jahresplaner zum Eintragen</h2>
      <div className="mt-3 flex flex-col items-start gap-3 rounded-2xl border border-brand-green-200 bg-brand-green-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-bold text-navy-800">Excel-Vorlage zum Bearbeiten</h3>
          <p className="mt-0.5 text-sm text-slate-600">
            Jahresplaner als editierbare .xlsx-Datei inkl. Feiertage{selected ? " und Schulferien" : ""} – Wochenenden und Feiertage farbig markiert.
          </p>
        </div>
        <a
          href={`/api/xlsx/de/${year}${q}`}
          className="whitespace-nowrap rounded-lg bg-brand-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-green-700"
        >
          ⬇ Excel ({regionLabel})
        </a>
      </div>

      {/* Monatskalender */}
      <div className="mt-8">
        <h2 className="mb-1 text-xl font-bold text-navy-800">Monatskalender {year} zum Ausdrucken – 12 PDF ({regionLabel})</h2>
        <p className="mb-3 text-sm text-slate-600">Je ein Monat pro A4-Seite mit großen Tagesfeldern für Notizen, Kalenderwochen und Feiertagen.</p>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {MONTH_NAMES_DE.map((name, m) => (
            <a
              key={m}
              href={`/api/pdf/de/${year}/${MONTH_SLUGS_DE[m]}${q}`}
              className="overflow-hidden rounded-xl border border-slate-200 bg-white text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm"
            >
              <div className="h-16 bg-slate-50 p-1.5">
                <svg viewBox="0 0 60 36" className="h-full w-full" role="img" aria-label={`Vorschau ${name} ${year}`}>
                  <MiniMonat year={year} m={m} x={2} y={1} w={56} h={34} numbers state={selected?.code} />
                </svg>
              </div>
              <div className="px-3 py-2">📄 {name} {year}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
