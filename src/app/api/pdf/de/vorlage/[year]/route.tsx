import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { parseYear } from "@/lib/de/year";
import { stateBySlug } from "@/lib/de/bundeslaender";
import { YearDoc, PlannerDoc, HalfYearDoc } from "@/lib/de/pdf";
import { SITE_URL } from "@/lib/de/site";

export const runtime = "nodejs";

// Flexible PDF-Vorlagen: /api/pdf/de/vorlage/2026?typ=jahresplaner&land=bayern
// typ ∈ jahr-quer | jahr-hoch | jahresplaner | halbjahr (Standard: jahr-quer)
const TYPES = new Set(["jahr-quer", "jahr-hoch", "jahresplaner", "halbjahr"]);

export async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return new Response("Not found", { status: 404 });

  const sp = new URL(req.url).searchParams;
  const typRaw = sp.get("typ") ?? "jahr-quer";
  const typ = TYPES.has(typRaw) ? typRaw : "jahr-quer";

  const st = sp.get("land") ? stateBySlug(sp.get("land")!) : null;
  const state = st ? { code: st.code, name: st.name } : undefined;

  const target = st ? `${SITE_URL}/kalender/${y}/${st.slug}` : `${SITE_URL}/kalender/${y}`;
  const qr = await QRCode.toDataURL(target, { margin: 0, width: 200, color: { dark: "#003890", light: "#ffffff" } });

  const doc =
    typ === "jahresplaner" ? <PlannerDoc year={y} state={state} qr={qr} /> :
    typ === "halbjahr" ? <HalfYearDoc year={y} state={state} qr={qr} /> :
    typ === "jahr-hoch" ? <YearDoc year={y} state={state} qr={qr} orientation="hoch" /> :
    <YearDoc year={y} state={state} qr={qr} orientation="quer" />;

  const buffer = await renderToBuffer(doc);
  const suffix = st ? `-${st.slug}` : "";
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="kalender-${y}-${typ}${suffix}.pdf"`,
      "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
