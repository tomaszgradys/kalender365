import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "O nas — kalendarz.pro",
  description:
    "Kalendarz.pro to darmowy serwis z kalendarzami, świętami, imieninami i danymi astronomicznymi liczonymi dokładnie co do minuty. Poznaj naszą misję i źródła danych.",
  alternates: { canonical: "/o-nas" },
};

export default function ONasPage() {
  return (
    <PageWithSidebar>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">
          Kalendarz.pro
        </Link>{" "}
        / O nas
      </nav>
      <h1 className="text-3xl font-black tracking-tight text-navy-800 sm:text-4xl">O serwisie kalendarz.pro</h1>

      <div className="mt-4 max-w-2xl space-y-4 text-slate-600">
        <p>
          <strong>Kalendarz.pro</strong> to darmowy, polski serwis z kalendarzami online i do druku.
          Znajdziesz tu kalendarze miesięczne i roczne, święta i dni wolne od pracy, imieniny, numery
          tygodni, fazy księżyca, godziny wschodu i zachodu słońca oraz praktyczne narzędzia i
          generatory (m.in. plan lekcji i kalkulatory dat).
        </p>

        <h2 className="pt-2 text-xl font-bold text-navy-800">Nasza misja</h2>
        <p>
          Chcemy, aby sprawdzenie dowolnej daty, święta czy imienin było szybkie, wygodne i w 100%
          darmowe — bez logowania i bez ukrytych opłat. Stawiamy na dokładność danych, przejrzysty
          układ i lekkość strony, także na telefonie.
        </p>

        <h2 className="pt-2 text-xl font-bold text-navy-800">Skąd bierzemy dane</h2>
        <p>
          Dane astronomiczne (wschód i zachód słońca, fazy księżyca, pory roku) wyliczamy algorytmicznie
          na podstawie uznanych metod naukowych — nie kopiujemy ich z innych serwisów. Święta i dni
          wolne opieramy o obowiązujące w Polsce przepisy, a święta ruchome (jak Wielkanoc) liczymy
          metodą komputystyczną. Szczegóły opisaliśmy na stronie{" "}
          <Link href="/jak-liczymy" className="text-navy-600 hover:underline">
            Jak liczymy
          </Link>
          .
        </p>

        <h2 className="pt-2 text-xl font-bold text-navy-800">Wydawca</h2>
        <p>
          Serwis kalendarz.pro prowadzi <strong>{COMPANY.legalName}</strong>, {COMPANY.street},{" "}
          {COMPANY.postal} {COMPANY.city}, NIP {COMPANY.nip}, REGON {COMPANY.regon}, KRS {COMPANY.krs}.
        </p>

        <h2 className="pt-2 text-xl font-bold text-navy-800">Kontakt</h2>
        <p>
          Masz uwagę, znalazłeś błąd w danych albo chcesz zaproponować nowy kalendarz? Napisz do nas:{" "}
          <a href={`mailto:${COMPANY.email}`} className="text-navy-600 hover:underline">
            {COMPANY.email}
          </a>
          . Chętnie poprawiamy i rozwijamy serwis w oparciu o opinie użytkowników.
        </p>

        <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
          Serwis ma charakter informacyjny. Dokładamy starań, aby dane były poprawne, ale nie ponosimy
          odpowiedzialności za decyzje podjęte wyłącznie na ich podstawie. W sprawach urzędowych zawsze
          potwierdź datę w oficjalnym źródle.
        </p>
      </div>
    </PageWithSidebar>
  );
}
