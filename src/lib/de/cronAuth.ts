// Gemeinsame Autorisierung für die Cron-Endpunkte (Blog-Generierung).
// Vercel Cron sendet `Authorization: Bearer <CRON_SECRET>`; alternativ ist
// `?secret=<CRON_SECRET>` erlaubt (manuelles Auslösen).
//
// WICHTIG (Sicherheit/Kosten): Fehlt CRON_SECRET, wird NUR in der lokalen
// Entwicklung durchgelassen. In Produktion (Vercel) MUSS das Secret gesetzt
// sein — sonst fail-closed (401), damit der Endpunkt nicht öffentlich
// KI-Kosten (Anthropic/fal.ai) auslösen kann.

export function cronAuthorized(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    // In Produktion niemals ohne Secret erlauben.
    const isProd = process.env.VERCEL_ENV === "production" || process.env.NODE_ENV === "production";
    return !isProd;
  }
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true; // Vercel Cron
  const url = new URL(req.url);
  return url.searchParams.get("secret") === secret;
}
