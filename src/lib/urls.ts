import { MONTH_SLUGS } from "./months";

// Centralne budowanie adresów — kanoniczna struktura /kalendarz/…
// Zmiana tu = zmiana w całym serwisie.

export const url = {
  year: (y: number) => `/kalendarz/${y}`,
  month: (y: number, m: number) => `/kalendarz/${MONTH_SLUGS.pl[m]}-${y}`,
  day: (y: number, m: number, d: number) => `/kalendarz/${MONTH_SLUGS.pl[m]}-${y}/${d}`,
  printMonth: (y: number, m: number) => `/kalendarz-do-druku/${MONTH_SLUGS.pl[m]}-${y}`,
  printYear: (y: number) => `/kalendarz-do-druku/${y}`,
  pdfMonth: (y: number, m: number) => `/api/pdf/pl/${y}/${MONTH_SLUGS.pl[m]}`,
};
