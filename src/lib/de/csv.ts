// Simple CSV builder. Uses ';' as delimiter (German Excel default) and a UTF-8
// BOM so Excel shows umlauts correctly.

function cell(v: string | number): string {
  let s = String(v);
  // CSV-Formel-Injection abwehren: Zellen, die mit = + - @ (oder Tab/CR)
  // beginnen, könnte Excel/Sheets als Formel auswerten. Ein führendes
  // Hochkomma neutralisiert das. Defense-in-depth — aktuell sind alle Werte
  // statische Feiertagsnamen, aber so bleibt der Export sicher, falls je
  // nutzergenerierte Inhalte hineinfließen.
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return /[";\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export function buildCSV(headers: string[], rows: (string | number)[][]): string {
  const lines = [headers.map(cell).join(";"), ...rows.map((r) => r.map(cell).join(";"))];
  return "﻿" + lines.join("\r\n") + "\r\n";
}

export function csvResponse(filename: string, body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
