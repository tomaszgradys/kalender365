import Link from "next/link";
import { nowCtx, popularCalendars } from "@/lib/calendars";

export const metadata = {
  title: "Nie znaleziono strony (404)",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  const ctx = nowCtx();
  const popular = popularCalendars().slice(0, 6);
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col items-center px-4 py-16 text-center">
      <div className="text-6xl font-black text-navy-600">404</div>
      <h1 className="mt-3 text-2xl font-bold text-navy-800">Nie znaleziono tej strony</h1>
      <p className="mt-2 text-slate-600">
        Strona mogła zostać przeniesiona lub nie istnieje. Wróć na stronę główną albo wybierz kalendarz
        poniżej.
      </p>
      <Link href="/" className="mt-6 rounded-full bg-brand-green-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-green-700">
        Wróć na stronę główną
      </Link>

      <div className="mt-10 grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
        {popular.map((c) => (
          <Link
            key={c.slug}
            href={c.href(ctx)}
            className="rounded-2xl border border-slate-200 bg-white p-4 text-sm font-semibold text-navy-800 transition hover:border-navy-300 hover:shadow-sm"
          >
            {c.label}
          </Link>
        ))}
      </div>
    </main>
  );
}
