import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";
import SoftwareAppJsonLd from "@/components/SoftwareAppJsonLd";
import DayCalculator from "./DayCalculator";

export const metadata: Metadata = {
  title: "Kalkulator dni — ile dni między datami i ile do wydarzenia",
  description:
    "Kalkulator dni: policz, ile dni jest między dwiema datami oraz ile dni zostało do świąt, urodzin czy wakacji. Wynik w dniach i tygodniach, za darmo i bez rejestracji.",
  alternates: { canonical: "/kalkulator-dni" },
};

const FAQ = [
  {
    q: "Jak policzyć, ile dni jest między dwiema datami?",
    a: "Wpisz datę początkową i końcową, a kalkulator dni od razu pokaże różnicę w dniach oraz w tygodniach. Nie musisz nic liczyć ręcznie ani zakładać konta.",
  },
  {
    q: "Czy kalkulator liczy dni razem z pierwszym i ostatnim dniem?",
    a: "Kalkulator pokazuje różnicę między datami (liczbę pełnych dni). Jeśli chcesz policzyć również dzień początkowy, dodaj do wyniku 1.",
  },
  {
    q: "Jak sprawdzić, ile dni zostało do wydarzenia?",
    a: "Jako datę początkową ustaw dzisiejszy dzień, a jako końcową datę wydarzenia (np. świąt lub urodzin). Kalkulator pokaże, ile dni zostało.",
  },
  {
    q: "Czy kalkulator dni jest darmowy?",
    a: "Tak, kalkulator dni jest w pełni darmowy, działa w przeglądarce i nie wymaga logowania.",
  },
];

export default function KalkulatorDniPage() {
  return (
    <PageWithSidebar relatedExclude={["kalkulator-dni"]}>
      <SoftwareAppJsonLd name="Kalkulator dni" path="/kalkulator-dni" description="Darmowy kalkulator dni — policz, ile dni jest między dwiema datami oraz ile dni zostało do wydarzenia. Wynik w dniach i tygodniach." />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/narzedzia" className="hover:text-navy-600">Narzędzia</Link> / Kalkulator dni
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalkulator dni</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Kalkulator dni pozwala szybko policzyć, <strong>ile dni jest między dwiema datami</strong> oraz{" "}
        <strong>ile dni zostało do wydarzenia</strong> — świąt, urodzin, egzaminu czy wakacji. Wynik
        otrzymasz w dniach i tygodniach, natychmiast i za darmo.
      </p>

      <DayCalculator />

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold text-navy-800">Jak działa kalkulator dni?</h2>
        <p className="text-slate-600">
          Wystarczą dwie daty. Kalkulator liczy różnicę między datą początkową a końcową i pokazuje ją
          w dniach oraz w pełnych tygodniach z resztą dni. Jeżeli data końcowa jest wcześniejsza,
          zobaczysz, ile dni minęło. Wszystkie obliczenia wykonywane są w Twojej przeglądarce, więc
          działają błyskawicznie i nie wysyłamy żadnych danych.
        </p>

        <h2 className="text-xl font-bold text-navy-800">Do czego przydaje się liczenie dni?</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-600">
          <li>sprawdzenie, ile dni zostało do świąt, urodzin, ślubu lub wakacji,</li>
          <li>policzenie długości urlopu, delegacji lub terminu umowy,</li>
          <li>ustalenie liczby dni między wydarzeniami, np. od zakupu do gwarancji,</li>
          <li>obliczenie ile dni minęło od ważnej daty.</li>
        </ul>
        <p className="text-slate-600">
          Jeśli potrzebujesz policzyć tylko <Link href="/kalkulator-dni-roboczych" className="text-navy-600 hover:underline">dni robocze między datami</Link>{" "}
          (bez weekendów i świąt) albo sprawdzić <Link href="/dzien-tygodnia" className="text-navy-600 hover:underline">jaki to dzień tygodnia</Link>, skorzystaj z pozostałych narzędzi.
        </p>
      </section>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
