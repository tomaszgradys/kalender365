import { renderToBuffer } from "@react-pdf/renderer";
import QRCode from "qrcode";
import { parseYear } from "@/lib/de/year";
import { stateBySlug } from "@/lib/de/bundeslaender";
import { YearDoc } from "@/lib/de/pdf";
import { SITE_URL } from "@/lib/de/site";

export const runtime = "nodejs";

export async function GET(req: Request, { params }: { params: Promise<{ year: string }> }) {
  const { year } = await params;
  const y = parseYear(year);
  if (!y) return new Response("Not found", { status: 404 });

  const landSlug = new URL(req.url).searchParams.get("land");
  const st = landSlug ? stateBySlug(landSlug) : null;
  const state = st ? { code: st.code, name: st.name } : undefined;

  const target = st ? `${SITE_URL}/kalender/${y}/${st.slug}` : `${SITE_URL}/kalender/${y}`;
  const qr = await QRCode.toDataURL(target, { margin: 0, width: 200, color: { dark: "#003890", light: "#ffffff" } });

  const buffer = await renderToBuffer(<YearDoc year={y} state={state} qr={qr} />);
  const suffix = st ? `-${st.slug}` : "";
  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `inline; filename="kalender-${y}${suffix}.pdf"`,
      "Cache-Control": "public, max-age=86400",
    },
  });
}
