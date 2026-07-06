// Bezpieczna serializacja JSON-LD do wstrzyknięcia w <script type="application/ld+json">.
// JSON.stringify NIE escapuje znaku "<", więc dynamiczny string zawierający
// "</script>" (np. w tytule/FAQ generowanym przez AI) zamknąłby wcześniej tag script
// i pozwolił na wstrzyknięcie kodu (XSS). Escapujemy "<" na < — treść pozostaje
// poprawnym JSON-em, a parser HTML nie zobaczy fałszywego zamknięcia tagu.
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
