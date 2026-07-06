import { SITE_URL } from "@/lib/site";

// Dane strukturalne WebApplication dla interaktywnych narzędzi/kalkulatorów.
// Darmowe (Offer price 0), w przeglądarce, po polsku. Nie nadużywać — tylko tam,
// gdzie faktycznie jest działające narzędzie.
export default function SoftwareAppJsonLd({
  name,
  path,
  description,
}: {
  name: string;
  path: string;
  description: string;
}) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    url: `${SITE_URL}${path}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web (dowolna przeglądarka)",
    inLanguage: "pl-PL",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "PLN" },
    description,
    publisher: { "@type": "Organization", name: "Kalendarz.pro", url: SITE_URL },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />;
}
