"use client";

import { useState } from "react";

// Uniwersalne przyciski „Kopiuj (Excel)" + „Pobierz CSV" dla tabel danych.
// Kopiowanie: TSV do schowka (wkleja się wprost do kolumn Excela).
// CSV: separator „;" + BOM UTF-8 (polskie znaki i kolumny działają w Excelu PL).
export default function TableExport({
  headers,
  rows,
  filename,
  className = "",
}: {
  headers: string[];
  rows: (string | number)[][];
  filename: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const cell = (v: string | number) => String(v ?? "");

  async function copyTsv() {
    const tsv = [headers, ...rows].map((r) => r.map(cell).join("\t")).join("\n");
    try {
      await navigator.clipboard.writeText(tsv);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* schowek niedostępny */
    }
  }

  function downloadCsv() {
    const esc = (v: string | number) => {
      const s = cell(v);
      return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [headers, ...rows].map((r) => r.map(esc).join(";")).join("\r\n");
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <div className={`flex flex-wrap gap-2 no-print ${className}`}>
      <button
        onClick={copyTsv}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600"
      >
        {copied ? "✓ Skopiowano" : "⧉ Kopiuj (Excel)"}
      </button>
      <button
        onClick={downloadCsv}
        className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600"
      >
        ⬇ Pobierz CSV
      </button>
    </div>
  );
}
