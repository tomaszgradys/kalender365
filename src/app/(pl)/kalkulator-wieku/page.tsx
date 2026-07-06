import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";
import SoftwareAppJsonLd from "@/components/SoftwareAppJsonLd";
import AgeCalc from "./AgeCalc";

export const metadata: Metadata = {
  title: "Kalkulator wieku — ile mam lat, dni i tygodni",
  description:
    "Kalkulator wieku: oblicz dokładny wiek w latach, miesiącach i dniach, liczbę dni i tygodni życia, dzień tygodnia urodzenia, znak zodiaku oraz ile dni do najbliższych urodzin.",
  alternates: { canonical: "/kalkulator-wieku" },
};

const FAQ = [
  {
    q: "Jak obliczyć swój dokładny wiek?",
    a: "Podaj datę urodzenia, a kalkulator wieku wyliczy, ile masz lat, miesięcy i dni oraz ile dni i tygodni już przeżyłeś.",
  },
  {
    q: "Ile dni ma rok i ile to tygodni?",
    a: "Rok zwykły ma 365 dni, a przestępny 366. To odpowiednio 52 tygodnie i 1 lub 2 dni. Kalkulator wieku uwzględnia lata przestępne przy liczeniu dni życia.",
  },
  {
    q: "Jak sprawdzić, w jaki dzień tygodnia się urodziłem?",
    a: "Kalkulator wieku pokazuje dzień tygodnia dla podanej daty urodzenia — od razu, bez ręcznego liczenia.",
  },
  {
    q: "Ile dni zostało do moich urodzin?",
    a: "Po wpisaniu daty urodzenia kalkulator wyświetla również liczbę dni do najbliższych urodzin.",
  },
];

export default function Page() {
  return (
    <PageWithSidebar relatedExclude={["kalkulator-wieku"]}>
      <SoftwareAppJsonLd name="Kalkulator wieku" path="/kalkulator-wieku" description="Darmowy kalkulator wieku — dokładny wiek w latach, dniach i tygodniach życia, dzień tygodnia urodzenia, znak zodiaku i dni do urodzin." />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/narzedzia" className="hover:text-navy-600">Narzędzia</Link> / Kalkulator wieku
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalkulator wieku</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Kalkulator wieku obliczy Twój <strong>dokładny wiek</strong> co do dnia — <strong>ile masz lat</strong>,
        miesięcy i dni, a także <strong>ile dni i tygodni życia</strong> masz za sobą. Sprawdzisz też dzień
        tygodnia swoich urodzin, znak zodiaku i ile dni zostało do kolejnych urodzin.
      </p>

      <AgeCalc />

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold text-navy-800">Jak obliczyć wiek?</h2>
        <p className="text-slate-600">
          Wiek liczymy od daty urodzenia do dnia dzisiejszego. Kalkulator wieku uwzględnia różną liczbę
          dni w miesiącach oraz lata przestępne, dzięki czemu wynik w latach, miesiącach i dniach jest
          dokładny. Dodatkowo przelicza cały okres na dni i tygodnie życia.
        </p>

        <h2 className="text-xl font-bold text-navy-800">Co jeszcze pokazuje kalkulator wieku?</h2>
        <ul className="list-disc space-y-1 pl-5 text-slate-600">
          <li>dzień tygodnia, w którym się urodziłeś,</li>
          <li>znak zodiaku odpowiadający dacie urodzenia,</li>
          <li>liczbę dni do najbliższych urodzin,</li>
          <li>łączną liczbę przeżytych dni i tygodni.</li>
        </ul>
        <p className="text-slate-600">
          Chcesz sprawdzić dzień tygodnia dowolnej daty? Skorzystaj z narzędzia{" "}
          <Link href="/dzien-tygodnia" className="text-navy-600 hover:underline">jaki to dzień tygodnia</Link>. Interesują Cię{" "}
          <Link href="/zodiak" className="text-navy-600 hover:underline">znaki zodiaku</Link>? Zobacz ich daty i żywioły.
        </p>
      </section>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
