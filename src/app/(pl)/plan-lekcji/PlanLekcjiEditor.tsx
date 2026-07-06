"use client";

import { useEffect, useRef, useState } from "react";

type Cell = { subject: string; room: string; color: string };
type Slot = { from: string; to: string };
type PlanState = {
  title: string;
  subtitle: string;
  photo: string | null;
  accent: string;
  saturday: boolean;
  startTime: string; // "HH:MM"
  lessonLen: number; // minuty
  breakLen: number; // minuty
  slots: Slot[];
  cells: Cell[][]; // [rowIndex][colIndex]
};

const DAY_LABELS = ["Poniedziałek", "Wtorek", "Środa", "Czwartek", "Piątek", "Sobota"];
const PALETTE = ["#ffffff", "#e5eafd", "#dcfce7", "#fef9c3", "#ffe4e6", "#fae8ff", "#e0f2fe", "#f1f5f9"];

function parseTime(s: string): number | null {
  const m = s.trim().match(/^(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return h * 60 + min;
}
function fmtTime(mins: number): string {
  const h = Math.floor(mins / 60) % 24;
  const m = mins % 60;
  return `${h}:${String(m).padStart(2, "0")}`;
}

function emptyCell(): Cell {
  return { subject: "", room: "", color: "#ffffff" };
}
function makeRow(cols: number): Cell[] {
  return Array.from({ length: cols }, emptyCell);
}

/** Generuje N godzin lekcyjnych od startu, wg długości lekcji i przerwy. */
function buildSlots(count: number, startTime: string, lessonLen: number, breakLen: number): Slot[] {
  let cur = parseTime(startTime) ?? 8 * 60;
  const slots: Slot[] = [];
  for (let i = 0; i < count; i++) {
    const from = cur;
    const to = cur + lessonLen;
    slots.push({ from: fmtTime(from), to: fmtTime(to) });
    cur = to + breakLen;
  }
  return slots;
}

function initialState(): PlanState {
  const startTime = "8:00";
  const lessonLen = 45;
  const breakLen = 10;
  return {
    title: "Plan lekcji",
    subtitle: "Klasa 3A",
    photo: null,
    accent: "#003890",
    saturday: false,
    startTime,
    lessonLen,
    breakLen,
    slots: buildSlots(8, startTime, lessonLen, breakLen),
    cells: Array.from({ length: 8 }, () => makeRow(5)),
  };
}

const STORAGE_KEY = "kalendarzpro-plan-lekcji-v1";

export default function PlanLekcjiEditor() {
  const [state, setState] = useState<PlanState>(initialState);
  const [loaded, setLoaded] = useState(false);
  const [generating, setGenerating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function downloadPdf() {
    setGenerating(true);
    try {
      const { downloadPlanPdf } = await import("@/lib/planPdf");
      await downloadPlanPdf(state);
    } catch {
      alert("Nie udało się wygenerować PDF. Spróbuj ponownie.");
    } finally {
      setGenerating(false);
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...initialState(), ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state, loaded]);

  const cols = state.saturday ? 6 : 5;

  function setCell(r: number, c: number, patch: Partial<Cell>) {
    setState((s) => {
      const cells = s.cells.map((row) => row.slice());
      cells[r][c] = { ...cells[r][c], ...patch };
      return { ...s, cells };
    });
  }

  function recomputeTimes() {
    setState((s) => ({ ...s, slots: buildSlots(s.slots.length, s.startTime, s.lessonLen, s.breakLen) }));
  }

  function addRow() {
    setState((s) => {
      const last = s.slots[s.slots.length - 1];
      const lastTo = last ? parseTime(last.to) : null;
      const from = lastTo != null ? lastTo + s.breakLen : parseTime(s.startTime) ?? 8 * 60;
      return {
        ...s,
        slots: [...s.slots, { from: fmtTime(from), to: fmtTime(from + s.lessonLen) }],
        cells: [...s.cells, makeRow(cols)],
      };
    });
  }
  function removeRow(i: number) {
    setState((s) => ({
      ...s,
      slots: s.slots.filter((_, idx) => idx !== i),
      cells: s.cells.filter((_, idx) => idx !== i),
    }));
  }
  function toggleSaturday() {
    setState((s) => {
      const on = !s.saturday;
      const cells = s.cells.map((row) => (on ? [...row, emptyCell()] : row.slice(0, 5)));
      return { ...s, saturday: on, cells };
    });
  }
  function onPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = () => setState((s) => ({ ...s, photo: String(reader.result) }));
    reader.readAsDataURL(f);
  }
  function reset() {
    if (confirm("Wyczyścić cały plan lekcji?")) setState(initialState());
  }

  return (
    <div>
      {/* PASEK NARZĘDZI */}
      <div className="no-print mb-6 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Tytuł</span>
            <input
              value={state.title}
              onChange={(e) => setState((s) => ({ ...s, title: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Podtytuł (klasa / szkoła)</span>
            <input
              value={state.subtitle}
              onChange={(e) => setState((s) => ({ ...s, subtitle: e.target.value }))}
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-slate-800 focus:border-navy-400 focus:outline-none"
            />
          </label>
        </div>

        {/* USTAWIENIA GODZIN */}
        <div className="mt-3 flex flex-wrap items-end gap-3 rounded-xl bg-slate-50 p-3">
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Początek</span>
            <input
              type="time"
              value={state.startTime.length === 4 ? "0" + state.startTime : state.startTime}
              onChange={(e) => setState((s) => ({ ...s, startTime: e.target.value }))}
              className="rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 focus:border-navy-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Lekcja (min)</span>
            <input
              type="number"
              min={1}
              max={180}
              value={state.lessonLen}
              onChange={(e) => setState((s) => ({ ...s, lessonLen: Math.max(1, Number(e.target.value) || 45) }))}
              className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 focus:border-navy-400 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-medium text-slate-500">Przerwa (min)</span>
            <input
              type="number"
              min={0}
              max={120}
              value={state.breakLen}
              onChange={(e) => setState((s) => ({ ...s, breakLen: Math.max(0, Number(e.target.value) || 0) }))}
              className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-sm text-slate-800 focus:border-navy-400 focus:outline-none"
            />
          </label>
          <button onClick={recomputeTimes} className="rounded-lg bg-navy-600 px-3 py-2 text-sm font-semibold text-white hover:bg-navy-700">
            Przelicz godziny
          </button>
          <span className="text-xs text-slate-500">Możesz też edytować każdą godzinę ręcznie w tabeli.</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button onClick={() => fileRef.current?.click()} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300">
            📷 Wgraj zdjęcie
          </button>
          <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp" onChange={onPhoto} className="hidden" />
          {state.photo && (
            <button onClick={() => setState((s) => ({ ...s, photo: null }))} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-rose-300 hover:text-rose-600">
              Usuń zdjęcie
            </button>
          )}
          <button onClick={addRow} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300">
            ➕ Dodaj lekcję
          </button>
          <button onClick={toggleSaturday} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300">
            {state.saturday ? "➖ Usuń sobotę" : "➕ Dodaj sobotę"}
          </button>
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700">
            Kolor nagłówka
            <input type="color" value={state.accent} onChange={(e) => setState((s) => ({ ...s, accent: e.target.value }))} className="h-6 w-8 cursor-pointer border-0 bg-transparent p-0" />
          </label>
          <button onClick={reset} className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:border-rose-300 hover:text-rose-600">
            Wyczyść
          </button>
          <button
            onClick={downloadPdf}
            disabled={generating}
            className="ml-auto rounded-full bg-brand-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-green-700 disabled:opacity-60"
          >
            {generating ? "Generuję…" : "⬇ Pobierz PDF"}
          </button>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Ustaw godzinę początku, długość lekcji i przerwy, a potem „Przelicz godziny". Kliknij komórkę i wpisz
          przedmiot oraz salę. Kolory pojawiają się po najechaniu na komórkę. Plan zapisuje się automatycznie.
        </p>
      </div>

      {/* ARKUSZ PLANU */}
      <div className="plan-sheet overflow-x-auto rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-4">
          {state.photo && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={state.photo} alt="" className="h-16 w-16 rounded-lg object-cover ring-1 ring-slate-200" />
          )}
          <div>
            <h2 className="text-2xl font-black" style={{ color: state.accent }}>
              {state.title || "Plan lekcji"}
            </h2>
            {state.subtitle && <p className="text-slate-500">{state.subtitle}</p>}
          </div>
        </div>

        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-28 border border-slate-200 px-2 py-2 text-xs font-semibold text-white" style={{ background: state.accent }}>
                Godzina
              </th>
              {Array.from({ length: cols }, (_, c) => (
                <th key={c} className="border border-slate-200 px-2 py-2 text-xs font-semibold text-white" style={{ background: state.accent }}>
                  {DAY_LABELS[c]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {state.slots.map((slot, r) => (
              <tr key={r}>
                <td className="border border-slate-200 px-1 py-1 align-top">
                  <div className="flex items-center gap-1">
                    <span className="no-print w-4 text-center text-[10px] text-slate-500">{r + 1}</span>
                    <div className="flex flex-1 flex-col">
                      <input
                        value={slot.from}
                        onChange={(e) => setState((s) => { const slots = s.slots.slice(); slots[r] = { ...slots[r], from: e.target.value }; return { ...s, slots }; })}
                        placeholder="8:00"
                        className="w-full bg-transparent text-center text-xs font-semibold text-slate-700 outline-none"
                      />
                      <input
                        value={slot.to}
                        onChange={(e) => setState((s) => { const slots = s.slots.slice(); slots[r] = { ...slots[r], to: e.target.value }; return { ...s, slots }; })}
                        placeholder="8:45"
                        className="w-full bg-transparent text-center text-[11px] text-slate-500 outline-none"
                      />
                    </div>
                    <button onClick={() => removeRow(r)} className="no-print text-slate-300 hover:text-rose-500" title="Usuń wiersz">
                      ✕
                    </button>
                  </div>
                </td>
                {Array.from({ length: cols }, (_, c) => {
                  const cell = state.cells[r]?.[c] ?? emptyCell();
                  return (
                    <td key={c} className="group relative border border-slate-200 p-0 align-top" style={{ background: cell.color }}>
                      <input
                        value={cell.subject}
                        onChange={(e) => setCell(r, c, { subject: e.target.value })}
                        placeholder="—"
                        className="w-full bg-transparent px-2 pt-1.5 text-center text-sm font-semibold text-slate-800 outline-none placeholder:text-slate-300"
                      />
                      <input
                        value={cell.room}
                        onChange={(e) => setCell(r, c, { room: e.target.value })}
                        placeholder="sala"
                        className="w-full bg-transparent px-2 pb-1.5 text-center text-[11px] text-slate-500 outline-none placeholder:text-slate-200"
                      />
                      <div className="no-print pointer-events-none absolute right-1 top-1 flex gap-1 opacity-0 transition group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                        {PALETTE.slice(0, 6).map((col) => (
                          <button
                            key={col}
                            onClick={() => setCell(r, c, { color: col })}
                            className="h-3 w-3 rounded-full ring-1 ring-slate-300 hover:scale-125"
                            style={{ background: col }}
                            title="Kolor komórki"
                          />
                        ))}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-3 text-right text-[10px] text-slate-300">wygenerowano na kalendarz.pro</p>
      </div>

      {/* @page landscape tylko dla tej strony */}
      <style>{`.plan-sheet, .plan-sheet * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } @media print { @page { size: A4 landscape; margin: 10mm; } .plan-sheet { border: none !important; box-shadow: none !important; padding: 0 !important; } .plan-sheet input { border: none !important; } }`}</style>
    </div>
  );
}
