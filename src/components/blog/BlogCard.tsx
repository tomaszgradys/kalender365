import Link from "next/link";
import Image from "next/image";
import { CATEGORY_META, type PostSummary } from "@/lib/blog";
import { formatISODatePL } from "@/lib/format";

// Kafelek wpisu na listingu / w powiązanych. `featured` = duży kafel (najnowszy).
export default function BlogCard({ post, featured = false }: { post: PostSummary; featured?: boolean }) {
  const cat = CATEGORY_META[post.category];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md ${
        featured ? "sm:col-span-2 sm:flex-row" : ""
      }`}
    >
      <div className={`relative ${featured ? "sm:w-1/2" : ""}`}>
        {post.cover.src ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={640}
            height={336}
            className="aspect-[40/21] w-full object-cover"
          />
        ) : (
          <div className={`flex aspect-[40/21] w-full items-center justify-center bg-gradient-to-br ${cat.gradient}`}>
            <span className="px-4 text-center text-sm font-semibold uppercase tracking-widest text-white/90">
              {cat.label}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">{cat.label}</span>
        <h3 className={`mt-1 font-bold text-navy-800 ${featured ? "text-xl" : "text-base"}`}>{post.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
        <div className="mt-auto flex items-center gap-2 pt-3 text-xs text-slate-400">
          <time dateTime={post.publishedAt}>{formatISODatePL(post.publishedAt)}</time>
          <span>·</span>
          <span>{post.readingMinutes} min czytania</span>
        </div>
      </div>
    </Link>
  );
}
