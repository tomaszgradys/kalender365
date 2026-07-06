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
// TODO(legal): confirm the legal entity that operates kalender365.pro and fill
// in real Impressum details (§5 DDG / §18 MStV require: name, address, contact,
// USt-IdNr. / Handelsregister if applicable). Placeholders below MUST NOT go
// live unchanged.
export const COMPANY = {
  legalName: "TODO: Betreiber (juristische Person oder Einzelperson)",
  street: "TODO: Straße und Hausnummer",
  postal: "TODO: PLZ",
  city: "TODO: Ort",
  country: "Deutschland",
  email: "kontakt@kalender365.pro",
  vatId: "TODO: USt-IdNr. (falls vorhanden)",
  responsible: "TODO: inhaltlich Verantwortlicher (§18 Abs. 2 MStV)",
} as const;
