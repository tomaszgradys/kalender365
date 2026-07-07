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
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )`;
  ensured = true;
}

export async function getDbPosts(): Promise<BlogPost[]> {
  const sql = sqlOrNull();
  if (!sql) return [];
  await ensureTable(sql);
  const rows = (await sql`
    SELECT slug, title, excerpt, category, body_html, to_char(published_at, 'YYYY-MM-DD') AS published_at
    FROM de_posts ORDER BY published_at DESC, created_at DESC`) as Record<string, string>[];
  return rows.map((r) => ({
    slug: r.slug,
    title: r.title,
    excerpt: r.excerpt,
    category: r.category as BlogCategory,
    bodyHtml: r.body_html,
    publishedAt: r.published_at,
    source: "ai" as const,
  }));
}

export async function insertDbPost(p: Omit<BlogPost, "source">): Promise<void> {
  const sql = sqlOrNull();
  if (!sql) throw new Error("DATABASE_URL not configured");
  await ensureTable(sql);
  await sql`
    INSERT INTO de_posts (slug, title, excerpt, category, body_html, published_at)
    VALUES (${p.slug}, ${p.title}, ${p.excerpt}, ${p.category}, ${p.bodyHtml}, ${p.publishedAt})
    ON CONFLICT (slug) DO NOTHING`;
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
