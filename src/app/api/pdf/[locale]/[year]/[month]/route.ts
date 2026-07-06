import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { buildMonthData } from "@/lib/calendar";
import { isValidYear, monthSlugToIndex, type Locale } from "@/lib/months";
import { MonthCalendarPdf } from "@/lib/pdfDocument";
import { schoolBreaks } from "@/lib/vacationPlanner";
import { SITE_URL } from "@/lib/site";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ locale: string; year: string; month: string }> },
) {
  const { locale: localeParam, year: yearParam, month: monthParam } = await params;

  // Serwis jest wyłącznie po polsku — wariant EN usunięty.
  if (localeParam !== "pl") {
    return NextResponse.json({ error: "Invalid locale" }, { status: 404 });
  }
  const locale = localeParam as Locale;
  const year = Number(yearParam);
  const monthIndex = monthSlugToIndex(locale, monthParam);

  if (!isValidYear(year) || monthIndex === null) {
    return NextResponse.json({ error: "Invalid year or month" }, { status: 404 });
  }

  const data = buildMonthData(year, monthIndex);

  // Dni wolne od szkoły (wakacje + przerwy świąteczne, niezależne od województwa).
  const breaks = schoolBreaks(year);
  const breakDates = new Set<string>();
  for (const w of data.weeks) {
    for (const day of w) {
      if (breaks.some((b) => day.date >= b.start && day.date <= b.end)) breakDates.add(day.date);
    }
  }

  const qr = await QRCode.toDataURL(SITE_URL, { margin: 0, width: 200, color: { dark: "#003890", light: "#ffffff" } });
  const buffer = await renderToBuffer(MonthCalendarPdf({ data, locale, qr, breakDates }));

  return new NextResponse(buffer as unknown as BodyInit, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="kalendarz-${monthParam}-${year}.pdf"`,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
