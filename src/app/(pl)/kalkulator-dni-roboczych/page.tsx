import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";
import SoftwareAppJsonLd from "@/components/SoftwareAppJsonLd";
import WorkdaysCalc from "./WorkdaysCalc";

export const metadata: Metadata = {
  title: "Kalkulator dni roboczych — ile dni roboczych między datami",
  description:
    "Kalkulator dni roboczych: policz dni robocze między dwiema datami z wyłączeniem weekendów i świąt. Przydatny jako kalkulator urlopu i do liczenia terminów.",
  alternates: { canonical: "/kalkulator-dni-roboczych" },
};

const FAQ = [
  {
    q: "Jak policzyć dni robocze między dwiema datami?",
    a: "Wybierz datę początkową i końcową. Kalkulator zliczy dni od poniedziałku do piątku i odejmie święta ustawowo wolne od pracy, pokazując liczbę dni roboczych, weekendowych i świątecznych.",
  },
  {
    q: "Czy kalkulator uwzględnia święta?",
    a: "Tak. Kalkulator dni roboczych automatycznie pomija polskie święta ustawowo wolne od pracy (w tym święta ruchome, jak Wielkanoc czy Boże Ciało).",
  },
  {
    q: "Czy to kalkulator urlopu?",
    a: "Tak — aby sprawdzić, ile dni roboczych obejmuje urlop, ustaw pierwszy i ostatni dzień wolnego. Kalkulator pokaże liczbę dni roboczych, które przypadają na ten okres.",
  },
  {
    q: "Czy zakres obejmuje obie daty?",
    a: "Tak, kalkulator liczy dni włącznie z datą początkową i końcową.",
  },
];

export default function Page() {
  return (
    <PageWithSidebar relatedExclude={["kalkulator-dni-roboczych"]}>
      <SoftwareAppJsonLd name="Kalkulator dni roboczych" path="/kalkulator-dni-roboczych" description="Darmowy kalkulator dni roboczych — policz dni robocze między datami z wyłączeniem weekendów i świąt. Przydatny do liczenia urlopu i terminów." />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/narzedzia" className="hover:text-navy-600">Narzędzia</Link> / Kalkulator dni roboczych
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalkulator dni roboczych</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Kalkulator dni roboczych policzy, <strong>ile dni roboczych jest między dwiema datami</strong> —
        z wyłączeniem weekendów i świąt ustawowo wolnych od pracy. To wygodny <strong>kalkulator urlopu</strong>{" "}
        i narzędzie do liczenia terminów.
      </p>

      <WorkdaysCalc />

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold text-navy-800">Jak liczymy dni robocze?</h2>
        <p className="text-slate-600">
          Za dni robocze przyjmujemy dni od poniedziałku do piątku, pomijając soboty, niedziele oraz
          polskie święta ustawowo wolne od pracy. Kalkulator pokazuje osobno liczbę dni roboczych,
          weekendowych i świątecznych w wybranym zakresie, dzięki czemu łatwo policzysz np. długość
          urlopu lub termin realizacji.
        </p>

        <h2 className="text-xl font-bold text-navy-800">Kalkulator urlopu i terminów</h2>
        <p className="text-slate-600">
          Aby obliczyć urlop, wskaż pierwszy i ostatni dzień wolnego — otrzymasz liczbę dni roboczych,
          które na niego przypadają. Narzędzie sprawdzi się też przy terminach umów, delegacjach i
          planowaniu projektów.
        </p>
        <p className="text-slate-600">
          Zobacz również, ile <Link href="/dni-robocze/2026" className="text-navy-600 hover:underline">dni roboczych ma cały rok</Link> i
          poszczególne miesiące, albo policz <Link href="/kalkulator-dni" className="text-navy-600 hover:underline">wszystkie dni między datami</Link>.
        </p>
      </section>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
