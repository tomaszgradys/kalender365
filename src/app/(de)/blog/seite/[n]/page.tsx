import Link from "next/link";
import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import BlogCard from "@/components/de/BlogCard";
import BlogPagination from "@/components/de/BlogPagination";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import { getBlogPage, blogPageNumbers, pageCount, BLOG_PAGE_SIZE } from "@/lib/de/blogPaging";
import { getAllPosts } from "@/lib/de/blog";
import { ogMeta } from "@/lib/de/ogMeta";

export const revalidate = 600;

// Nur die aktuell existierenden Seiten ≥ 2 vorrendern; weitere entstehen on-demand
// (dynamicParams=default) mit ISR, sobald der Auto-Blog wächst.
export async function generateStaticParams() {
  return (await blogPageNumbers()).map((n) => ({ n: String(n) }));
}

function parsePage(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const n = Number(raw);
  return n >= 1 ? n : null;
}

export async function generateMetadata({ params }: { params: Promise<{ n: string }> }): Promise<Metadata> {
  const { n } = await params;
  const p = parsePage(n);
  if (!p || p < 2) return {};
  const total = pageCount((await getAllPosts()).length);
  if (p > total) return {};
  return {
    title: `Blog – Seite ${p} von ${total} | Kalender, Feiertage & Urlaub`,
    description: `Weitere Ratgeber und Artikel rund um Kalender, Feiertage, Schulferien und Zeit – Seite ${p} von ${total}.`,
    alternates: { canonical: `/blog/seite/${p}` },
    openGraph: ogMeta(`/blog/seite/${p}`, { defaultImage: true }),
  };
}

export default async function BlogSeitePage({ params }: { params: Promise<{ n: string }> }) {
  const { n } = await params;
  const p = parsePage(n);
  if (!p) notFound();
  if (p === 1) permanentRedirect("/blog"); // Seite 1 lebt unter /blog (308, kein Duplikat).

  const { posts, page, totalPages, total } = await getBlogPage(p);
  // Angeforderte Seite jenseits der letzten → 404 (keine leere, dünne Seite).
  if (p > totalPages) notFound();

  const first = (page - 1) * BLOG_PAGE_SIZE + 1;
  const last = Math.min(page * BLOG_PAGE_SIZE, total);

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
          <Link href="/blog" className="hover:text-navy-600">Blog</Link> <span className="mx-1">/</span>
          <span className="text-navy-700">Seite {page}</span>
        </nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Blog – Seite {page}</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Beiträge {first}–{last} von {total} rund um Kalender, Feiertage, Schulferien und Zeit.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>

        <BlogPagination page={page} totalPages={totalPages} />
      </PageWithSidebar>
    </div>
  );
}
