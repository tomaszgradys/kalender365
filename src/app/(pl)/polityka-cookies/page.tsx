import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import { COMPANY } from "@/lib/company";

export const metadata: Metadata = {
  title: "Polityka cookies",
  description:
    "Polityka plików cookies serwisu kalendarz.pro. Używamy tylko niezbędnych plików i pamięci przeglądarki — bez śledzenia i reklam. Dowiedz się, jak nimi zarządzać.",
  alternates: { canonical: "/polityka-cookies" },
};

function H({ children }: { children: React.ReactNode }) {
  return <h2 className="text-lg font-bold text-navy-800">{children}</h2>;
}

export default function Page() {
  return (
    <LegalPage title="Polityka cookies" updated="4 lipca 2026">
      <p>
        Ta strona wyjaśnia, jakich plików cookies i mechanizmów pamięci przeglądarki używa serwis{" "}
        <strong>kalendarz.pro</strong>, prowadzony przez <strong>{COMPANY.legalName}</strong>{" "}
        ({COMPANY.street}, {COMPANY.postal} {COMPANY.city}, NIP {COMPANY.nip}).
      </p>

      <H>Czym są cookies i localStorage</H>
      <p>
        Pliki cookies to niewielkie pliki zapisywane w przeglądarce. localStorage to podobny mechanizm
        pozwalający zapisać dane lokalnie na Twoim urządzeniu. Oba służą nam wyłącznie do zapewnienia
        działania funkcji serwisu.
      </p>

      <H>Jakich plików używamy</H>
      <div className="overflow-hidden rounded-2xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Nazwa</th>
              <th className="px-4 py-2 text-left font-medium">Rodzaj</th>
              <th className="px-4 py-2 text-left font-medium">Cel</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            <tr className="border-t border-slate-100">
              <td className="px-4 py-2 font-mono text-xs">cookie-consent</td>
              <td className="px-4 py-2">niezbędny</td>
              <td className="px-4 py-2">zapamiętanie Twojej decyzji dotyczącej cookies</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="px-4 py-2 font-mono text-xs">plan-lekcji</td>
              <td className="px-4 py-2">funkcjonalny</td>
              <td className="px-4 py-2">zapis Twojego planu lekcji w generatorze (lokalnie)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <H>Czego NIE używamy</H>
      <p>
        Nie stosujemy plików cookies analitycznych, reklamowych ani śledzących. Nie osadzamy
        zewnętrznych skryptów marketingowych. Jeśli w przyszłości to się zmieni, zaktualizujemy tę
        politykę i poprosimy o zgodę.
      </p>

      <H>Jak zarządzać</H>
      <p>
        Możesz w każdej chwili wyczyścić pliki i pamięć strony w ustawieniach swojej przeglądarki. Swoją
        decyzję dotyczącą cookies na tej stronie możesz zmienić tutaj:
      </p>
      <CookieSettingsLink />
    </LegalPage>
  );
}
