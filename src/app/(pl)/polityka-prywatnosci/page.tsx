import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Polityka prywatności",
  description:
    "Polityka prywatności serwisu kalendarz.pro. Serwis jest bezpłatny, nie wymaga konta i nie zbiera danych osobowych. Sprawdź, jak przetwarzamy dane i jakie masz prawa (RODO).",
  alternates: { canonical: "/polityka-prywatnosci" },
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold text-navy-800">{children}</h2>;
}

export default function Page() {
  return (
    <LegalPage title="Polityka prywatności" updated="4 lipca 2026">
      <p>
        Niniejsza polityka opisuje, jak serwis <strong>kalendarz.pro</strong> przetwarza dane w związku
        z korzystaniem ze strony. Zależy nam na prostocie: serwis jest bezpłatny, nie wymaga konta i nie
        zbiera danych osobowych w celach marketingowych.
      </p>

      <H>1. Administrator danych</H>
      <p>
        Administratorem danych oraz operatorem serwisu kalendarz.pro jest{" "}
        <strong>{COMPANY.legalName}</strong> z siedzibą we Wrocławiu, {COMPANY.street},{" "}
        {COMPANY.postal} {COMPANY.city}, {COMPANY.registryNote} pod numerem KRS {COMPANY.krs},
        NIP {COMPANY.nip}, REGON {COMPANY.regon}.
      </p>
      <p>
        W sprawach dotyczących prywatności i ochrony danych możesz skontaktować się z nami pod adresem
        e-mail: <strong>{COMPANY.email}</strong>.
      </p>

      <H>2. Jakie dane przetwarzamy</H>
      <ul className="list-disc space-y-1 pl-5">
        <li>
          <strong>Nie prowadzimy kont użytkowników</strong> ani formularzy zbierających dane osobowe.
        </li>
        <li>
          <strong>Dane zapisywane lokalnie</strong> — narzędzia takie jak generator planu lekcji
          zapisują Twoje ustawienia i treści w pamięci Twojej przeglądarki (localStorage). Te dane{" "}
          <strong>nie są wysyłane na nasz serwer</strong> i pozostają na Twoim urządzeniu.
        </li>
        <li>
          <strong>Logi techniczne</strong> — nasz dostawca hostingu może automatycznie przetwarzać
          standardowe dane techniczne (np. adres IP, typ przeglądarki, czas zapytania) w celu
          zapewnienia działania i bezpieczeństwa serwisu.
        </li>
      </ul>

      <H>3. Podstawa i cel przetwarzania</H>
      <p>
        Dane techniczne przetwarzamy na podstawie prawnie uzasadnionego interesu (art. 6 ust. 1 lit. f
        RODO), jakim jest zapewnienie bezpieczeństwa, stabilności i prawidłowego działania serwisu.
        Dane zapisywane lokalnie przetwarzane są wyłącznie na Twoim urządzeniu na potrzeby działania
        wybranych funkcji.
      </p>

      <H>4. Odbiorcy danych</H>
      <p>
        Serwis hostowany jest na infrastrukturze Vercel Inc., która jako podmiot przetwarzający może
        przetwarzać dane techniczne w naszym imieniu. Transfer danych poza Europejski Obszar
        Gospodarczy odbywa się na podstawie standardowych klauzul umownych. Nie sprzedajemy ani nie
        udostępniamy danych podmiotom trzecim w celach marketingowych.
      </p>

      <H>5. Pliki cookies i pamięć przeglądarki</H>
      <p>
        Używamy wyłącznie niezbędnych plików i pamięci przeglądarki (m.in. zapamiętanie zgody na
        cookies oraz dane narzędzi, np. planu lekcji). Nie stosujemy cookies analitycznych ani
        marketingowych. Szczegóły znajdziesz w <a href="/polityka-cookies">polityce cookies</a>.
      </p>

      <H>6. Twoje prawa</H>
      <p>
        Masz prawo dostępu do danych, ich sprostowania, usunięcia lub ograniczenia przetwarzania,
        prawo sprzeciwu oraz prawo wniesienia skargi do Prezesa Urzędu Ochrony Danych Osobowych
        (PUODO). Dane zapisane lokalnie możesz w każdej chwili usunąć, czyszcząc dane przeglądarki dla
        tej strony.
      </p>

      <H>7. Zmiany polityki</H>
      <p>
        Politykę możemy aktualizować w związku ze zmianami w serwisie lub przepisach. Aktualna wersja
        jest zawsze dostępna na tej stronie z datą ostatniej aktualizacji.
      </p>
    </LegalPage>
  );
}
