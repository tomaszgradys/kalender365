import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import BreadcrumbJsonLd from "@/components/BreadcrumbJsonLd";
import FaqSection from "@/components/FaqSection";
import { warsawNow } from "@/lib/now";

export const metadata: Metadata = {
  title: "Polskie święta do kalendarza — plik iCal (Google, Apple, Outlook)",
  description:
    "Pobierz polskie dni wolne od pracy jako plik .ics i zaimportuj je do Kalendarza Google, Apple lub Outlook. Święta ustawowo wolne, długie weekendy — gotowe do dodania.",
  alternates: { canonical: "/dni-wolne-do-kalendarza" },
};

export default function DoKalendarzaPage() {
  const y = warsawNow().year;
  const years = [y, y + 1];

  const faq = [
    {
      q: "Jak dodać polskie święta do Kalendarza Google?",
      a: "Pobierz plik .ics z tej strony, otwórz calendar.google.com → Ustawienia → Import i eksport → wybierz pobrany plik i kalendarz docelowy → Importuj. Święta pojawią się jako całodniowe wydarzenia.",
    },
    {
      q: "Jak zaimportować dni wolne na iPhone / do kalendarza Apple?",
      a: "Pobierz plik .ics na urządzeniu — system zaproponuje dodanie wydarzeń do aplikacji Kalendarz. Na Macu wystarczy dwuklik w plik .ics.",
    },
    {
      q: "Jak dodać święta do Outlooka?",
      a: "W Outlook (web lub aplikacja) wybierz Kalendarz → Dodaj kalendarz → Prześlij z pliku → wskaż pobrany plik .ics.",
    },
    {
      q: "Czy plik .ics jest darmowy i bezpieczny?",
      a: "Tak. To zwykły, otwarty format kalendarza (iCalendar). Zawiera wyłącznie daty świąt — żadnych danych osobowych.",
    },
  ];

  const btn =
    "flex items-center gap-2 rounded-xl border border-brand-green-200 bg-brand-green-50 px-4 py-2.5 text-sm font-semibold text-brand-green-700 hover:bg-brand-green-100";

  return (
    <PageWithSidebar>
      <BreadcrumbJsonLd
        items={[
          { name: "Kalendarz.pro", path: "/" },
          { name: "Dni wolne do kalendarza", path: "/dni-wolne-do-kalendarza" },
        ]}
      />
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> / Dni wolne do kalendarza
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">
        Polskie święta do kalendarza (.ics)
      </h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Dodaj polskie <Link href={`/dni-wolne-od-pracy/${y}`} className="font-medium text-navy-600 hover:text-brand-green-600">dni wolne od pracy</Link>{" "}
        do swojego kalendarza w telefonie lub komputerze. Pobierz gotowy plik iCal (.ics) i zaimportuj go do
        Kalendarza Google, Apple lub Outlook — święta pojawią się jako całodniowe wydarzenia.
      </p>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-bold text-navy-800">Pobierz pliki .ics</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-navy-800">Dni wolne od pracy</p>
            <div className="flex flex-wrap gap-2">
              {years.map((yr) => (
                <a key={yr} href={`/api/ics/dni-wolne/${yr}`} className={btn}>📅 Święta {yr}</a>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="mb-2 text-sm font-semibold text-navy-800">Długie weekendy</p>
            <div className="flex flex-wrap gap-2">
              {years.map((yr) => (
                <a key={yr} href={`/api/ics/dlugie-weekendy/${yr}`} className={btn}>📅 Długie weekendy {yr}</a>
              ))}
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          Szukasz ferii? Wejdź na <Link href={`/ferie-zimowe/${y + 1}`} className="font-medium text-navy-600 hover:text-brand-green-600">ferie zimowe</Link>{" "}
          i wybierz województwo — tam też pobierzesz plik .ics.
        </p>
      </section>

      <section className="mt-8 space-y-3 text-slate-600">
        <h2 className="text-lg font-bold text-navy-800">Jak zaimportować plik .ics</h2>
        <div className="grid gap-3 sm:grid-cols-3 text-sm">
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-navy-800">Kalendarz Google</p>
            <p className="mt-1">Ustawienia → Import i eksport → wybierz plik → Importuj.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-navy-800">Apple (iPhone / Mac)</p>
            <p className="mt-1">Otwórz plik .ics — system doda wydarzenia do Kalendarza.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="font-semibold text-navy-800">Outlook</p>
            <p className="mt-1">Kalendarz → Dodaj kalendarz → Prześlij z pliku → wskaż .ics.</p>
          </div>
        </div>
      </section>

      <FaqSection items={faq} />
    </PageWithSidebar>
  );
}
