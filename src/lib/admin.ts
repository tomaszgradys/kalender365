import { cookies } from "next/headers";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Dostęp do panelu kalendarz.pro: login + hasło. Domyślnie login „kalendarz.pro" i
// hasło zaszyte jako SHA-256 (jawny tekst nie leży w repo). Nadpisywalne zmiennymi
// ADMIN_LOGIN / ADMIN_PASSWORD w Vercel (mają pierwszeństwo).
const COOKIE = "kpanel";
const DEFAULT_LOGIN = "kalendarz.pro";
const DEFAULT_PW_HASH = "50d08032f9aedfc9dd7ee94541a85e86ed2f8ad383cdd1a39c4a29a251c2e6a7"; // sha256("Zawonia2025!")

function sha256(s: string): string {
  return createHash("sha256").update(s).digest("hex");
}
function adminLogin(): string {
  return (process.env.ADMIN_LOGIN || DEFAULT_LOGIN).trim().toLowerCase();
}
function pwHash(): string {
  const env = process.env.ADMIN_PASSWORD;
  return env ? sha256(env) : DEFAULT_PW_HASH;
}

// Porównanie odporne na atak czasowy (stała długość — hashe hex).
function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  return ba.length === bb.length && timingSafeEqual(ba, bb);
}

export function checkCredentials(login: string, password: string): boolean {
  const okLogin = safeEqual(String(login ?? "").trim().toLowerCase(), adminLogin());
  const okPw = safeEqual(sha256(String(password ?? "")), pwHash());
  return okLogin && okPw;
}

// Sekret serwera do podpisu sesji — token nie da się odtworzyć bez niego (nawet znając
// hasło). Reużywamy CRON_SECRET (ustawiony w Vercel); PANEL_SECRET ma pierwszeństwo.
function serverSecret(): string {
  return process.env.PANEL_SECRET || process.env.CRON_SECRET || "kalendarz-panel-fallback";
}

// Token ciasteczka związany z loginem, hasłem i sekretem — zmiana hasła/sekretu unieważnia sesje.
function token(): string {
  return createHmac("sha256", serverSecret()).update(`kalendarz-panel:${adminLogin()}:${pwHash()}`).digest("base64url");
}

export async function isAdmin(): Promise<boolean> {
  const c = (await cookies()).get(COOKIE)?.value;
  return !!c && c === token();
}

export async function setAdminCookie() {
  (await cookies()).set(COOKIE, token(), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearAdminCookie() {
  (await cookies()).delete(COOKIE);
}
