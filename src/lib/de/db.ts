// Neon (serverless Postgres) access for AI-generated blog posts.
// Table `de_posts`. Everything is a no-op / empty when DATABASE_URL is unset,
// so the site (and the seed blog) works without a database.

import { neon } from "@neondatabase/serverless";
import type { BlogPost, BlogCategory } from "./blog";

function sqlOrNull() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  return neon(url);
}
type Sql = NonNullable<ReturnType<typeof sqlOrNull>>;

let ensured = false;
async function ensureTable(sql: Sql) {
  if (ensured) return;
  await sql`
    CREATE TABLE IF NOT EXISTS de_posts (
      slug TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      category TEXT NOT NULL,
      body_html TEXT NOT NULL,
      published_at DATE NOT NULL DEFAULT CURRENT_DATE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      cover_src TEXT,
      cover_alt TEXT
    )`;
  await sql`ALTER TABLE de_posts ADD COLUMN IF NOT EXISTS cover_src TEXT`;
  await sql`ALTER TABLE de_posts ADD COLUMN IF NOT EXISTS cover_alt TEXT`;
  ensured = true;
}

export async function getDbPosts(): Promise<BlogPost[]> {
  const sql = sqlOrNull();
  if (!sql) return [];
  await ensureTable(sql);
  const rows = (await sql`
    SELECT slug, title, excerpt, category, body_html, to_char(published_at, 'YYYY-MM-DD') AS published_at, cover_src, cover_alt
    FROM de_posts ORDER BY published_at DESC, created_at DESC`) as Record<string, string | null>[];
  return rows.map((r) => ({
    slug: r.slug as string,
    title: r.title as string,
    excerpt: r.excerpt as string,
    category: r.category as BlogCategory,
    bodyHtml: r.body_html as string,
    publishedAt: r.published_at as string,
    source: "ai" as const,
    cover: r.cover_src ? { src: r.cover_src, alt: r.cover_alt || (r.title as string) } : undefined,
  }));
}

export async function insertDbPost(p: Omit<BlogPost, "source">): Promise<void> {
  const sql = sqlOrNull();
  if (!sql) throw new Error("DATABASE_URL not configured");
  await ensureTable(sql);
  await sql`
    INSERT INTO de_posts (slug, title, excerpt, category, body_html, published_at, cover_src, cover_alt)
    VALUES (${p.slug}, ${p.title}, ${p.excerpt}, ${p.category}, ${p.bodyHtml}, ${p.publishedAt}, ${p.cover?.src ?? null}, ${p.cover?.alt ?? null})
    ON CONFLICT (slug) DO NOTHING`;
}

export async function updateDbPostCover(slug: string, cover: { src: string; alt: string }): Promise<void> {
  const sql = sqlOrNull();
  if (!sql) throw new Error("DATABASE_URL not configured");
  await ensureTable(sql);
  await sql`UPDATE de_posts SET cover_src = ${cover.src}, cover_alt = ${cover.alt} WHERE slug = ${slug}`;
}

export async function postsMissingCover(): Promise<{ slug: string; title: string }[]> {
  const sql = sqlOrNull();
  if (!sql) return [];
  await ensureTable(sql);
  const rows = (await sql`SELECT slug, title FROM de_posts WHERE cover_src IS NULL`) as { slug: string; title: string }[];
  return rows;
}

export async function existingSlugs(): Promise<Set<string>> {
  const sql = sqlOrNull();
  if (!sql) return new Set();
  await ensureTable(sql);
  const rows = (await sql`SELECT slug FROM de_posts`) as { slug: string }[];
  return new Set(rows.map((r) => r.slug));
}

export function dbConfigured(): boolean {
  return !!process.env.DATABASE_URL;
}
