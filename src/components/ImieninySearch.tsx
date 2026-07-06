"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type NameItem = { name: string; slug: string };

// Normalizacja PL (bez znaków diakrytycznych) — „lucja" znajdzie „Łucja".
const PL_MAP: Record<string, string> = { ą: "a", ć: "c", ę: "e", ł: "l", ń: "n", ó: "o", ś: "s", ź: "z", ż: "z" };
function norm(s: string): string {
  return s.toLowerCase().replace(/[ąćęłńóśźż]/g, (c) => PL_MAP[c] ?? c);
}

export default function ImieninySearch({ names }: { names: NameItem[] }) {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const nq = norm(q.trim());
    const filtered = nq ? names.filter((n) => norm(n.name).includes(nq)) : names;
    const map = new Map<string, NameItem[]>();
    for (const n of filtered) {
      const letter = n.name[0].toUpperCase();
      const arr = map.get(letter) ?? [];
      arr.push(n);
      map.set(letter, arr);
    }
    return [...map.entries()];
  }, [q, names]);

  const total = useMemo(() => groups.reduce((s, [, arr]) => s + arr.length, 0), [groups]);

  return (
    <div>
      <div className="sticky top-2 z-10 mt-6">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Szukaj imienia (np. Anna, Łucja, Krzysztof)…"
          aria-label="Szukaj imienia"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-navy-400"
        />
        {q.trim() && (
          <p className="mt-2 text-xs text-slate-500">
            Znaleziono {total} {total === 1 ? "imię" : "imion"}.
          </p>
        )}
      </div>

      {groups.length === 0 ? (
        <p className="mt-8 rounded-2xl bg-slate-50 p-6 text-slate-500">Brak imion pasujących do „{q}".</p>
      ) : (
        <div className="mt-6 space-y-8">
          {groups.map(([letter, items]) => (
            <section key={letter}>
              <h2 className="mb-3 text-lg font-bold text-navy-600">{letter}</h2>
              <div className="flex flex-wrap gap-2">
                {items.map((n) => (
                  <Link
                    key={n.slug}
                    href={`/imieniny/${n.slug}`}
                    className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700 hover:border-navy-300 hover:text-navy-600"
                  >
                    {n.name}
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
