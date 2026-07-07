import Link from "next/link";
import type { Metadata } from "next";
import { getAllPosts } from "@/lib/de/blog";
import { formatLongDE } from "@/lib/de/locale";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Blog – Ratgeber zu Kalender, Feiertagen & Urlaub",
  description:
    "Ratgeber und Wissenswertes rund um Kalender, Feiertage, Schulferien, Brückentage, Kalenderwochen und Zeitumstellung in Deutschland.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const [lead, ...rest] = posts;

  return (
    <main className="flex-1">
      <div className="mx-auto w-full max-w-5xl px-4 py-8">
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Blog</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Blog</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Ratgeber und Wissenswertes rund um Kalender, Feiertage, Schulferien, Brückentage und Zeit.</p>

        {lead && (
          <Link href={`/blog/${lead.slug}`} className="mt-6 block rounded-2xl border border-slate-200 bg-white p-6 transition hover:border-navy-300 hover:shadow-md">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">{lead.category}</span>
            <h2 className="mt-1 text-xl font-bold text-navy-800">{lead.title}</h2>
            <p className="mt-2 text-slate-600">{lead.excerpt}</p>
            <p className="mt-3 text-xs text-slate-400">{formatLongDE(lead.publishedAt)}</p>
          </Link>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => (
            <Link key={p.slug} href={`/blog/${p.slug}`} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-navy-300 hover:shadow-md">
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">{p.category}</span>
              <h2 className="mt-1 font-bold text-navy-800">{p.title}</h2>
              <p className="mt-2 flex-1 text-sm text-slate-600">{p.excerpt}</p>
              <p className="mt-3 text-xs text-slate-400">{formatLongDE(p.publishedAt)}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
