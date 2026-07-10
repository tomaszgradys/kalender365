"use client";

// Bundesland picker. Persists the choice in localStorage and navigates to the
// state-specific SEO URL (own URL per Land — not a client-only filter).
// `basePath` is the section, e.g. "/feiertage/2026" → "/feiertage/2026/bayern".

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";

const LS_KEY = "kalender365.bundesland";

export default function BundeslandSelect({
  basePath,
  current,
  label = "Bundesland wählen",
}: {
  basePath: string;
  current?: string; // slug of the currently selected state (if any)
  label?: string;
}) {
  const router = useRouter();
  const [value, setValue] = useState(current ?? "");

  useEffect(() => {
    if (!current) {
      const saved = typeof window !== "undefined" ? window.localStorage.getItem(LS_KEY) : null;
      // Beim Mount aus localStorage vorbelegen (nicht SSR-verfügbar → kein useState-Initializer).
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (saved) setValue(saved);
    }
  }, [current]);

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const slug = e.target.value;
    setValue(slug);
    if (typeof window !== "undefined" && slug) window.localStorage.setItem(LS_KEY, slug);
    if (slug) router.push(`${basePath}/${slug}`);
    else router.push(basePath);
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <span className="font-medium text-slate-600">{label}:</span>
      <select
        value={value}
        onChange={onChange}
        className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 font-medium text-navy-700 outline-none focus:border-navy-300"
      >
        <option value="">Deutschland (bundesweit)</option>
        {BUNDESLAENDER.map((b) => (
          <option key={b.code} value={b.slug}>
            {b.name}
          </option>
        ))}
      </select>
    </label>
  );
}
