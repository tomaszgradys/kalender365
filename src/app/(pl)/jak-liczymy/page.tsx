import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import FaqSection from "@/components/FaqSection";

export const metadata: Metadata = {
  title: "Jak liczymy dane — metodologia kalendarz.pro",
  description:
    "Metodologia kalendarz.pro: jak wyliczamy wschód i zachód słońca, fazy księżyca, pory roku, datę Wielkanocy oraz numery tygodni ISO. Dokładne, powtarzalne algorytmy.",
  alternates: { canonical: "/jak-liczymy" },
};

const FAQ = [
  {
    q: "Czy dane na stronie są generowane przez AI?",
    a: "Nie. Wszystkie daty, godziny i święta wyliczamy deterministycznie z algorytmów matematycznych i przepisów prawa. Ten sam dzień zawsze daje ten sam wynik.",
  },
  {
    q: "Dla jakiej lokalizacji podajecie wschód i zachód słońca?",
    a: "Domyślnie dla Warszawy, w czasie lokalnym obowiązującym w Polsce (z uwzględnieniem czasu letniego i zimowego).",
  },
  {
    q: "Jak dokładne są godziny wschodu i zachodu słońca?",
    a: "Wyliczenia zgadzają się z danymi referencyjnymi co do minuty. Różnice rzędu 1 minuty mogą wynikać z lokalnej wysokości nad poziomem morza i refrakcji atmosferycznej.",
  },
];

export default function JakLiczymyPage() {
  return (
    <PageWithSidebar>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        / Jak liczymy
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Jak liczymy dane</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Zależy nam na dokładności, dlatego wszystkie dane wyliczamy algorytmicznie i deterministycznie —
        bez sztucznej inteligencji w czasie działania i bez kopiowania z innych serwisów. Poniżej
        opisujemy metody, których używamy.
      </p>

      <div className="mt-8 max-w-2xl space-y-6 text-slate-600">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Wschód i zachód słońca</h2>
          <p className="mt-2">
            Godziny wschodu, zachodu, świtu, zmierzchu i górowania Słońca liczymy standardowym
            algorytmem heliocentrycznym (metoda oparta na procedurze NOAA), z uwzględnieniem deklinacji
            Słońca, równania czasu oraz standardowej refrakcji atmosferycznej. Wyniki podajemy w czasie
            lokalnym dla Polski.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy-800">Fazy księżyca</h2>
          <p className="mt-2">
            Fazy Księżyca (nów, pierwsza kwadra, pełnia, ostatnia kwadra) wyznaczamy na podstawie
            wieku Księżyca w miesiącu synodycznym (≈29,53 dnia) oraz pozycji Księżyca liczonej metodą
            Montenbrucka. Pełnie i nowie w skali roku wyznaczamy przez wykrycie momentów przejścia przez
            kolejne fazy.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy-800">Pory roku</h2>
          <p className="mt-2">
            Momenty równonocy i przesileń (astronomiczny początek wiosny, lata, jesieni i zimy) liczymy
            algorytmem Jeana Meeusa (<em>Astronomical Algorithms</em>) i podajemy z dokładnością do
            minuty w czasie lokalnym.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy-800">Data Wielkanocy i święta ruchome</h2>
          <p className="mt-2">
            Datę Wielkanocy wyznaczamy metodą komputystyczną (algorytm Gaussa/Meeusa) dla obrządku
            rzymskokatolickiego. Od niej liczymy pozostałe święta ruchome: Środę Popielcową, Wielki
            Piątek, Poniedziałek Wielkanocny, Zesłanie Ducha Świętego i Boże Ciało.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy-800">Numery tygodni</h2>
          <p className="mt-2">
            Numery tygodni podajemy zgodnie z normą <strong>ISO 8601</strong>: tydzień zaczyna się w
            poniedziałek, a pierwszym tygodniem roku jest ten zawierający pierwszy czwartek stycznia.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-navy-800">Święta i dni wolne, imieniny</h2>
          <p className="mt-2">
            Dni ustawowo wolne od pracy opieramy o obowiązujące w Polsce przepisy. Kalendarz imienin
            bazuje na powszechnie stosowanych w Polsce zestawieniach imion. Jeśli zauważysz nieścisłość,{" "}
            <Link href="/o-nas" className="text-navy-600 hover:underline">
              daj nam znać
            </Link>{" "}
            — poprawiamy dane na bieżąco.
          </p>
        </div>
      </div>

      <FaqSection items={FAQ} />
    </PageWithSidebar>
  );
}
