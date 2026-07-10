import Link from "next/link";
import { berlinNow } from "@/lib/de/now";

export const metadata = {
  title: "Seite nicht gefunden (404)",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const y = berlinNow().year;
  const links = [
    { href: `/kalender/${y}`, label: `Kalender ${y}` },
    { href: `/feiertage/${y}`, label: `Feiertage ${y}` },
    { href: `/schulferien/${y}`, label: `Schulferien ${y}` },
    { href: `/brueckentage/${y}`, label: `Brückentage ${y}` },
    { href: `/kalenderwochen/${y}`, label: `Kalenderwochen ${y}` },
    { href: "/generatoren", label: "Tools & Rechner" },
  ];
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-16 text-center">
      <div className="text-6xl font-black text-navy-600">404</div>
      <h1 className="mt-3 text-2xl font-bold text-navy-800">Seite nicht gefunden</h1>
      <p className="mt-2 text-slate-600">
        Diese Seite wurde möglicherweise verschoben oder existiert nicht. Zurück zur Startseite oder wählen Sie unten.
      </p>
      <Link href="/" className="mt-6 rounded-full bg-brand-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700">
        Zur Startseite
      </Link>
      <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {links.map((c) => (
          <Link key={c.href} href={c.href} className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-navy-800 transition hover:border-navy-300 hover:shadow-sm">
            {c.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
