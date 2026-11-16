"use client";

import { useState } from "react";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { SITE_URL } from "@/lib/de/site";

// Konfigurator für die einbettbaren Widgets: Typ wählen (Schulferien oder Kalenderblatt),
// Optionen setzen, Vorschau sehen, Einbettungscode kopieren. Reines Client-UI; die Widgets
// selbst sind die Seiten /widget/ferien/{land} und /widget/heute.
// Der Code besteht aus dem iframe und einem sichtbaren Quellenhinweis mit Link auf Kalender365.pro.
export default function WidgetKonfigurator({ year }: { year: number }) {
  const [typ, setTyp] = useState<"ferien" | "heute">("ferien");
  const [land, setLand] = useState("bayern");
  const [heuteLand, setHeuteLand] = useState("");
  const [feiertage, setFeiertage] = useState(true);
  const [kompakt, setKompakt] = useState(false);
  const [jahr, setJahr] = useState<"auto" | number>("auto");
  const [copied, setCopied] = useState(false);
  const state = BUNDESLAENDER.find((b) => b.slug === land) ?? BUNDESLAENDER[1];

  const qs = [feiertage ? null : "feiertage=0", kompakt ? "kompakt=1" : null, jahr === "auto" ? null : `jahr=${jahr}`].filter(Boolean).join("&");
  const path = typ === "ferien" ? `/widget/ferien/${state.slug}${qs ? `?${qs}` : ""}` : `/widget/heute${heuteLand ? `?land=${heuteLand}` : ""}`;
  const height = typ === "ferien" ? (kompakt ? (feiertage ? 410 : 280) : feiertage ? 610 : 410) : 390;
  const maxWidth = typ === "ferien" ? 520 : 340;
  const title = typ === "ferien" ? `Schulferien ${state.name}` : "Kalenderblatt: heutiges Datum";
  const code =
    `<iframe src="${SITE_URL}${path}" width="100%" height="${height}" style="border:0;max-width:${maxWidth}px" loading="lazy" title="${title}"></iframe>\n` +
    `<p style="margin:4px 0 0;font-size:12px">Kalender: <a href="${SITE_URL}/">Kalender365.pro</a></p>`;

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
  const cardCls = (active: boolean) => `flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${active ? "border-navy-500 bg-navy-50" : "border-slate-200"}`;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <fieldset>
          <legend className="text-sm font-semibold text-navy-800">1. Widget wählen</legend>
          <div className="mt-2 grid gap-2">
            <label className={cardCls(typ === "ferien")}>
              <input type="radio" name="typ" className="mt-1" checked={typ === "ferien"} onChange={() => setTyp("ferien")} />
              <span>
                <span className="block font-semibold text-navy-800">Schulferien</span>
                <span className="block text-sm text-slate-600">Die nächsten Ferien und Feiertage Ihres Bundeslandes. Für Schulen, Kitas, Elternvertretungen und Vereine.</span>
              </span>
            </label>
            <label className={cardCls(typ === "heute")}>
              <input type="radio" name="typ" className="mt-1" checked={typ === "heute"} onChange={() => setTyp("heute")} />
              <span>
                <span className="block font-semibold text-navy-800">Kalenderblatt</span>
                <span className="block text-sm text-slate-600">Heutiges Datum, Kalenderwoche, Namenstag und nächster Feiertag. Für Gemeinden, Pfarreien und Betriebe.</span>
              </span>
            </label>
          </div>
        </fieldset>

        <p className="mt-4 text-sm font-semibold text-navy-800">2. Einstellen</p>
        {typ === "ferien" ? (
          <>
            <div className="mt-2 flex flex-wrap items-end gap-4">
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
          </>
        ) : (
          <label className="mt-2 block text-sm">
            <span className="block text-slate-500">Feiertage für</span>
            <select value={heuteLand} onChange={(e) => setHeuteLand(e.target.value)} className={inputCls}>
              <option value="">Deutschland (bundesweit)</option>
              {BUNDESLAENDER.map((b) => <option key={b.code} value={b.slug}>{b.name}</option>)}
            </select>
          </label>
        )}

        <label className="mt-4 block text-sm">
          <span className="block font-semibold text-navy-800">3. Code kopieren</span>
          <textarea readOnly value={code} rows={6} className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 font-mono text-xs text-navy-800" onFocus={(e) => e.currentTarget.select()} />
        </label>
        <button type="button" onClick={copy} className="mt-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
          {copied ? "✓ Kopiert" : "Code kopieren"}
        </button>
        <p className="mt-3 text-xs text-slate-500">
          Der Code besteht aus zwei Teilen: dem Rahmen mit dem Widget und einem kurzen Quellenhinweis mit Link auf
          Kalender365.pro. Bitte lassen Sie den Hinweis unter dem Widget stehen, er ist die einzige Bedingung für die
          kostenlose Nutzung.
        </p>
      </div>
      <div>
        <p className="mb-2 text-sm font-semibold text-slate-500">Vorschau</p>
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-2">
          <iframe key={path} src={path} width="100%" height={height} style={{ border: 0, maxWidth, display: "block", margin: "0 auto" }} title={`Vorschau: ${title}`} />
          <p style={{ margin: "4px auto 0", fontSize: 12, maxWidth }}>
            Kalender: <a href={`${SITE_URL}/`} className="underline">Kalender365.pro</a>
          </p>
        </div>
      </div>
    </div>
  );
}
