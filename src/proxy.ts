import { NextResponse, type NextRequest } from "next/server";

// Groß-/Kleinschreibung in Pfaden vereinheitlichen: /Kalender/2027 → /kalender/2027
// (308). Alle Routen sind kleingeschrieben; Varianten mit Großbuchstaben wären
// Duplikate derselben Seite (Canonical zeigt zwar auf die kleine Form, ein
// Redirect ist für Crawler aber eindeutiger und spart Crawl-Budget).
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (/[A-Z]/.test(pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.toLowerCase();
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}

export const config = {
  // Nur Seitenpfade — keine Assets, API, Next-Internals, Dateien mit Endung.
  matcher: ["/((?!api|_next|og-standard|.*\..*).*)"],
};
