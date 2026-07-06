import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import BlogCard from "@/components/blog/BlogCard";
import { CATEGORY_META, summariesInCategory, type BlogCategory } from "@/lib/blog";

export const revalidate = 3600;

const CATEGORIES = Object.keys(CATEGORY_META) as BlogCategory[];

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category }));
}

function isCategory(value: string): value is BlogCategory {
  return (CATEGORIES as string[]).includes(value);
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;
  if (!isCategory(category)) return {};
  const meta = CATEGORY_META[category];
  // Kategoria bez wpisów = thin content → noindex,follow (crawler przejdzie po linkach,
  // ale strony nie indeksujemy, dopóki nie ma realnej treści).
  const isEmpty = (await summariesInCategory(category)).length === 0;
  return {
    title: `${meta.label} — blog kalendarz.pro`,
    description: meta.desc,
    alternates: { canonical: `/blog/kategoria/${category}` },
    ...(isEmpty ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function BlogCategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  if (!isCategory(category)) notFound();
  const meta = CATEGORY_META[category];
  const posts = await summariesInCategory(category);

  return (
    <PageWithSidebar>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: meta.label, path: `/blog/kategoria/${category}` },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/blog" className="hover:text-navy-600">Blog</Link> / {meta.label}
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">{meta.label}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{meta.desc}</p>

      {posts.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-slate-50 p-6 text-slate-500">
          W tej kategorii nie ma jeszcze wpisów. Zajrzyj na <Link href="/blog" className="font-semibold text-navy-600">bloga</Link>.
        </p>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {posts.map((p) => (
            <BlogCard key={p.slug} post={p} />
          ))}
        </div>
      )}
    </PageWithSidebar>
  );
}
