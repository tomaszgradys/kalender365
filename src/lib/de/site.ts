// Base config for the German product. Single source of truth for metadata
// (canonical, OG, sitemap, JSON-LD, PDF QR/footer).
export const SITE_URL = "https://kalender365.pro";
export const SITE_NAME = "Kalender365.pro";
export const SITE_SHORT = "Kalender365";
export const LOCALE = "de-DE";
export const TIMEZONE = "Europe/Berlin";

// Default location for sunrise/sunset and "Kalenderblatt des Tages".
export const DEFAULT_CITY = { name: "Berlin", lat: 52.52, lon: 13.405 };

// Operator / Impressum data.
// Betreiber ist eine polnische Kapitalgesellschaft (EU), die kalender365.pro
// betreibt. Für das deutsche Impressum (§5 DDG / §18 MStV) werden Name,
// Anschrift, Kontakt, USt-IdNr. (EU-VAT) und der inhaltlich Verantwortliche
// angegeben; Register = polnisches KRS (kein deutsches Handelsregister).
export const COMPANY = {
  legalName: "Profivo Sp. z o.o.",
  street: "ul. Paprotna 8B/14",
  postal: "51-117",
  city: "Wrocław",
  country: "Polen",
  email: "kontakt@profivo.pl",
  phone: "+48 459 599 399",
  vatId: "PL9151835807",
  register: "KRS 0001181942 (Rejestr Przedsiębiorców, Sąd Rejonowy für Wrocław-Fabryczna)",
  regon: "542154491",
  responsible: "Tomasz Gradys",
} as const;
