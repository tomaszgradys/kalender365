import Link from "next/link";
import type { ReactNode } from "react";
import type { GeneratedContent } from "@/lib/blog";

// Dopuszczamy tylko bezpieczne URL-e (http/https). Treść źródeł pochodzi z generacji
// AI + web-search — bez walidacji `javascript:`/`data:` w href byłby wektor XSS.
function safeHttpUrl(u: string): string | null {
  return /^https?:\/\//i.test(u.trim()) ? u.trim() : null;
}

// Parser bezpieczny: buduje węzły React (React sam escapuje tekst — brak XSS).
// Obsługuje [tekst](/sciezka) → link wewnętrzny/zewnętrzny oraz **pogrubienie**.
function renderRich(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) nodes.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      const href = m[2];
      const label = m[1];
      if (href.startsWith("/")) {
        nodes.push(
          <Link key={key++} href={href}>
            {label}
          </Link>
        );
      } else {
        nodes.push(
          <a key={key++} href={href} target="_blank" rel="nofollow noopener noreferrer">
            {label}
          </a>
        );
      }
    } else if (m[3]) {
      nodes.push(<strong key={key++}>{m[3]}</strong>);
    }
    last = re.lastIndex;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes;
}

export default function StructuredArticle({ content }: { content: GeneratedContent }) {
  return (
    <>
      {content.intro && <p>{renderRich(content.intro)}</p>}

      {content.sections?.map((s, i) => (
        <section key={i}>
          <h2 id={`sekcja-${i + 1}`}>{s.h2}</h2>
          {s.paragraphs.map((p, j) => (
            <p key={j}>{renderRich(p)}</p>
          ))}
        </section>
      ))}

      {content.takeaways && content.takeaways.length > 0 && (
        <>
          <h2 id="w-skrocie">W skrócie</h2>
          <ul>
            {content.takeaways.map((t, i) => (
              <li key={i}>{renderRich(t)}</li>
            ))}
          </ul>
        </>
      )}

      {content.sources && content.sources.length > 0 && (
        <>
          <h2 id="zrodla">Źródła</h2>
          <ul>
            {content.sources.map((s, i) => {
              const safe = safeHttpUrl(s.url);
              return (
                <li key={i}>
                  {safe ? (
                    <a href={safe} target="_blank" rel="nofollow noopener noreferrer">
                      {s.title}
                    </a>
                  ) : (
                    <span>{s.title}</span>
                  )}
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
