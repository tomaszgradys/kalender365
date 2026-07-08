import type { ReactNode } from "react";

/**
 * Long-form SEO copy block. A block is a heading (H2) plus one or more
 * paragraphs. Keeps the ranking text visually calm and consistent across
 * pages, and clearly separated from the interactive tools above it.
 *
 * Paragraph entries may be strings or ReactNodes (for inline links).
 */
export type ProseBlock = { h2: string; p: Array<string | ReactNode> };

export default function SeoProse({
  blocks,
  className = "mt-12",
  title,
}: {
  blocks: ProseBlock[];
  className?: string;
  title?: string;
}) {
  if (!blocks.length) return null;
  return (
    <section className={className}>
      {title && <h2 className="mb-4 text-xl font-bold text-navy-800">{title}</h2>}
      <div className="space-y-8">
        {blocks.map((b) => (
          <div key={b.h2}>
            <h2 className="mb-2 text-lg font-bold text-navy-800">{b.h2}</h2>
            <div className="space-y-3 text-[15px] leading-relaxed text-slate-600">
              {b.p.map((para, i) => (
                <p key={i} className="max-w-3xl">{para}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
