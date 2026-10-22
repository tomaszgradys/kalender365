"use client";

import { useState } from "react";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { SITE_URL } from "@/lib/de/site";

// Konfigurator für das einbettbare Ferien-Widget: Bundesland + Optionen wählen,
// Vorschau sehen, Einbettungscode kopieren. Reines Client-UI; das Widget selbst
// ist die Seite /widget/ferien/{land}.
export default function WidgetKonfigurator({ year }: { year: number }) {
  const [land, setLand] = useState("bayern");
  const [feiertage, setFeiertage] = useState(true);
  const [kompakt, setKompakt] = useState(false);
  const [jahr, setJahr] = useState<"auto" | number>("auto");
  const [copied, setCopied] = useState(false);
  const state = BUNDESLAENDER.find((b) => b.slug === land) ?? BUNDESLAENDER[1];
  const qs = [feiertage ? null : "feiertage=0", kompakt ? "kompakt=1" : null, jahr === "auto" ? null : `jahr=${jahr}`].filter(Boolean).join("&");
  const src = `${SITE_URL}/widget/ferien/${state.slug}${qs ? `?${qs}` : ""}`;
  const height = kompakt ? (feiertage ? 300 : 210) : feiertage ? 440 : 320;
  const code = `<iframe src="${src}" width="100%" height="${height}" style="border:0;max-width:520px" loading="lazy" title="Schulferien ${state.name} – kalender365.pro"></iframe>`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* Clipboard nicht verfügbar – Nutzer kopiert manuell aus dem Textfeld */
    }
  }

  const inputCls = "rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-navy-800 outline-none focus:border-navy-300";
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="text-sm">
            <span className="block text-slate-500">Bundesland</span>
            <select value={land} onChange={(e) => setLand(e.target.value)} className={inputCls}>
              {BUNDESLAENDER.map((b) => <option key={b.code} value={b.slug}>{b.name}</option>)}
            </select>
          </label>
          <label className="text-sm">
            <span className="block text-slate-500">Zeitraum</span>
            <select value={jahr} onChange={(e) => setJahr(e.target.value === "auto" ? "auto" : Number(e.target.value))} className={inputCls}>
              <option value="auto">automatisch: nächste Ferien</option>
              <option value={year}>nur {year}</option>
              <option value={year + 1}>nur {year + 1}</option>
            </select>
          </label>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-700">
          <label className="flex items-center gap-2"><input type="checkbox" checked={feiertage} onChange={(e) => setFeiertage(e.target.checked)} /> nächste Feiertage anzeigen</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={kompakt} onChange={(e) => setKompakt(e.target.checked)} /> kompakt (4 Ferien, 3 Feiertage)</label>
        </div>
        <label className="mt-4 block text-sm">
          <span className="block text-slate-500">Einbettungscode (HTML)</span>
          <textarea readOnly value={code} rows={4} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs text-navy-800" onFocus={(e) => e.currentTarget.select()} />
        </label>
        <button type="button" onClick={copy} className="mt-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
          {copied ? "✓ Kopiert" : "Code kopieren"}
        </button>
        <p className="mt-3 text-xs text-slate-500">Den Code an beliebiger Stelle Ihrer Website einfügen (WordPress: Block „Individuelles HTML“). Das Widget aktualisiert sich selbst; es setzt keine Cookies und lädt keine Skripte.</p>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-500">Vorschau</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <iframe key={src} src={src} width="100%" height={height} style={{ border: 0 }} title={`Vorschau: Schulferien ${state.name}`} />
        </div>
      </div>
    </div>
  );
}
