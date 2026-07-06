"use client";

import { useState } from "react";
import { SITE_URL } from "@/lib/site";

async function toDataURL(path: string): Promise<string | null> {
  try {
    const res = await fetch(path);
    const blob = await res.blob();
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onload = () => resolve(String(r.result));
      r.onerror = () => resolve(null);
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export default function ExportPdfButton({
  filename = "kalendarz-pro",
  label = "⬇ Pobierz PDF",
  className,
  target = ".pdf-capture",
}: {
  filename?: string;
  label?: string;
  className?: string;
  target?: string;
}) {
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const el =
        (document.querySelector(target) as HTMLElement | null) ||
        (document.querySelector(".min-w-0.flex-1") as HTMLElement | null) ||
        document.body;

      const [h2c, jspdfMod, qrMod] = await Promise.all([
        import("html2canvas-pro"),
        import("jspdf"),
        import("qrcode"),
      ]);
      const html2canvas = h2c.default;
      const JsPDF = jspdfMod.jsPDF;
      const QRCode = qrMod.default ?? qrMod;

      const canvas = await html2canvas(el, {
        scale: 2,
        backgroundColor: "#ffffff",
        useCORS: true,
        ignoreElements: (n) => n.classList?.contains("no-print"),
      });

      const pdf = new JsPDF({ unit: "pt", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth();
      const ph = pdf.internal.pageSize.getHeight();
      const margin = 28;
      const footerH = 44;
      const usableH = ph - margin - footerH;
      const imgW = pw - margin * 2;

      const qr = await QRCode.toDataURL(SITE_URL, {
        margin: 0,
        width: 120,
        color: { dark: "#003890", light: "#ffffff" },
      });
      const logo = await toDataURL("/brand/png/web/mark-calendar-color-128.png");

      // px canvasu na 1 pt oraz wysokość obszaru treści w px canvasu
      const pxPerPt = canvas.width / imgW;
      const usableHpx = usableH * pxPerPt;
      const ctx = canvas.getContext("2d", { willReadFrequently: true }) as CanvasRenderingContext2D | null;

      // Szukamy „czystego" (białego) wiersza tuż nad idealną granicą strony,
      // żeby nie przecinać kart/wierszy w połowie (płynniejsze przejście na kolejną stronę).
      const searchWindow = Math.max(8, Math.round(usableHpx * 0.2));
      function findBreak(idealEnd: number): number {
        if (!ctx || idealEnd >= canvas.height) return Math.min(idealEnd, canvas.height);
        const top = Math.max(0, Math.round(idealEnd - searchWindow));
        const bandH = Math.round(idealEnd) - top;
        if (bandH <= 0) return idealEnd;
        let data: Uint8ClampedArray;
        try {
          data = ctx.getImageData(0, top, canvas.width, bandH).data;
        } catch {
          return idealEnd; // np. tainted canvas — twarde cięcie
        }
        const step = 6; // próbkuj co 6 px w poziomie (wydajność)
        for (let ry = bandH - 1; ry >= 0; ry--) {
          let blank = true;
          for (let x = 0; x < canvas.width; x += step) {
            const i = (ry * canvas.width + x) * 4;
            if (data[i] < 244 || data[i + 1] < 244 || data[i + 2] < 244) {
              blank = false;
              break;
            }
          }
          if (blank) return top + ry;
        }
        return idealEnd; // brak białej przerwy — twarde cięcie (nieuniknione dla dużych bloków)
      }

      let startPx = 0;
      let first = true;
      while (startPx < canvas.height - 1) {
        let endPx = findBreak(Math.min(startPx + usableHpx, canvas.height));
        if (endPx <= startPx + 4) endPx = Math.min(startPx + usableHpx, canvas.height); // wymuś postęp
        const sliceH = Math.max(1, Math.round(endPx - startPx));

        // wytnij fragment na osobny canvas (białe tło)
        const tmp = document.createElement("canvas");
        tmp.width = canvas.width;
        tmp.height = sliceH;
        const tctx = tmp.getContext("2d")!;
        tctx.fillStyle = "#ffffff";
        tctx.fillRect(0, 0, tmp.width, tmp.height);
        tctx.drawImage(canvas, 0, startPx, canvas.width, sliceH, 0, 0, canvas.width, sliceH);
        const sliceData = tmp.toDataURL("image/jpeg", 0.92);
        const sliceHpt = sliceH / pxPerPt;

        if (!first) pdf.addPage();
        first = false;
        pdf.addImage(sliceData, "JPEG", margin, margin, imgW, sliceHpt, undefined, "FAST");

        // stopka: logo + tekst (lewa), QR (prawa)
        const fy = ph - footerH + 10;
        if (logo) pdf.addImage(logo, "PNG", margin, fy, 16, 16);
        pdf.setFontSize(8);
        pdf.setTextColor(148, 163, 184);
        pdf.text("wygenerowano na kalendarz.pro", margin + (logo ? 22 : 0), fy + 11);
        if (qr) pdf.addImage(qr, "PNG", pw - margin - 28, ph - footerH + 6, 28, 28);
        pdf.text("kalendarz.pro", pw - margin - 28, ph - 4, { align: "left" } as never);

        startPx = endPx;
      }

      pdf.save(`${filename}.pdf`);
    } catch (e) {
      console.error("PDF export failed", e);
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={run}
      disabled={busy}
      className={
        className ||
        "rounded-full bg-brand-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-green-700 disabled:opacity-60"
      }
    >
      {busy ? "Generuję…" : label}
    </button>
  );
}
