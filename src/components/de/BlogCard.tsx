import Link from "next/link";
import Image from "next/image";
import { CATEGORY_GRADIENT, type BlogPost } from "@/lib/de/blog";
import { formatLongDE } from "@/lib/de/locale";

// Kachel für einen Blogbeitrag. `featured` = großer Kachel (neuester Beitrag).
export default function BlogCard({ post, featured = false }: { post: BlogPost; featured?: boolean }) {
  const gradient = CATEGORY_GRADIENT[post.category];
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={`group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md ${
        featured ? "sm:col-span-2 sm:flex-row" : ""
      }`}
    >
      <div className={`relative ${featured ? "sm:w-1/2" : ""}`}>
        {post.cover?.src ? (
          <Image
            src={post.cover.src}
            alt={post.cover.alt}
            width={640}
            height={336}
            className="aspect-[40/21] w-full object-cover"
          />
        ) : (
          <div className={`flex aspect-[40/21] w-full items-center justify-center bg-gradient-to-br ${gradient}`}>
            <span className="px-4 text-center text-sm font-semibold uppercase tracking-widest text-white/90">
              {post.category}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-green-600">{post.category}</span>
        <h3 className={`mt-1 font-bold text-navy-800 ${featured ? "text-xl" : "text-base"}`}>{post.title}</h3>
        <p className="mt-1.5 line-clamp-3 text-sm text-slate-600">{post.excerpt}</p>
        <p className="mt-auto pt-3 text-xs text-slate-400">{formatLongDE(post.publishedAt)}</p>
      </div>
    </Link>
  );
}
