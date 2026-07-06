import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import ImieninySearch from "@/components/ImieninySearch";
import { getAllNames } from "@/lib/nameDays";

export const metadata: Metadata = {
  title: "Kalendarz imienin — wyszukiwarka imion i dat imienin",
  description:
    "Pełna lista imion i dat imienin. Sprawdź, kiedy wypadają imieniny — kliknij imię, aby zobaczyć datę i kartkę z kalendarza.",
  alternates: { canonical: "/imieniny" },
};

export default function ImieninyIndex() {
  const names = getAllNames();

  return (
    <PageWithSidebar>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        / Imieniny
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kalendarz imienin</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Wpisz imię w wyszukiwarce lub przeglądaj alfabetycznie. Kliknij imię, aby sprawdzić, kiedy wypadają
        imieniny oraz zobaczyć kartkę z kalendarza dla tego dnia.
      </p>

      <ImieninySearch names={names} />
    </PageWithSidebar>
  );
}
