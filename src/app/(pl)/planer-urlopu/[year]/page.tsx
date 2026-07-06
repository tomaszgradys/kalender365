import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, isNavigableYear } from "@/lib/months";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import FaqSection from "@/components/FaqSection";
import SoftwareAppJsonLd from "@/components/SoftwareAppJsonLd";
import VacationPlanner from "@/components/VacationPlanner";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  const y = Number(year);
  return {
    title: `Planer urlopu ${y} — jak zaplanować urlop i długie weekendy`,
    description: `Oblicz najlepsze kombinacje urlopu w ${y} roku. Podaj liczbę dni, a planer wskaże, kiedy wziąć wolne, by zyskać najwięcej dni wolnego. Tryb rodzinny z feriami i wakacjami. Wydruk PDF.`,
    alternates: { canonical: `/planer-urlopu/${y}` },
  };
}

export default async function PlanerUrlopuPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const prev = year - 1;
  const next = year + 1;

  const faq = [
    {
      q: `Jak zaplanować urlop w ${year} roku, żeby mieć najwięcej wolnego?`,
      a: `Wpisz liczbę dni urlopu, a planer sam wskaże najlepsze „mostki" — czyli dni robocze między świętami i weekendami, których wzięcie daje najdłuższe ciągłe wolne. Zwykle kilka dobrze dobranych dni urlopu potrafi dać nawet 9 dni wolnego z rzędu.`,
    },
    {
      q: "Czym jest mostek urlopowy?",
      a: "Mostek to dzień lub dwa robocze między dniem wolnym (świętem) a weekendem. Biorąc taki dzień urlopu, łączysz święto z weekendem w długi weekend — maksymalizujesz wolne przy minimalnym koszcie urlopu.",
    },
    {
      q: "Na czym polega tryb rodzinny?",
      a: "Tryb rodzinny uwzględnia ferie zimowe (dla wybranego województwa) i wakacje letnie, premiując urlop w tych okresach — tak, aby rodzic był wolny, gdy dzieci mają przerwę od szkoły. Tryb pełnej optymalizacji szuka po prostu największej liczby dni wolnego.",
    },
    {
      q: "Czy mogę dodać własne, obowiązkowe terminy?",
      a: "Tak. Jeśli masz już zaplanowany wyjazd w konkretnym terminie, dodaj go jako termin obowiązkowy — planer uwzględni te dni i optymalnie rozłoży pozostały urlop.",
    },
    {
      q: "Czy plan urlopu da się wydrukować?",
      a: "Tak, kliknij „Drukuj / PDF”, aby zapisać gotowy plan do PDF — na przykład po to, by przedstawić go w pracy.",
    },
  ];

  return (
    <PageWithSidebar>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Planer urlopu", path: `/planer-urlopu/${year}` },
          { name: String(year), path: `/planer-urlopu/${year}` },
        ]}
      />
      <SoftwareAppJsonLd
        name={`Planer urlopu ${year}`}
        path={`/planer-urlopu/${year}`}
        description={`Darmowy planer urlopu na ${year} rok — oblicza najlepsze kombinacje dni wolnego, łącząc święta, weekendy i mostki. Edytowalny kalendarz z wydrukiem PDF.`}
      />
      <nav className="mb-4 text-sm text-slate-500 no-print">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Planer urlopu / {year}
      </nav>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">Planer urlopu {year}</h1>
        <div className="flex items-center gap-2 text-sm no-print">
          {isNavigableYear(prev) && <Link href={`/planer-urlopu/${prev}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">← {prev}</Link>}
          {isNavigableYear(next) && <Link href={`/planer-urlopu/${next}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-600 hover:border-navy-300 hover:text-navy-600">{next} →</Link>}
        </div>
      </div>

      <p className="mt-2 max-w-2xl text-slate-600 no-print">
        Podaj, ile masz dni urlopu w {year} roku, a planer obliczy najlepsze kombinacje — łącząc święta,
        weekendy i mostki tak, aby zyskać jak najwięcej dni wolnego. Możesz dodać własne terminy i wydrukować
        gotowy plan do PDF.
      </p>

      <VacationPlanner year={year} />

      {/* SEO */}
      <section className="mt-10 space-y-3 text-slate-600 no-print">
        <h2 className="text-xl font-bold text-navy-800">Jak działa planer urlopu?</h2>
        <p>
          Planer analizuje cały {year} rok: zaznacza weekendy oraz{" "}
          <Link href={`/dni-wolne-od-pracy/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">dni ustawowo wolne od pracy</Link>,
          a następnie szuka najkrótszych ciągów dni roboczych między nimi. Wypełnienie takiego „mostka" urlopem
          daje najdłuższe możliwe wolne przy najmniejszej liczbie wykorzystanych dni. To ta sama zasada, dzięki
          której z <Link href={`/dlugie-weekendy/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">długich weekendów {year}</Link>{" "}
          wyciśniesz maksimum.
        </p>
        <p>
          W trybie rodzinnym planer bierze pod uwagę także{" "}
          <Link href={`/ferie-zimowe/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">ferie zimowe</Link>{" "}
          w Twoim województwie oraz wakacje letnie z{" "}
          <Link href={`/kalendarz-szkolny/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">kalendarza roku szkolnego</Link>,
          aby Twój urlop pokrywał się z przerwami dzieci. Cały układ roku podejrzysz na{" "}
          <Link href={`/kalendarz/${year}`} className="font-medium text-navy-600 hover:text-brand-green-600">kalendarzu {year}</Link>.
        </p>
      </section>

      <div className="no-print">
        <FaqSection items={faq} />
      </div>
    </PageWithSidebar>
  );
}
