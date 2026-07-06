import Link from "next/link";

export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10">
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        / {title}
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">{title}</h1>
      <p className="mt-2 text-sm text-slate-500">Ostatnia aktualizacja: {updated}</p>
      <div className="legal mt-6 space-y-5 text-slate-600">{children}</div>
    </main>
  );
}
