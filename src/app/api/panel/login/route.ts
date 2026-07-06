import { NextResponse } from "next/server";
import { checkCredentials, setAdminCookie, clearAdminCookie } from "@/lib/admin";
import { db, ensureSchema, hasDb } from "@/lib/db";

export const runtime = "nodejs";

const MAX_FAILS = 5;
const LOCK_MINUTES = 15;

function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  return (xff?.split(",")[0] || request.headers.get("x-real-ip") || "unknown").trim();
}

// Awaryjna blokada w pamięci instancji — używana, gdy nie ma bazy (Neon). Słabsza
// (per-instancja serverless), ale utrudnia brute-force zanim podłączymy DATABASE_URL.
const memFails = new Map<string, { fails: number; lockedUntil: number }>();
function memLockLeft(ip: string): number {
  const e = memFails.get(ip);
  if (e && e.lockedUntil > Date.now()) return Math.ceil((e.lockedUntil - Date.now()) / 1000);
  return 0;
}
function memRegisterFail(ip: string): { locked: boolean; remaining: number } {
  const e = memFails.get(ip) ?? { fails: 0, lockedUntil: 0 };
  e.fails += 1;
  if (e.fails >= MAX_FAILS) {
    e.lockedUntil = Date.now() + LOCK_MINUTES * 60_000;
    e.fails = 0;
    memFails.set(ip, e);
    return { locked: true, remaining: 0 };
  }
  memFails.set(ip, e);
  return { locked: false, remaining: MAX_FAILS - e.fails };
}

export async function POST(request: Request) {
  const { login, password } = await request.json().catch(() => ({}));
  const ip = clientIp(request);

  // Blokada po nieudanych próbach (działa gdy podłączona baza).
  let dbReady = false;
  if (hasDb()) {
    try {
      await ensureSchema();
      dbReady = true;
      const rows = (await db()`SELECT fails, locked_until FROM login_attempts WHERE ip = ${ip}`) as {
        fails?: number; locked_until?: string;
      }[];
      const row = rows[0];
      if (row?.locked_until) {
        const left = Math.ceil((new Date(row.locked_until).getTime() - Date.now()) / 1000);
        if (left > 0) return NextResponse.json({ ok: false, error: "locked", retryAfter: left }, { status: 429 });
      }
    } catch {
      /* baza niedostępna — logujemy bez blokady */
    }
  }

  // Bez bazy: sprawdź blokadę w pamięci.
  if (!dbReady) {
    const left = memLockLeft(ip);
    if (left > 0) return NextResponse.json({ ok: false, error: "locked", retryAfter: left }, { status: 429 });
  }

  if (checkCredentials(String(login ?? ""), String(password ?? ""))) {
    if (dbReady) { try { await db()`DELETE FROM login_attempts WHERE ip = ${ip}`; } catch {} }
    else memFails.delete(ip);
    await setAdminCookie();
    return NextResponse.json({ ok: true });
  }

  let remaining = MAX_FAILS - 1;
  if (!dbReady) {
    const r = memRegisterFail(ip);
    if (r.locked) return NextResponse.json({ ok: false, error: "locked", retryAfter: LOCK_MINUTES * 60 }, { status: 429 });
    return NextResponse.json({ ok: false, error: "bad", remaining: r.remaining }, { status: 401 });
  }
  if (dbReady) {
    try {
      const r = (await db()`INSERT INTO login_attempts (ip, fails, updated_at)
        VALUES (${ip}, 1, now())
        ON CONFLICT (ip) DO UPDATE SET fails = login_attempts.fails + 1, updated_at = now()
        RETURNING fails`) as { fails?: number }[];
      const fails = Number(r[0]?.fails ?? 1);
      remaining = Math.max(0, MAX_FAILS - fails);
      if (fails >= MAX_FAILS) {
        const until = new Date(Date.now() + LOCK_MINUTES * 60_000);
        await db()`UPDATE login_attempts SET locked_until = ${until.toISOString()}, fails = 0 WHERE ip = ${ip}`;
        return NextResponse.json({ ok: false, error: "locked", retryAfter: LOCK_MINUTES * 60 }, { status: 429 });
      }
    } catch {
      /* ignoruj */
    }
  }

  return NextResponse.json({ ok: false, error: "bad", remaining }, { status: 401 });
}

export async function DELETE() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
