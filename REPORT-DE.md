# Kalender365.pro — Lokalisierungs-Report (DE)

Standalone-Klon von **kalendarz.pro** → **kalender365.pro**. Die polnische Version
bleibt unberührt (eigenes Repo). Dieser Report deckt DoD-Punkt 11 ab.

## Status auf einen Blick

Fertig und getestet ist die **deterministische deutsche Daten-/Logik-Schicht**
(`src/lib/de/`) — der eigentlich schwierige, rechtlich sensible Kern der
Lokalisierung. Die **Routen-/UI-Migration** (Umbenennung der PL-Ordner in `src/app/(pl)`
auf deutsche Slugs, Nav/Footer/Views auf Deutsch) ist als klar umrissener
nächster Schritt offen. Begründung: die PL-Routen tragen polnische Slugs in den
Ordnernamen; das ist mechanische Fleißarbeit, die ohne korrekten Datenkern
sinnlos wäre — deshalb zuerst der Kern.

## Was neu ist (`src/lib/de/`)

| Datei | Inhalt |
|---|---|
| `bundeslaender.ts` | Alle 16 Länder: Code, Name (Umlaute), Slug (ASCII), NRW-Abkürzung, Lookups |
| `feiertage.ts` | Feiertags-Provider für alle 16 Länder, deterministisch (Gauß/Meeus) |
| `arbeitstage.ts` | Arbeitstage (5-Tage) **und** Werktage (6-Tage) pro Land, Kalkulator |
| `brueckentage.ts` | Brückentage + lange Wochenenden pro Land, nach Effizienz sortiert |
| `schulferien.ts` | Typsystem + Provider + Quellen-Metadaten + SEO-Gate (nur verifiziert = indexierbar) |
| `weeks.ts` | ISO-8601-Kalenderwochen (KW), Wochenbereiche |
| `locale.ts` | Monats-/Wochentagsnamen + Slugs (Umlaut→ae/oe/ue), de-DE-Formate |
| `now.ts` | „Heute" in Europe/Berlin, ISO-Wochenberechnung |
| `routes.ts` | Zentraler URL-Builder für das komplette deutsche Routing-Schema |
| `site.ts` | Basis-Config: URL, Name, Locale, Default-Ort Berlin, Impressum-Platzhalter |

Tests: `tests/*.test.ts` (23 Tests, alle grün) — `npm test` (Node 24, nativer TS-Runner, keine Abhängigkeit).

## Feiertags-Modell — abgedeckte Fälle (getestet)

- 9 bundesweite Feiertage (Neujahr, Karfreitag, Ostermontag, Tag der Arbeit,
  Christi Himmelfahrt, Pfingstmontag, Tag der Deutschen Einheit, 1./2. Weihnachtsfeiertag).
- **Regional:** Heilige Drei Könige (BW/BY/ST), Frauentag (BE seit 2019, MV seit 2023),
  Weltkindertag (TH seit 2019), Reformationstag (9 Länder), Allerheiligen (5 Länder),
  Mariä Himmelfahrt (SL voll).
- **Partial (kein Auto-Frei):** Fronleichnam nur teils in SN/TH; Mariä Himmelfahrt
  nur kath. Gemeinden BY; Augsburger Friedensfest nur Stadt Augsburg.
- **Buß- und Bettag:** gesetzlich nur SN (Mittwoch vor dem 23.11.).
- **Sunday-legal:** Brandenburg Oster-/Pfingstsonntag — als Feiertag markiert, fällt
  aber immer auf Sonntag, zählt daher **nicht** als zusätzlicher freier Tag.
- **Bewusst NICHT übernommen:** polnische „Samstag-Feiertag → Ersatztag"-Regel.
  `arbeitstage.ts` wendet sie nirgends an (eigener Test).

## Neue Routen (Schema, via `routes.ts`)

Kalender: `/`, `/kalender/{jahr}`, `/kalender/{jahr}/{land}`, `/kalender/{monat}-{jahr}`,
`/kalender/{monat}-{jahr}/{land}`, `/kalenderblatt/{YYYY-MM-DD}`, `/kalender-zum-ausdrucken/{jahr}`.
Feiertage/Arbeit: `/feiertage/{jahr}`, `/feiertage/{jahr}/{land}`, `/gesetzliche-feiertage/{jahr}` (Alias→canonical),
`/arbeitstage/{jahr}(/{land})`, `/brueckentage/{jahr}(/{land})`, `/urlaubsplaner/{jahr}`.
Schule: `/schulferien/{jahr}(/{land})`, `/sommerferien|weihnachtsferien|osterferien/{jahr}/{land}`.
Zeit/Natur: `/kalenderwochen/{jahr}`, `/kw/{kw}-{jahr}`, `/mondphasen|vollmond|neumond|zeitumstellung|jahreszeiten/{jahr}`,
`/sonnenaufgang-sonnenuntergang`.
Tools: `/tage-rechner`, `/arbeitstage-rechner`, `/wochentag-rechner`, `/altersrechner`, `/countdown`, `/stundenplan`, `/generatoren`.
Legal: `/impressum`, `/datenschutz`, `/cookies`, `/nutzungsbedingungen`, `/so-berechnen-wir`, `/kontakt`.
Export: `/api/pdf/de/{jahr}/{monat}`, `/api/pdf/de/rok/{jahr}`, `/api/ics/feiertage/{jahr}/{land}`, `/api/ics/schulferien/{jahr}/{land}`.

## Datenlage

**Komplett & verifiziert (deterministisch berechnet):** Feiertage aller 16 Länder,
Arbeits-/Werktage, Brückentage, Kalenderwochen, Ostern — für **jedes** Jahr.

**Erfordert manuelle Verifikation vor Indexierung:**
- **Schulferien** — nur strukturiert, mit **einem unverifizierten Beispiel** (BY 2026,
  `lastVerifiedAt: null`). `isSchulferienIndexable()` liefert dafür `false` → noindex.
  TODO: alle 16 Länder × 2026/2027 aus KMK/Landesministerien seeden und verifizieren.
- **Impressum/Datenschutz** — `site.ts COMPANY` enthält nur Platzhalter. Betreiber,
  Anschrift, USt-IdNr., inhaltlich Verantwortlicher (§5 DDG/§18 MStV) müssen ergänzt werden.

## Risiken (SEO/Recht)
- **Schulferien** dürfen erst live/indexiert werden, wenn verifiziert — sonst falsche
  offizielle Termine (Rechts-/Reputationsrisiko). Gate ist eingebaut, muss respektiert werden.
- **Impressumspflicht:** Ohne echtes Impressum darf die Seite nicht öffentlich gehen (Abmahnrisiko).
- **Feiertags-„partial"-Fälle** klar als solche kennzeichnen (Fronleichnam SN/TH, Mariä
  Himmelfahrt BY) — sonst Falschinformation für Arbeitnehmer.
- Arbeitnehmer-Hinweise neutral halten (abhängig von Vertrag/Tarif/Branche), keine Rechtsberatung.

## Nächste Schritte
1. Routen-Gerüst in `src/app/` nach `routes.ts` anlegen (deutsche Slugs), PL-`(pl)`-Gruppe als Vorlage.
2. Nav/Footer/Views (`MainNav`, `SiteFooter`, `YearView`, `MonthView`, `DayView`) auf `de/locale` + `de/routes` umstellen.
3. `now.ts`/`site.ts`/Monatsnamen in Komponenten von PL auf `de/*` umziehen.
4. Schulferien-Daten seeden + verifizieren; SEO-Gate scharf schalten.
5. PDF/ICS/CSV-Labels auf Deutsch (Mo Di Mi Do Fr Sa So, KW, Feiertage, Bundesland: …).
6. sitemap/robots/canonical/hreflang, JSON-LD (WebSite+SearchAction, BreadcrumbList, FAQPage, ItemList).
7. Echtes Impressum/Datenschutz; GitHub-Remote + Vercel-Projekt für `kalender365.pro` anlegen.
