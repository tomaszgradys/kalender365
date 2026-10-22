"use client";

import { useState } from "react";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";

// Urlaubsplaner „zum Ausdrucken / als Excel": Bundesland wählen → Jahresplaner
// als PDF (Tage als Zeilen, Monate als Spalten, Feiertage + Ferien markiert)
// und als editierbare Excel-Datei. Nutzt die bestehenden Export-Routen der
// Seite „Kalender zum Ausdrucken" – keine neue Serverlogik.
export default function PlanerDownloads({ year }: { year: number }) {
  const [land, setLand] = useState("");
  const selected = BUNDESLAENDER.find((b) => b.slug === land);
  const label = selected ? selected.name : "Deutschland";
  const q = land ? `&land=${land}` : "";
  const qx = land ? `?land=${land}` : "";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex flex-wrap items-end gap-4">
        <label className="text-sm">
          <span className="block text-slate-500">Bundesland (Feiertage &amp; Schulferien)</span>
          <select value={land} onChange={(e) => setLand(e.target.value)} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-navy-800 outline-none focus:border-navy-300">
            <option value="">Deutschland (nur bundesweite Feiertage)</option>
            {BUNDESLAENDER.map((b) => <option key={b.code} value={b.slug}>{b.name}</option>)}
          </select>
        </label>
        <a href={`/api/pdf/de/vorlage/${year}?typ=jahresplaner${q}`} className="rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700">
          📄 Urlaubsplaner {year} als PDF ({label})
        </a>
        <a href={`/api/xlsx/de/${year}${qx}`} className="rounded-lg border border-brand-green-500 px-4 py-2 text-sm font-semibold text-brand-green-700 hover:bg-brand-green-50">
          ⬇ Urlaubsplaner {year} als Excel (.xlsx)
        </a>
      </div>
      <p className="mt-3 text-xs text-slate-500">
        Jahresplaner-Layout: Tage 1–31 als Zeilen, Monate als Spalten, Wochenenden und gesetzliche Feiertage {selected ? `in ${selected.name}` : "bundesweit"} farbig markiert{selected ? ", Schulferien hervorgehoben" : ""}. Die Excel-Datei enthält zusätzlich je ein Tabellenblatt mit allen Feiertagen und Ferienterminen und lässt sich frei bearbeiten – zum Beispiel als Urlaubsübersicht für das ganze Team.
      </p>
    </div>
  );
}
