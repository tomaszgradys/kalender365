import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";
import SoftwareAppJsonLd from "@/components/SoftwareAppJsonLd";
import PregnancyCalc from "./PregnancyCalc";

export const metadata: Metadata = {
  title: "Kalkulator ciąży — który tydzień ciąży i termin porodu",
  description:
    "Kalkulator ciąży: sprawdź, który jesteś tydzień ciąży, w którym trymestrze oraz jaki jest przewidywany termin porodu (reguła Naegelego). Zobacz postęp ciąży tydzień po tygodniu.",
  alternates: { canonical: "/kalkulator-ciazy" },
};

const FAQ = [
  {
    q: "Jak obliczyć, który jestem tydzień ciąży?",
    a: "Podaj pierwszy dzień ostatniej miesiączki. Kalkulator ciąży policzy tydzień i dzień ciąży, licząc od tej daty (tzw. wiek ciążowy).",
  },
  {
    q: "Jak wyliczany jest termin porodu?",
    a: "Termin porodu wyliczamy według reguły Naegelego: pierwszy dzień ostatniej miesiączki plus 280 dni (40 tygodni). To wynik orientacyjny — dokładny termin ustala lekarz na podstawie USG.",
  },
  {
    q: "Ile trwają trymestry ciąży?",
    a: "I trymestr to tygodnie 1–13, II trymestr 14–27, a III trymestr od 28. tygodnia do porodu. Kalkulator pokazuje, w którym trymestrze aktualnie jesteś.",
  },
  {
    q: "Czy kalkulator ciąży zastępuje wizytę u lekarza?",
    a: "Nie. Wyniki mają charakter orientacyjny i nie zastępują konsultacji lekarskiej ani badań prenatalnych.",
  },
];

export default function Page() {
  return (
    <PageWithSidebar relatedExclude={["kalkulator-ciazy"]}>
      <SoftwareAppJsonLd name="Kalkulator ciąży" path="/kalkulator-ciazy" description="Darmowy kalkulator ciąży — sprawdź, który jesteś tydzień ciąży, w którym trymestrze i jaki jest przewidywany termin porodu (reguła Naegelego)." />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/narzedzia" className="hover:text-navy-600">Narzędzia</Link> / Kalkulator ciąży
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Kalkulator ciąży</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Kalkulator ciąży pomoże Ci sprawdzić, <strong>który jesteś tydzień ciąży</strong>, w którym
        jesteś <strong>trymestrze</strong> oraz jaki jest <strong>przewidywany termin porodu</strong>.
        Wystarczy podać pierwszy dzień ostatniej miesiączki.
      </p>

      <PregnancyCalc />

      <section className="mt-10 space-y-3">
        <h2 className="text-xl font-bold text-navy-800">Jak obliczyć tydzień ciąży?</h2>
        <p className="text-slate-600">
          Wiek ciążowy liczy się od pierwszego dnia ostatniej miesiączki, a nie od zapłodnienia. Dlatego
          w chwili zapłodnienia jesteś już „w 2. tygodniu ciąży". Kalkulator ciąży przelicza liczbę dni
          od tej daty na tygodnie i dni, pokazując dokładny tydzień ciąży.
        </p>

        <h2 className="text-xl font-bold text-navy-800">Termin porodu — reguła Naegelego</h2>
        <p className="text-slate-600">
          Przewidywany termin porodu wyliczamy, dodając 280 dni (40 tygodni) do pierwszego dnia
          ostatniej miesiączki. Kalkulator pokazuje też, ile dni zostało do terminu oraz jaki procent
          ciąży masz już za sobą.
        </p>

        <h2 className="text-xl font-bold text-navy-800">Trymestry ciąży</h2>
        <p className="text-slate-600">
          Ciąża dzieli się na trzy trymestry: pierwszy (tygodnie 1–13), drugi (14–27) i trzeci (od 28.
          tygodnia). Kalkulator automatycznie wskazuje, w którym trymestrze aktualnie jesteś.
        </p>

        <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">
          Wyniki mają charakter orientacyjny i nie zastępują konsultacji lekarskiej. Dokładny termin
          porodu i tydzień ciąży ustala lekarz na podstawie badania USG.
        </p>
      </section>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
