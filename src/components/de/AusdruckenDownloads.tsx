"use client";

import { useState } from "react";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
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

function Preview({ kind }: { kind: Vorlage["preview"] }) {
  const cls = "h-full w-full";
  if (kind === "quer") {
    return (
      <svg viewBox="0 0 120 80" className={cls} role="img" aria-label="Vorschau Querformat">
        <rect x="1" y="1" width="118" height="78" rx="4" fill="#fff" stroke="#e2e8f0" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={8 + (i % 4) * 27} y={10 + Math.floor(i / 4) * 22} width="22" height="17" rx="2" fill="#eef2ff" stroke="#c7d2fe" />
        ))}
      </svg>
    );
  }
  if (kind === "hoch") {
    return (
      <svg viewBox="0 0 120 80" className={cls} role="img" aria-label="Vorschau Hochformat">
        <rect x="34" y="1" width="52" height="78" rx="4" fill="#fff" stroke="#e2e8f0" />
        {Array.from({ length: 12 }).map((_, i) => (
          <rect key={i} x={39 + (i % 3) * 15} y={8 + Math.floor(i / 3) * 17} width="12" height="13" rx="1.5" fill="#eef2ff" stroke="#c7d2fe" />
        ))}
      </svg>
    );
  }
  if (kind === "planer") {
    return (
      <svg viewBox="0 0 120 80" className={cls} role="img" aria-label="Vorschau Jahresplaner">
        <rect x="1" y="1" width="118" height="78" rx="4" fill="#fff" stroke="#e2e8f0" />
        <rect x="6" y="6" width="108" height="8" fill="#003890" rx="1.5" />
        {Array.from({ length: 8 }).map((_, r) => (
          <line key={r} x1="6" y1={18 + r * 7.5} x2="114" y2={18 + r * 7.5} stroke="#e2e8f0" />
        ))}
        {Array.from({ length: 11 }).map((_, c) => (
          <line key={c} x1={16 + c * 9} y1="14" x2={16 + c * 9} y2="78" stroke="#eef2ff" />
        ))}
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 120 80" className={cls} role="img" aria-label="Vorschau Halbjahr">
      <rect x="4" y="1" width="55" height="78" rx="4" fill="#fff" stroke="#e2e8f0" />
      <rect x="61" y="1" width="55" height="78" rx="4" fill="#fff" stroke="#e2e8f0" />
      {[4, 61].map((ox) =>
        Array.from({ length: 6 }).map((_, i) => (
          <rect key={`${ox}-${i}`} x={ox + 6} y={8 + i * 11.5} width="43" height="9" rx="1.5" fill="#eef2ff" stroke="#c7d2fe" />
        )),
      )}
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
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {VORLAGEN.map((v) => (
          <div key={v.typ} className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <div className="h-28 border-b border-slate-100 bg-slate-50 p-3">
              <Preview kind={v.preview} />
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
      <div className="mt-4 flex flex-col items-start gap-3 rounded-2xl border border-brand-green-200 bg-brand-green-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
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
        <h3 className="mb-3 text-lg font-bold text-navy-800">Einzelne Monate ({regionLabel})</h3>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {MONTH_NAMES_DE.map((name, m) => (
            <a
              key={m}
              href={`/api/pdf/de/${year}/${MONTH_SLUGS_DE[m]}${q}`}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 hover:border-navy-300 hover:shadow-sm"
            >
              📄 {name} {year}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
