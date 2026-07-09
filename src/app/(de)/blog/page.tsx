import Link from "next/link";
import type { Metadata } from "next";
import BlogCard from "@/components/de/BlogCard";
import BlogPagination from "@/components/de/BlogPagination";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import { getBlogPage } from "@/lib/de/blogPaging";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Blog – Ratgeber zu Kalender, Feiertagen & Urlaub",
  description:
    "Ratgeber und Wissenswertes rund um Kalender, Feiertage, Schulferien, Brückentage, Kalenderwochen und Zeitumstellung in Deutschland.",
  alternates: { canonical: "/blog" },
};

export default async function BlogIndexPage() {
  const { posts, page, totalPages } = await getBlogPage(1);
  const [lead, ...rest] = posts;

  return (
    <main className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Blog</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Blog</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Ratgeber und Wissenswertes rund um Kalender, Feiertage, Schulferien, Brückentage und Zeit.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lead && <BlogCard post={lead} featured />}
          {rest.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>

        <BlogPagination page={page} totalPages={totalPages} />
      </PageWithSidebar>
    </main>
  );
}
