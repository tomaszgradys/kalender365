import Link from "next/link";
import type { Metadata } from "next";
import BlogCard from "@/components/de/BlogCard";
import BlogPagination from "@/components/de/BlogPagination";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import { getBlogPage } from "@/lib/de/blogPaging";
import { BLOG_CATEGORIES, categorySlug } from "@/lib/de/blog";
import { ogMeta } from "@/lib/de/ogMeta";

export const revalidate = 600;

export const metadata: Metadata = {
  title: "Blog – Ratgeber zu Kalender, Feiertagen & Urlaub",
  description:
    "Ratgeber und Wissenswertes rund um Kalender, Feiertage, Schulferien, Brückentage, Kalenderwochen und Zeitumstellung in Deutschland.",
  alternates: { canonical: "/blog" },
  openGraph: ogMeta("/blog", { defaultImage: true }),
};

export default async function BlogIndexPage() {
  const { posts, page, totalPages } = await getBlogPage(1);
  const [lead, ...rest] = posts;

  return (
    <div className="flex-1">
      <PageWithSidebar>
        <nav className="mb-4 text-sm text-slate-500"><Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span> <span className="text-navy-700">Blog</span></nav>
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Blog</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Ratgeber und Wissenswertes rund um Kalender, Feiertage, Schulferien, Brückentage und Zeit.</p>

        <nav className="mt-5 flex flex-wrap gap-2" aria-label="Blog-Themen">
          {BLOG_CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/blog/kategorie/${categorySlug(c)}`}
              className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600 hover:border-navy-300 hover:text-navy-700"
            >
              {c}
            </Link>
          ))}
        </nav>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lead && <BlogCard post={lead} featured />}
          {rest.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>

        <BlogPagination page={page} totalPages={totalPages} />
      </PageWithSidebar>
    </div>
  );
}
