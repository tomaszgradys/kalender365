import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { parseYear } from "@/lib/de/year";
import { monthSlugToIndexDE, MONTH_SLUGS_DE } from "@/lib/de/locale";
import { stateBySlug } from "@/lib/de/bundeslaender";
import { MonthDoc } from "@/lib/de/pdf";
import { SITE_URL } from "@/lib/de/site";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ year: string; month: string }> }) {
  const { year, month } = await params;
  const y = parseYear(year);
  const m0 = monthSlugToIndexDE(month);
  if (!y || m0 === null) return new Response("Not found", { status: 404 });

  const landSlug = new URL(req.url).searchParams.get("land");
  const st = landSlug ? stateBySlug(landSlug) : null;
  const state = st ? { code: st.code, name: st.name } : undefined;

  const target = st
    ? `${SITE_URL}/kalender/${MONTH_SLUGS_DE[m0]}-${y}/${st.slug}`
    : `${SITE_URL}/kalender/${MONTH_SLUGS_DE[m0]}-${y}`;
  const qr = await QRCode.toDataURL(target, { margin: 0, width: 200, color: { dark: "#003890", light: "#ffffff" } });

  const buffer = await renderToBuffer(<MonthDoc year={y} month0={m0} state={state} qr={qr} />);
  const suffix = st ? `-${st.slug}` : "";
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="kalender-${MONTH_SLUGS_DE[m0]}-${y}${suffix}.pdf"`,
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
