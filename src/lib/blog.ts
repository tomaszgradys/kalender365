import type { ComponentType } from "react";
import { warsawToday } from "./now";
import type { Faq } from "@/components/FaqSection";
import { db, ensureSchema, hasDb } from "./db";

// ── Model bloga kalendarz.pro ────────────────────────────────────────────────
// Artykuły są modułami TSX w src/content/blog/*. Publikacja „co 2 dni" działa
// przez pole publishedAt: wpis staje się widoczny (listing, strona główna,
// sitemap) dopiero gdy jego data <= dziś (wg Warszawy). Dzięki ISR (revalidate)
// nowe wpisy pojawiają się automatycznie — bez crona i bez ręcznego deployu.

export type BlogCategory =
  | "swieta-i-dni-wolne"
  | "planowanie-urlopu"
  | "szkola-i-ferie"
  | "pory-roku-i-sezon"
  | "ksiezyc-i-natura"
  | "tradycje-i-ciekawostki";

export const CATEGORY_META: Record<BlogCategory, { label: string; desc: string; gradient: string }> = {
  "swieta-i-dni-wolne": {
    label: "Święta i dni wolne",
    desc: "Święta państwowe i kościelne, dni ustawowo wolne od pracy i kalendarz obchodów.",
    gradient: "from-navy-600 to-navy-800",
  },
  "planowanie-urlopu": {
    label: "Planowanie urlopu",
    desc: "Długie weekendy, mostki urlopowe i sprytne planowanie wolnego w ciągu roku.",
    gradient: "from-brand-green-600 to-navy-700",
  },
  "szkola-i-ferie": {
    label: "Szkoła i ferie",
    desc: "Kalendarz roku szkolnego, ferie zimowe, wakacje i przerwy świąteczne.",
    gradient: "from-navy-500 to-navy-800",
  },
  "pory-roku-i-sezon": {
    label: "Pory roku i sezon",
    desc: "Zmiana czasu, pory roku, sezonowość i najważniejsze daty w kalendarzu.",
    gradient: "from-navy-600 to-brand-green-700",
  },
  "ksiezyc-i-natura": {
    label: "Księżyc i natura",
    desc: "Fazy księżyca, pełnie, nowie oraz kalendarze ogrodnika i wędkarza.",
    gradient: "from-navy-700 to-navy-900",
  },
  "tradycje-i-ciekawostki": {
    label: "Tradycje i ciekawostki",
    desc: "Imieniny, dni nietypowe, przysłowia i kalendarzowe ciekawostki.",
    gradient: "from-navy-600 to-navy-800",
  },
};

export type TocItem = { id: string; label: string };

export type BlogPost = {
  slug: string;
  /** H1 / tytuł na stronie. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Zajawka na stronie głównej i listingu. */
  excerpt: string;
  /** Data publikacji YYYY-MM-DD (Europe/Warsaw). Wpis widoczny od tej daty. */
  publishedAt: string;
  updatedAt?: string;
  category: BlogCategory;
  tags: string[];
  keyword: string;
  cover: {
    /** Ścieżka do grafiki (fal.ai) w /public. Gdy brak — hero pokazuje gradient. */
    src?: string;
    alt: string;
    /** Prompt do wygenerowania grafiki w fal.ai. */
    prompt: string;
  };
  readingMinutes: number;
  toc: TocItem[];
  faq: Faq[];
  Body: ComponentType;
};

// ── Rejestr artykułów ────────────────────────────────────────────────────────
// Nowe wpisy: dodaj plik w src/content/blog/<slug>.tsx (export `post`) i zaimportuj tutaj.
import { post as dlugieWeekendy2026 } from "@/content/blog/dlugie-weekendy-do-konca-2026";
import { post as rokSzkolny2026 } from "@/content/blog/kalendarz-roku-szkolnego-2026-2027";
import { post as konceWakacji2026 } from "@/content/blog/ile-dni-do-konca-wakacji-2026";
import { post as dniWolne2027 } from "@/content/blog/dni-wolne-od-pracy-2027";

/** Wpisy „seed" (pliki TSX). AI-generowane wpisy dochodzą z bazy — patrz getPublishedPostsAsync(). */
const ALL: BlogPost[] = [dlugieWeekendy2026, rokSzkolny2026, konceWakacji2026, dniWolne2027];

function isPublished(p: BlogPost, today: Date): boolean {
  return new Date(`${p.publishedAt}T00:00:00Z`).getTime() <= today.getTime();
}

/** Opublikowane wpisy (data <= dziś), najnowsze pierwsze. */
export function publishedPosts(): BlogPost[] {
  const today = warsawToday();
  return ALL.filter((p) => isPublished(p, today)).sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function latestPost(): BlogPost | null {
  return publishedPosts()[0] ?? null;
}

export function recentPosts(n: number): BlogPost[] {
  return publishedPosts().slice(0, n);
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return ALL.find((p) => p.slug === slug);
}

/** Czy wpis jest już opublikowany (do 404 na przyszłych wpisach). */
export function isSlugPublished(slug: string): boolean {
  const p = getPostBySlug(slug);
  return !!p && isPublished(p, warsawToday());
}

/** Wszystkie slugi opublikowanych wpisów (generateStaticParams). */
export function publishedSlugs(): string[] {
  return publishedPosts().map((p) => p.slug);
}

export function postsInCategory(category: BlogCategory): BlogPost[] {
  return publishedPosts().filter((p) => p.category === category);
}

/** Powiązane wpisy: ta sama kategoria, potem uzupełnienie najnowszymi. */
export function relatedPosts(slug: string, n = 3): BlogPost[] {
  const post = getPostBySlug(slug);
  const pool = publishedPosts().filter((p) => p.slug !== slug);
  if (!post) return pool.slice(0, n);
  const sameCat = pool.filter((p) => p.category === post.category);
  const rest = pool.filter((p) => p.category !== post.category);
  return [...sameCat, ...rest].slice(0, n);
}

// ── Wpisy generowane przez AI (baza Neon) ────────────────────────────────────
// Treść strukturalna (intro + sekcje + faq + źródła). Linki wewnętrzne są zapisane
// w akapitach jako markdown [tekst](/sciezka) i renderowane przez StructuredArticle.

export type GeneratedContent = {
  intro: string;
  sections: { h2: string; paragraphs: string[] }[];
  takeaways?: string[];
  sources?: { title: string; url: string }[];
};

export type DbBlogPost = {
  slug: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  excerpt: string;
  publishedAt: string;
  category: BlogCategory;
  tags: string[];
  keyword: string;
  cover: { src?: string; alt: string };
  readingMinutes: number;
  faq: Faq[];
  content: GeneratedContent;
};

// Wspólny „nagłówek" wpisu dla listingu/kafelków (plik seed LUB baza).
export type PostSummary = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  category: BlogCategory;
  cover: { src?: string; alt: string };
  readingMinutes: number;
  source: "seed" | "db";
};

function toSummary(p: BlogPost | DbBlogPost, source: "seed" | "db"): PostSummary {
  return {
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    publishedAt: p.publishedAt,
    category: p.category,
    cover: { src: p.cover.src, alt: p.cover.alt },
    readingMinutes: p.readingMinutes,
    source,
  };
}

type BlogRow = {
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  excerpt: string;
  category: string;
  tags: unknown;
  keyword: string | null;
  cover_src: string | null;
  cover_alt: string | null;
  reading_minutes: number;
  content: unknown;
  faq: unknown;
  published_at: string;
};

// Neon zwraca kolumnę `date` czasem jako Date, czasem jako string — normalizujemy
// do „YYYY-MM-DD", żeby nie produkować „Invalid time value" (np. w sitemap).
function toYmd(v: unknown): string {
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  const s = String(v);
  const iso = s.match(/^\d{4}-\d{2}-\d{2}/);
  if (iso) return iso[0];
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? "1970-01-01" : d.toISOString().slice(0, 10);
}

function rowToPost(r: BlogRow): DbBlogPost {
  return {
    slug: r.slug,
    title: r.title,
    metaTitle: r.meta_title,
    metaDescription: r.meta_description,
    excerpt: r.excerpt,
    publishedAt: toYmd(r.published_at),
    category: (r.category in CATEGORY_META ? r.category : "tradycje-i-ciekawostki") as BlogCategory,
    tags: Array.isArray(r.tags) ? (r.tags as string[]) : [],
    keyword: r.keyword ?? "",
    cover: { src: r.cover_src ?? undefined, alt: r.cover_alt ?? r.title },
    readingMinutes: r.reading_minutes || 5,
    faq: (Array.isArray(r.faq) ? r.faq : []) as Faq[],
    content: r.content as GeneratedContent,
  };
}

/** Opublikowane wpisy z bazy (data <= dziś). Pusto, gdy brak bazy/błąd — blog działa dalej na plikach. */
export async function dbPublishedPosts(): Promise<DbBlogPost[]> {
  if (!hasDb()) return [];
  try {
    await ensureSchema();
    const today = warsawToday().toISOString().slice(0, 10);
    const rows = (await db()`SELECT * FROM blog_posts WHERE published_at <= ${today} ORDER BY published_at DESC`) as BlogRow[];
    return rows.map(rowToPost);
  } catch {
    return [];
  }
}

export async function getDbPostBySlug(slug: string): Promise<DbBlogPost | null> {
  if (!hasDb()) return null;
  try {
    await ensureSchema();
    const today = warsawToday().toISOString().slice(0, 10);
    const rows = (await db()`SELECT * FROM blog_posts WHERE slug = ${slug} AND published_at <= ${today} LIMIT 1`) as BlogRow[];
    return rows[0] ? rowToPost(rows[0]) : null;
  } catch {
    return null;
  }
}

export async function dbSlugExists(slug: string): Promise<boolean> {
  if (!hasDb()) return false;
  try {
    await ensureSchema();
    const rows = (await db()`SELECT 1 FROM blog_posts WHERE slug = ${slug} LIMIT 1`) as unknown[];
    return rows.length > 0;
  } catch {
    return false;
  }
}

// ── Widok publiczny: seed (pliki) + baza, scalone i posortowane ───────────────

/** Podsumowania wszystkich opublikowanych wpisów (seed + AI), najnowsze pierwsze. */
export async function getPublishedSummaries(): Promise<PostSummary[]> {
  const seed = publishedPosts().map((p) => toSummary(p, "seed"));
  const dbp = (await dbPublishedPosts()).map((p) => toSummary(p, "db"));
  return [...seed, ...dbp].sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export async function latestSummaries(n: number): Promise<PostSummary[]> {
  return (await getPublishedSummaries()).slice(0, n);
}

export async function summariesInCategory(category: BlogCategory): Promise<PostSummary[]> {
  return (await getPublishedSummaries()).filter((p) => p.category === category);
}

/**
 * Kategorie z co najmniej jednym opublikowanym wpisem. Pustych kategorii NIE
 * linkujemy, NIE dajemy do sitemap i ustawiamy im noindex — inaczej byłyby to
 * indeksowalne strony thin content osłabiające jakość indeksu.
 */
export async function nonEmptyCategories(): Promise<BlogCategory[]> {
  const used = new Set((await getPublishedSummaries()).map((p) => p.category));
  return (Object.keys(CATEGORY_META) as BlogCategory[]).filter((c) => used.has(c));
}

export async function relatedSummaries(slug: string, category: BlogCategory, n = 3): Promise<PostSummary[]> {
  const pool = (await getPublishedSummaries()).filter((p) => p.slug !== slug);
  const same = pool.filter((p) => p.category === category);
  const rest = pool.filter((p) => p.category !== category);
  return [...same, ...rest].slice(0, n);
}

/** Data najnowszego opublikowanego wpisu (seed+DB) — do harmonogramu. */
export async function latestPublishedDate(): Promise<string | null> {
  return (await getPublishedSummaries())[0]?.publishedAt ?? null;
}

/** Wszystkie slugi (seed + AI z bazy) — do generateStaticParams (prebuild przy buildzie). */
export async function allPublishedSlugs(): Promise<string[]> {
  const dbSlugs = (await dbPublishedPosts()).map((p) => p.slug);
  return [...publishedSlugs(), ...dbSlugs];
}
