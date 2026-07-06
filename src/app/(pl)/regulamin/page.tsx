import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Regulamin",
  description:
    "Regulamin korzystania z serwisu kalendarz.pro — bezpłatnego serwisu z kalendarzami, narzędziami i generatorami. Zasady korzystania, zastrzeżenia i prawa autorskie.",
  alternates: { canonical: "/regulamin" },
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold text-navy-800">{children}</h2>;
}

export default function Page() {
  return (
    <LegalPage title="Regulamin" updated="4 lipca 2026">
      <p>
        Regulamin określa zasady korzystania z serwisu <strong>kalendarz.pro</strong> (dalej „Serwis"),
        prowadzonego przez <strong>{COMPANY.legalName}</strong> z siedzibą we Wrocławiu,{" "}
        {COMPANY.street}, {COMPANY.postal} {COMPANY.city}, {COMPANY.registryNote} pod numerem KRS{" "}
        {COMPANY.krs}, NIP {COMPANY.nip}, REGON {COMPANY.regon} (dalej „Usługodawca").
        Korzystając z Serwisu, akceptujesz poniższe warunki.
      </p>

      <H>1. Charakter serwisu</H>
      <p>
        Serwis jest bezpłatny i ma charakter informacyjny. Udostępnia kalendarze, narzędzia i
        generatory (m.in. kalendarze miesięczne i roczne, dni wolne i robocze, święta, fazy księżyca,
        imieniny, kalkulatory, plan lekcji) do użytku osobistego i informacyjnego. Korzystanie nie
        wymaga zakładania konta.
      </p>

      <H>2. Zastrzeżenia dotyczące treści</H>
      <p>
        Dokładamy starań, aby dane były poprawne, jednak mają one charakter orientacyjny i
        informacyjny. Dotyczy to w szczególności terminów świąt, dni wolnych, ferii, niedziel
        handlowych, faz księżyca oraz kalkulatorów (w tym kalkulatora ciąży, kalendarza ogrodnika i
        wędkarza). Treści te <strong>nie stanowią porady prawnej, medycznej ani zawodowej</strong>.
        Przed podjęciem istotnych decyzji zweryfikuj informacje w źródłach urzędowych lub u
        specjalisty. Nie ponosimy odpowiedzialności za skutki decyzji podjętych na podstawie treści z
        Serwisu.
      </p>

      <H>3. Dostępność</H>
      <p>
        Staramy się zapewnić ciągłą dostępność Serwisu, ale nie gwarantujemy nieprzerwanego działania.
        Zastrzegamy sobie prawo do zmian, przerw technicznych oraz modyfikacji funkcji.
      </p>

      <H>4. Prawa autorskie</H>
      <p>
        Układ, grafika, logo, teksty i kod Serwisu są chronione prawem autorskim. Wygenerowane pliki
        (np. PDF planu lekcji lub kalendarza) możesz swobodnie drukować i wykorzystywać na własne
        potrzeby. Zabronione jest masowe kopiowanie, scrapowanie i komercyjne rozpowszechnianie treści
        Serwisu bez zgody.
      </p>

      <H>5. Dane osobowe</H>
      <p>
        Zasady przetwarzania danych opisuje <a href="/polityka-prywatnosci">polityka prywatności</a>, a
        wykorzystanie plików cookies — <a href="/polityka-cookies">polityka cookies</a>.
      </p>

      <H>6. Kontakt i reklamacje</H>
      <p>
        Uwagi, błędy w danych i reklamacje możesz zgłaszać do Usługodawcy na adres e-mail:{" "}
        <strong>{COMPANY.email}</strong> lub pisemnie na adres siedziby: {COMPANY.legalName},{" "}
        {COMPANY.street}, {COMPANY.postal} {COMPANY.city}. Postaramy się odpowiedzieć w rozsądnym
        terminie.
      </p>

      <H>7. Zmiany regulaminu</H>
      <p>
        Regulamin może ulec zmianie. Aktualna wersja obowiązuje od dnia publikacji na tej stronie.
      </p>
    </LegalPage>
  );
}
