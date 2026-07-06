import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { buildMonthData } from "@/lib/calendar";
import { isValidYear } from "@/lib/months";
import { YearCalendarPdf } from "@/lib/pdfDocument";
import { schoolBreaks } from "@/lib/vacationPlanner";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

// Kalendarz roczny na jednej stronie A4 (12 mini-miesięcy, kolory, logo + QR).
export async function GET(_req: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year: yearParam } = await params;
  const year = Number(yearParam);
  if (!isValidYear(year)) {
    return NextResponse.json({ error: "Invalid year" }, { status: 404 });
  }

  const months = Array.from({ length: 12 }, (_, m) => buildMonthData(year, m));

  const breaks = schoolBreaks(year);
  const breakDates = new Set<string>();
  for (const data of months) {
    for (const w of data.weeks) {
      for (const day of w) {
        if (breaks.some((b) => day.date >= b.start && day.date <= b.end)) breakDates.add(day.date);
      }
    }
  }

  const qr = await QRCode.toDataURL(`${SITE_URL}/kalendarz/${year}`, {
    margin: 0,
    width: 200,
    color: { dark: "#003890", light: "#ffffff" },
  });
  const buffer = await renderToBuffer(YearCalendarPdf({ year, months, breakDates, qr, locale: "pl" }));

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="kalendarz-${year}.pdf"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
