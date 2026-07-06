import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import PlanLekcjiEditor from "./PlanLekcjiEditor";

export const metadata: Metadata = {
  title: "Plan lekcji do wydruku — darmowy generator (PDF)",
  description:
    "Stwórz własny plan lekcji online: wpisz przedmioty, godziny i sale, dodaj kolory oraz własne zdjęcie, a następnie pobierz gotowy plan lekcji do druku w PDF. Za darmo.",
  alternates: { canonical: "/plan-lekcji" },
};

export default function PlanLekcjiPage() {
  return (
    <PageWithSidebar relatedExclude={["plan-lekcji"]}>
      <nav className="mb-4 text-sm text-slate-500 no-print">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/generatory" className="hover:text-navy-600">Generatory</Link> / Plan lekcji
      </nav>
      <div className="no-print">
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Generator planu lekcji</h1>
        <p className="mt-2 max-w-2xl text-slate-600">
          Ułóż własny plan lekcji: przedmioty, godziny, sale i kolory. Dodaj własne zdjęcie lub logo szkoły,
          a potem pobierz plan w PDF albo wydrukuj. Wszystko działa w Twojej przeglądarce — nic nie wysyłamy.
        </p>
      </div>
      <div className="mt-6">
        <PlanLekcjiEditor />
      </div>
    </PageWithSidebar>
  );
}
