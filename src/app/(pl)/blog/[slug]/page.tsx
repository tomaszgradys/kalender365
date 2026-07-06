import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import FaqSection from "@/components/FaqSection";
import BlogCard from "@/components/blog/BlogCard";
import StructuredArticle from "@/components/blog/StructuredArticle";
import {
  getPostBySlug,
  isSlugPublished,
  getDbPostBySlug,
  relatedSummaries,
  allPublishedSlugs,
  CATEGORY_META,
  type TocItem,
} from "@/lib/blog";
import { formatISODatePL } from "@/lib/format";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { serializeJsonLd } from "@/lib/jsonLd";

export const dynamicParams = true;
export const revalidate = 3600;

export async function generateStaticParams() {
  return (await allPublishedSlugs()).map((slug) => ({ slug }));
}

// Ujednolicony „nagłówek" wpisu (seed lub baza) do metadanych i renderu.
async function resolvePost(slug: string) {
  const seed = getPostBySlug(slug);
  if (seed && isSlugPublished(slug)) {
    return {
      kind: "seed" as const,
      slug: seed.slug,
      title: seed.title,
      metaTitle: seed.metaTitle,
      metaDescription: seed.metaDescription,
      excerpt: seed.excerpt,
      publishedAt: seed.publishedAt,
      updatedAt: seed.updatedAt,
      category: seed.category,
      cover: seed.cover,
      readingMinutes: seed.readingMinutes,
      tags: seed.tags,
      toc: seed.toc,
      faq: seed.faq,
      Body: seed.Body,
    };
  }
  const dbp = await getDbPostBySlug(slug);
  if (dbp) {
    const toc: TocItem[] = dbp.content.sections.map((s, i) => ({ id: `sekcja-${i + 1}`, label: s.h2 }));
    return {
      kind: "db" as const,
      slug: dbp.slug,
      title: dbp.title,
      metaTitle: dbp.metaTitle,
      metaDescription: dbp.metaDescription,
      excerpt: dbp.excerpt,
      publishedAt: dbp.publishedAt,
      updatedAt: undefined as string | undefined,
      category: dbp.category,
      cover: dbp.cover,
      readingMinutes: dbp.readingMinutes,
      tags: dbp.tags,
      toc,
      faq: dbp.faq,
      content: dbp.content,
    };
  }
  return null;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) return {};
  const ogImage = post.cover.src ?? "/brand/og/og-image-1200x630.jpg";
  return {
    title: post.metaTitle,
    description: post.metaDescription,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.metaTitle,
      description: post.metaDescription,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      locale: "pl_PL",
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.cover.alt }],
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await resolvePost(slug);
  if (!post) notFound();

  const cat = CATEGORY_META[post.category];
  const related = await relatedSummaries(post.slug, post.category, 3);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    inLanguage: "pl-PL",
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${post.slug}` },
    author: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/brand/png/web/mark-calendar-color-512.png` },
    },
    image: post.cover.src?.startsWith("http") ? post.cover.src : `${SITE_URL}${post.cover.src ?? "/brand/og/og-image-1200x630.jpg"}`,
    keywords: post.tags.join(", "),
  };

  return (
    <PageWithSidebar related={false}>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ]}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleLd) }} />

      <article>
        <nav className="mb-4 text-sm text-slate-500">
          <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
          <Link href="/blog" className="hover:text-navy-600">Blog</Link> / {cat.label}
        </nav>

        {post.cover.src ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={1216}
            height={640}
            priority
            className="mb-6 aspect-[40/21] w-full rounded-3xl object-cover"
          />
        ) : (
          <div className={`mb-6 flex aspect-[40/16] w-full items-center justify-center rounded-3xl bg-gradient-to-br ${cat.gradient}`}>
            <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white/90">{cat.label}</span>
          </div>
        )}

        <Link href={`/blog/kategoria/${post.category}`} className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">
          {cat.label}
        </Link>
        <h1 className="mt-1 text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">{post.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-400">
          <time dateTime={post.publishedAt}>{formatISODatePL(post.publishedAt)}</time>
          <span>·</span>
          <span>{post.readingMinutes} min czytania</span>
        </div>

        <p className="mt-4 text-lg leading-relaxed text-slate-600">{post.excerpt}</p>

        {post.toc.length > 0 && (
          <nav aria-label="Spis treści" className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Spis treści</p>
            <ol className="space-y-1 text-sm">
              {post.toc.map((t, i) => (
                <li key={t.id}>
                  <a href={`#${t.id}`} className="text-navy-600 hover:text-brand-green-600 hover:underline">
                    {i + 1}. {t.label}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <div className="blog-prose mt-6 max-w-none">
          {post.kind === "seed" ? <post.Body /> : <StructuredArticle content={post.content} />}
        </div>

        {post.faq.length > 0 && <FaqSection items={post.faq} />}

        <aside className="mt-10 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-brand-green-100 bg-brand-green-50 p-5">
          <div>
            <h2 className="text-lg font-bold text-navy-800">Sprawdź kalendarz na kalendarz.pro</h2>
            <p className="mt-1 text-sm text-slate-600">
              Święta, dni wolne, długie weekendy i kalendarz do druku — wszystko w jednym miejscu, za darmo.
            </p>
          </div>
          <Link
            href="/dlugie-weekendy/2026"
            className="rounded-full bg-brand-green-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700"
          >
            Zobacz długie weekendy →
          </Link>
        </aside>
      </article>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-navy-800">Przeczytaj również</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <BlogCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </PageWithSidebar>
  );
}
