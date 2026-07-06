import { neon } from "@neondatabase/serverless";

// Klient Neon (HTTP, idealny na serverless Vercel). DATABASE_URL wstrzykuje Vercel
// w runtime (Storage → Neon). Inicjalizacja leniwa — build nie potrzebuje URL.
// Cała aplikacja działa BEZ bazy (blog z plików seed) — baza dokłada auto-blog,
// panel admina, koszty i blokadę logowania.
let _sql: ReturnType<typeof neon> | null = null;

export function hasDb(): boolean {
  return !!process.env.DATABASE_URL;
}

export function db() {
  if (!_sql) {
    const url = process.env.DATABASE_URL;
    if (!url) throw new Error("Brak DATABASE_URL (baza nie podłączona)");
    _sql = neon(url);
  }
  return _sql;
}

// Idempotentne tworzenie tabel przy pierwszym użyciu (cache w instancji).
let _schema: Promise<void> | null = null;
export function ensureSchema(): Promise<void> {
  if (_schema) return _schema;
  const sql = db();
  _schema = (async () => {
    await sql`CREATE TABLE IF NOT EXISTS blog_posts (
      slug text PRIMARY KEY,
      title text NOT NULL,
      meta_title text NOT NULL,
      meta_description text NOT NULL,
      excerpt text NOT NULL,
      category text NOT NULL,
      tags jsonb NOT NULL DEFAULT '[]',
      keyword text,
      cover_src text,
      cover_alt text,
      reading_minutes int NOT NULL DEFAULT 5,
      content jsonb NOT NULL,
      faq jsonb NOT NULL DEFAULT '[]',
      published_at date NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS blog_gen_log (
      id serial PRIMARY KEY,
      slug text,
      ok boolean NOT NULL,
      cost_usd numeric,
      input_tokens int,
      output_tokens int,
      web_searches int,
      error text,
      created_at timestamptz NOT NULL DEFAULT now()
    )`;
    await sql`CREATE TABLE IF NOT EXISTS login_attempts (
      ip text PRIMARY KEY,
      fails int NOT NULL DEFAULT 0,
      locked_until timestamptz,
      updated_at timestamptz NOT NULL DEFAULT now()
    )`;
  })();
  return _schema;
}
