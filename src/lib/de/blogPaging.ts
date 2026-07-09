// Blog-Paginierung. Der Auto-Blog wächst täglich; ohne Seitenaufteilung würde
// /blog irgendwann Hunderte Karten (mit Cover-Bildern) auf einmal laden → LCP/
// Seitengewicht leiden. Pfadbasiert (/blog = Seite 1, /blog/seite/N ab N≥2), damit
// jede Seite ein sauberes Self-Canonical hat — ohne ?page=-Parameter.

import { getAllPosts, type BlogPost } from "./blog";

export const BLOG_PAGE_SIZE = 12;

/** Pfad zur Blog-Seite N (Seite 1 = /blog, ohne Seiten-Suffix). */
export const blogPagePath = (p: number): string => (p <= 1 ? "/blog" : `/blog/seite/${p}`);

export function pageCount(total: number): number {
  return Math.max(1, Math.ceil(total / BLOG_PAGE_SIZE));
}

export type BlogPageData = {
  posts: BlogPost[];
  page: number;
  totalPages: number;
  total: number;
};

/** Beiträge für eine Seite (1-basiert). Seite wird auf [1..totalPages] geklemmt. */
export async function getBlogPage(page: number): Promise<BlogPageData> {
  const all = await getAllPosts();
  const totalPages = pageCount(all.length);
  const p = Math.min(Math.max(1, Math.trunc(page) || 1), totalPages);
  const start = (p - 1) * BLOG_PAGE_SIZE;
  return { posts: all.slice(start, start + BLOG_PAGE_SIZE), page: p, totalPages, total: all.length };
}

/** Alle Seitennummern ≥ 2 (für generateStaticParams / Sitemap). */
export async function blogPageNumbers(): Promise<number[]> {
  const all = await getAllPosts();
  const total = pageCount(all.length);
  const out: number[] = [];
  for (let p = 2; p <= total; p++) out.push(p);
  return out;
}
