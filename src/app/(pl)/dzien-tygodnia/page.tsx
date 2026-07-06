import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";
import WeekdayFinder from "./WeekdayFinder";

export const metadata: Metadata = {
  title: "Jaki to dzień tygodnia — sprawdź dowolną datę",
  description:
    "Sprawdź, w jaki dzień tygodnia wypada dowolna data — dziś, w przeszłości i w przyszłości. Poznaj też numer dnia roku i numer tygodnia ISO. Za darmo, bez rejestracji.",
  alternates: { canonical: "/dzien-tygodnia" },
};

const FAQ = [
  {
    q: "Jak sprawdzić, w jaki dzień tygodnia wypada data?",
    a: "Wybierz datę w kalkulatorze, a od razu zobaczysz dzień tygodnia (np. poniedziałek), numer dnia roku oraz numer tygodnia ISO.",
  },
  {
    q: "Czy narzędzie działa dla dat historycznych i przyszłych?",
    a: "Tak. Sprawdzisz dzień tygodnia dla dowolnej daty — zarówno z przeszłości (np. daty urodzenia), jak i w przyszłości.",
  },
  {
    q: "Czym jest numer tygodnia ISO?",
    a: "To numer tygodnia w roku według normy ISO 8601, w której tydzień zaczyna się w poniedziałek, a pierwszym tygodniem jest ten zawierający pierwszy czwartek stycznia.",
  },
];

export default function DzienTygodniaPage() {
  return (
    <PageWithSidebar relatedExclude={["dzien-tygodnia"]}>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/narzedzia" className="hover:text-navy-600">Narzędzia</Link> / Dzień tygodnia
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Jaki to dzień tygodnia?</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Sprawdź, <strong>w jaki dzień tygodnia wypada</strong> dowolna data — dziś, w przeszłości i w
        przyszłości. Przy okazji poznasz <strong>numer dnia roku</strong> i <strong>numer tygodnia</strong>{" "}
        (ISO 8601).
      </p>

      <WeekdayFinder />

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold text-navy-800">Jak sprawdzić dzień tygodnia?</h2>
        <p className="text-slate-600">
          Wybierz datę, a narzędzie natychmiast pokaże, czy to poniedziałek, wtorek, środa, czwartek,
          piątek, sobota czy niedziela. Dodatkowo wyświetli, który to dzień roku (od 1 do 365 lub 366)
          oraz numer tygodnia kalendarzowego.
        </p>
        <h2 className="text-xl font-bold text-navy-800">Do czego to się przydaje?</h2>
        <p className="text-slate-600">
          Sprawdzenie dnia tygodnia bywa potrzebne przy planowaniu wydarzeń, ustalaniu terminów, a nawet
          z ciekawości — np. w jaki dzień tygodnia przypadały Twoje urodziny. Sprawdź też{" "}
          <Link href="/tydzien/2026/1" className="text-navy-600 hover:underline">numery tygodni</Link> w całym roku albo{" "}
          <Link href="/kalkulator-wieku" className="text-navy-600 hover:underline">kalkulator wieku</Link>.
        </p>
      </section>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
