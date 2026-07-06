# Blog kalendarz.pro — architektura i plan contentu (60 dni / 30 wpisów)

Dokument roboczy dla redakcji bloga. Zawiera: (1) architekturę systemu, (2) zasady SEO,
(3) plan 30 wpisów publikowanych co 2 dni, (4) design modułu na stronie głównej.

> ⚠️ **Uwaga:** poniższa lista 30 tematów to WYŁĄCZNIE inspiracja/referencja. Auto-blog NIE korzysta
> z żadnej stałej kolejki — model dobiera temat DYNAMICZNIE pod bieżący moment i trendy (patrz
> `src/lib/blogGen.ts`): sprawdza web_search, „radar" nadchodzących dat i ostatnio opublikowane wpisy,
> żeby się nie powtarzać i trafić w dobry moment (2-6 tyg. przed szczytem, pod Google Discover).

---

## 1. Architektura systemu (zbudowana)

| Element | Rozwiązanie |
|---|---|
| URL listingu | `/blog` |
| URL wpisu | `/blog/<slug>` (slug = kebab-case, fraza główna) |
| URL kategorii | `/blog/kategoria/<kategoria>` |
| Model treści | `src/content/blog/<slug>.tsx` — każdy wpis to moduł TSX (`export const post`) |
| Rejestr | `src/lib/blog.ts` — typ `BlogPost`, helpery, kategorie |
| Layout wpisu | hero + H1 + meta (data, czas czytania) + lead + spis treści + treść + FAQ + CTA + powiązane |
| Moduł na stronie głównej | `src/components/BlogTeaser.tsx` — sekcja „Z bloga" (1 wyróżniony + 2 kolejne) |
| Schema.org | `BlogPosting` (wpis), `FAQPage` (FAQ), `BreadcrumbList` (okruszki), `Blog` (listing) |
| Meta title / description | pola `metaTitle` / `metaDescription` w każdym wpisie |
| Open Graph | `type: article`, `publishedTime`, `modifiedTime`, obraz (cover lub domyślny OG) |
| Sitemap | opublikowane wpisy + kategorie dodawane automatycznie w `src/app/sitemap.ts` |
| Grafiki | `cover.src` (fal.ai, `/public/blog/...`); brak pliku → estetyczny gradient kategorii |

### Publikacja „co 2 dni" — jak działa (bez crona)
Każdy wpis ma pole `publishedAt` (YYYY-MM-DD, strefa Europe/Warsaw). Helper `publishedPosts()`
pokazuje wpis dopiero, gdy `publishedAt <= dziś`. Listing, strona główna i sitemap filtrują po tej
dacie, a strona wpisu zwraca 404 dla dat przyszłych. Dzięki ISR (`revalidate = 3600`) wpis pojawia
się automatycznie w dniu publikacji — wystarczy raz wgrać pliki z rozpisanymi datami co 2 dni.

### Kategorie (6)
- `swieta-i-dni-wolne` — Święta i dni wolne
- `planowanie-urlopu` — Planowanie urlopu
- `szkola-i-ferie` — Szkoła i ferie
- `pory-roku-i-sezon` — Pory roku i sezon
- `ksiezyc-i-natura` — Księżyc i natura
- `tradycje-i-ciekawostki` — Tradycje i ciekawostki

### Linkowanie wewnętrzne — docelowe strony (anchory)
`/dni-wolne-od-pracy/{rok}`, `/dlugie-weekendy/{rok}`, `/swieta/{rok}`, `/niedziele-handlowe/{rok}`,
`/kalendarz/{miesiac}-{rok}`, `/kalendarz/{rok}`, `/kalendarz-szkolny/{rok}`, `/ferie-zimowe/{rok}`,
`/fazy-ksiezyca/{rok}`, `/pelnia-ksiezyca/{rok}`, `/zmiana-czasu/{rok}`, `/pory-roku/{rok}`,
`/wielkanoc/{rok}`, `/imieniny`, `/swieta-nietypowe/{rok}`, `/tydzien/{rok}/{tydzien}`,
`/kalendarz-ogrodnika/{rok}`, `/kalendarz-wedkarza/{rok}`, `/ile-dni-do-*`, `/kalendarz-do-druku/{rok}`.

---

## 2. Zasady SEO (obowiązują każdy wpis)
- Meta title ≤ ~580 px (≈ 55–60 znaków), bez sufiksu marki.
- Meta description 140–155 znaków, z zachętą do kliknięcia (CTR).
- 1 H1, logiczna hierarchia H2/H3 z frazami i synonimami (bez keyword stuffingu).
- 900–1500 słów użytecznej treści, zdania średnio 12–18 słów.
- Lead (2–3 zdania) + spis treści (kotwice) + sekcja praktyczna + FAQ + podsumowanie + CTA.
- 4–8 naturalnych linków wewnętrznych do właściwych kalendarzy.
- Frazy long-tail w H2/H3 i FAQ; treść aktualna, oparta o realne daty (weryfikować dni tygodnia!).
- Każdy wpis unikalny, odpowiada na jedną główną intencję.

---

## 3. Plan 30 wpisów (co 2 dni, start 2026-07-05)

Format skrócony: **[data] Tytuł SEO** — H1 · slug · fraza gł. · long-tail · intencja · długość ·
meta title · meta description · anchory · grafika fal.ai · potencjał SEO.

### 01 · 2026-07-05 · planowanie-urlopu — ZBUDOWANY
**Długie weekendy do końca 2026 roku — kiedy wziąć urlop**
slug: `dlugie-weekendy-do-konca-2026` · kw: „długie weekendy 2026" · intencja: transakcyjno-informacyjna ·
~1100 słów · anchory: /dlugie-weekendy/2026, /dni-wolne-od-pracy/2026, /kalendarz/listopad-2026,
/kalendarz/grudzien-2026, /niedziele-handlowe/2026, /kalendarz-szkolny/2026.

### 02 · 2026-07-07 · szkola-i-ferie
**Kalendarz roku szkolnego 2026/2027 — wszystkie terminy** · H1: „Kalendarz roku szkolnego 2026/2027" ·
slug: `kalendarz-roku-szkolnego-2026-2027` · kw: „rok szkolny 2026/2027" · pomocnicze: rozpoczęcie roku
szkolnego, przerwy świąteczne, zakończenie · long-tail: „kiedy zaczyna się rok szkolny 2026" · intencja:
informacyjna · 1200 słów · meta title: „Rok szkolny 2026/2027 — terminy, ferie, dni wolne" · meta desc:
„Rozpoczęcie i zakończenie roku szkolnego 2026/2027, przerwy świąteczne i ferie zimowe. Wszystkie
terminy w jednym miejscu." · anchory: /kalendarz-szkolny/2026, /ferie-zimowe/2027, /dni-wolne-od-pracy/2026 ·
grafika: plecak i kalendarz szkolny, paleta granat/zieleń · potencjał: bardzo wysokie sezonowe zapytania VIII–IX.

### 03 · 2026-07-09 · pory-roku-i-sezon
**Ile dni do końca wakacji 2026? Odliczanie do 1 września** · slug: `ile-dni-do-konca-wakacji-2026` ·
kw: „koniec wakacji 2026" · long-tail: „kiedy koniec wakacji 2026", „ile zostało wakacji" · intencja:
informacyjna · 900 słów · anchory: /ile-dni-do-wakacji, /kalendarz-szkolny/2026, /kalendarz/wrzesien-2026 ·
grafika: plaża i kartka z kalendarza sierpień/wrzesień · potencjał: szczyt wyszukiwań w VIII.

### 04 · 2026-07-11 · swieta-i-dni-wolne
**Dni wolne od pracy 2027 — pełna lista i długie weekendy** · slug: `dni-wolne-od-pracy-2027` ·
kw: „dni wolne 2027" · long-tail: „ile dni wolnych w 2027", „kalendarz świąt 2027" · intencja: informacyjna ·
1200 słów · anchory: /dni-wolne-od-pracy/2027, /dlugie-weekendy/2027, /swieta/2027, /kalendarz/2027 ·
grafika: kalendarz roczny 2027 z zaznaczonymi świętami · potencjał: rośnie od H2 poprzedniego roku.

### 05 · 2026-07-13 · szkola-i-ferie
**Ferie zimowe 2027 — terminy dla wszystkich województw** · slug: `ferie-zimowe-2027-terminy` ·
kw: „ferie zimowe 2027" · long-tail: „ferie 2027 województwa", „kiedy ferie 2027 mazowieckie" · intencja:
informacyjna · 1100 słów · anchory: /ferie-zimowe/2027, /kalendarz-szkolny/2026 · grafika: mapa Polski z
terminami ferii, motyw zimowy · potencjał: bardzo wysokie, długo utrzymujące się zapytania.

### 06 · 2026-07-15 · swieta-i-dni-wolne
**Kiedy wypada Wielkanoc 2027? Data i święta ruchome** · slug: `wielkanoc-2027-kiedy-wypada` ·
kw: „Wielkanoc 2027" · long-tail: „kiedy Wielkanoc 2027", „Boże Ciało 2027" · intencja: informacyjna ·
900 słów · anchory: /wielkanoc/2027, /dni-wolne-od-pracy/2027, /kalendarz/2027 · grafika: wiosenny stół
wielkanocny, pastele · potencjał: evergreen z sezonowym pikiem.

### 07 · 2026-07-17 · pory-roku-i-sezon
**Zmiana czasu 2026 — kiedy przestawiamy zegarki na zimowy** · slug: `zmiana-czasu-2026-zimowy` ·
kw: „zmiana czasu 2026" · long-tail: „kiedy zmiana czasu październik 2026", „czas zimowy 2026" · intencja:
informacyjna · 900 słów · anchory: /zmiana-czasu/2026, /pory-roku/2026 · grafika: zegar cofany o godzinę,
jesienna sceneria · potencjał: gwałtowny pik X, powtarzalny co roku.

### 08 · 2026-07-19 · planowanie-urlopu
**Kalendarz na 2027 rok — dni wolne, święta i długie weekendy** · slug: `kalendarz-2027` ·
kw: „kalendarz 2027" · long-tail: „kalendarz 2027 z dniami wolnymi", „święta 2027" · intencja: informacyjna ·
1300 słów · anchory: /kalendarz/2027, /dni-wolne-od-pracy/2027, /dlugie-weekendy/2027, /kalendarz-do-druku/2027 ·
grafika: rozłożony kalendarz roczny 2027 · potencjał: bardzo wysoki wolumen, rośnie do końca roku.

### 09 · 2026-07-21 · swieta-i-dni-wolne
**Niedziele handlowe 2026 — kiedy zrobisz zakupy** · slug: `niedziele-handlowe-2026` ·
kw: „niedziele handlowe 2026" · long-tail: „najbliższa niedziela handlowa", „niedziele handlowe grudzień 2026" ·
intencja: informacyjna · 900 słów · anchory: /niedziele-handlowe/2026 · grafika: wózek sklepowy i kalendarz ·
potencjał: stały wysoki wolumen przez cały rok.

### 10 · 2026-07-23 · tradycje-i-ciekawostki
**Święta państwowe w Polsce — pełna lista i znaczenie** · slug: `swieta-panstwowe-w-polsce` ·
kw: „święta państwowe" · long-tail: „lista świąt narodowych Polska", „święta ustawowo wolne" · intencja:
informacyjna · 1200 słów · anchory: /swieta/2026, /dni-wolne-od-pracy/2026 · grafika: flaga Polski, motyw
patriotyczny · potencjał: evergreen, filar topical authority.

### 11 · 2026-07-25 · ksiezyc-i-natura
**Fazy księżyca 2026 — pełnie, nowie i kalendarz** · slug: `fazy-ksiezyca-2026` · kw: „fazy księżyca 2026" ·
long-tail: „kalendarz księżycowy 2026", „kiedy pełnia 2026" · intencja: informacyjna · 1100 słów ·
anchory: /fazy-ksiezyca/2026, /pelnia-ksiezyca/2026, /now-ksiezyca/2026 · grafika: fazy księżyca na
granatowym niebie · potencjał: wysoki, stabilny wolumen.

### 12 · 2026-07-27 · ksiezyc-i-natura
**Pełnia księżyca 2026 — daty i wpływ na sen** · slug: `pelnia-ksiezyca-2026-daty` · kw: „pełnia księżyca 2026" ·
long-tail: „najbliższa pełnia", „pełnia sierpień 2026" · intencja: informacyjna · 900 słów ·
anchory: /pelnia-ksiezyca/2026, /fazy-ksiezyca/2026 · grafika: pełnia nad jeziorem · potencjał: comiesięczne piki.

### 13 · 2026-07-29 · ksiezyc-i-natura
**Kalendarz ogrodnika — co siać i sadzić jesienią** · slug: `kalendarz-ogrodnika-jesien` · kw: „kalendarz ogrodnika" ·
long-tail: „co siać we wrześniu", „prace w ogrodzie jesienią" · intencja: informacyjna · 1200 słów ·
anchory: /kalendarz-ogrodnika/2026, /fazy-ksiezyca/2026, /pory-roku/2026 · grafika: jesienny ogród, warzywa ·
potencjał: sezonowe, praktyczne, długi ogon.

### 14 · 2026-07-31 · pory-roku-i-sezon
**Pierwszy dzień jesieni 2026 — kiedy i dlaczego** · slug: `pierwszy-dzien-jesieni-2026` · kw: „pierwszy dzień jesieni 2026" ·
long-tail: „kiedy jesień astronomiczna 2026", „równonoc jesienna" · intencja: informacyjna · 900 słów ·
anchory: /pory-roku/2026, /kalendarz/wrzesien-2026 · grafika: jesienne liście, złota godzina · potencjał: pik IX.

### 15 · 2026-08-02 · tradycje-i-ciekawostki
**Imieniny dziś — jak sprawdzić, kto obchodzi imieniny** · slug: `imieniny-dzis-jak-sprawdzic` · kw: „imieniny dziś" ·
long-tail: „kto ma dziś imieniny", „imieniny jutro" · intencja: informacyjna/nawigacyjna · 900 słów ·
anchory: /imieniny, /kalendarz/{dziś} · grafika: kartka z kalendarza z imieniem · potencjał: ogromny, codzienny wolumen.

### 16 · 2026-08-04 · tradycje-i-ciekawostki
**Święta nietypowe — kalendarz dni nietypowych 2026** · slug: `swieta-nietypowe-2026` · kw: „święta nietypowe" ·
long-tail: „dzień kota", „nietypowe święto dziś" · intencja: informacyjna · 1000 słów ·
anchory: /swieta-nietypowe/2026, /imieniny · grafika: kolorowe ikony nietypowych świąt · potencjał: viralowy, długi ogon.

### 17 · 2026-08-06 · swieta-i-dni-wolne
**Ile dni do Bożego Narodzenia 2026? Odliczanie** · slug: `ile-dni-do-bozego-narodzenia-2026` · kw: „ile dni do świąt 2026" ·
long-tail: „ile dni do Wigilii", „odliczanie do świąt" · intencja: informacyjna · 900 słów ·
anchory: /ile-dni-do-bozego-narodzenia, /kalendarz/grudzien-2026, /dlugie-weekendy/2026 · grafika: choinka i licznik ·
potencjał: rośnie lawinowo od IX.

### 18 · 2026-08-08 · swieta-i-dni-wolne
**Adwent 2026 — kiedy się zaczyna i co oznacza** · slug: `adwent-2026-kiedy` · kw: „adwent 2026" ·
long-tail: „pierwsza niedziela adwentu 2026", „kalendarz adwentowy" · intencja: informacyjna · 900 słów ·
anchory: /kalendarz/grudzien-2026, /swieta/2026 · grafika: wieniec adwentowy ze świecami · potencjał: sezonowy pik XI–XII.

### 19 · 2026-08-10 · tradycje-i-ciekawostki
**Andrzejki i katarzynki 2026 — daty i wróżby** · slug: `andrzejki-2026` · kw: „andrzejki 2026" ·
long-tail: „kiedy andrzejki 2026", „wróżby andrzejkowe" · intencja: informacyjna · 900 słów ·
anchory: /ile-dni-do-andrzejek, /kalendarz/listopad-2026 · grafika: lany wosk, świece · potencjał: pik XI.

### 20 · 2026-08-12 · tradycje-i-ciekawostki
**Mikołajki 2026 — kiedy wypadają i skąd tradycja** · slug: `mikolajki-2026` · kw: „mikołajki 2026" ·
long-tail: „kiedy mikołajki", „6 grudnia 2026 dzień tygodnia" · intencja: informacyjna · 800 słów ·
anchory: /ile-dni-do-mikolajek, /kalendarz/grudzien-2026 · grafika: mikołajkowy prezent i but · potencjał: pik XII.

### 21 · 2026-08-14 · planowanie-urlopu
**Sylwester i Nowy Rok 2027 — jak zaplanować wolne** · slug: `sylwester-nowy-rok-2027` · kw: „sylwester 2026/2027" ·
long-tail: „wolne między świętami 2026", „urlop na koniec roku" · intencja: informacyjna · 1000 słów ·
anchory: /dlugie-weekendy/2026, /dni-wolne-od-pracy/2027, /kalendarz/grudzien-2026 · grafika: fajerwerki nad miastem ·
potencjał: pik XII.

### 22 · 2026-08-16 · pory-roku-i-sezon
**Numery tygodni 2026 — który mamy teraz tydzień** · slug: `numery-tygodni-2026` · kw: „który to tydzień" ·
long-tail: „numer tygodnia dziś", „tydzień kalendarzowy 2026" · intencja: informacyjna · 900 słów ·
anchory: /tydzien/2026/{bieżący}, /kalendarz/2026 · grafika: siatka tygodni roku · potencjał: stały wolumen biznesowy.

### 23 · 2026-08-18 · ksiezyc-i-natura
**Kalendarz wędkarza 2026 — najlepsze dni na ryby** · slug: `kalendarz-wedkarza-2026` · kw: „kalendarz wędkarza" ·
long-tail: „biorą ryby dziś", „fazy księżyca a branie ryb" · intencja: informacyjna · 1000 słów ·
anchory: /kalendarz-wedkarza/2026, /fazy-ksiezyca/2026 · grafika: wędka o świcie nad wodą · potencjał: niszowy, lojalny long-tail.

### 24 · 2026-08-20 · planowanie-urlopu
**Długie weekendy 2027 — cały plan urlopowy na rok** · slug: `dlugie-weekendy-2027` · kw: „długie weekendy 2027" ·
long-tail: „mostki urlopowe 2027", „kiedy brać urlop 2027" · intencja: informacyjna · 1300 słów ·
anchory: /dlugie-weekendy/2027, /dni-wolne-od-pracy/2027, /kalendarz/2027 · grafika: walizka i kalendarz 2027 ·
potencjał: bardzo wysoki, rośnie do końca roku.

### 25 · 2026-08-22 · swieta-i-dni-wolne
**Wszystkich Świętych 2026 — dzień wolny i tradycje** · slug: `wszystkich-swietych-2026` · kw: „Wszystkich Świętych 2026" ·
long-tail: „1 listopada 2026 dzień tygodnia", „znicze tradycja" · intencja: informacyjna · 900 słów ·
anchory: /swieta/2026, /dni-wolne-od-pracy/2026, /kalendarz/listopad-2026 · grafika: znicze na cmentarzu o zmierzchu ·
potencjał: silny pik X–XI.

### 26 · 2026-08-24 · swieta-i-dni-wolne
**11 listopada 2026 — Święto Niepodległości i długi weekend** · slug: `swieto-niepodleglosci-2026` · kw: „11 listopada 2026" ·
long-tail: „11 listopada 2026 wolne", „długi weekend listopad 2026" · intencja: informacyjna · 900 słów ·
anchory: /dlugie-weekendy/2026, /dni-wolne-od-pracy/2026, /kalendarz/listopad-2026 · grafika: biało-czerwone flagi ·
potencjał: pik XI, wspiera wpis 01.

### 27 · 2026-08-26 · planowanie-urlopu
**Kalendarz do druku 2027 — darmowe PDF do pobrania** · slug: `kalendarz-do-druku-2027` · kw: „kalendarz do druku 2027" ·
long-tail: „kalendarz 2027 pdf", „kalendarz do wydruku za darmo" · intencja: transakcyjna · 900 słów ·
anchory: /kalendarz-do-druku/2027, /kalendarz/2027 · grafika: wydrukowany kalendarz na biurku · potencjał: wysoki CTR, konwersja.

### 28 · 2026-08-28 · pory-roku-i-sezon
**Pierwszy dzień zimy 2026 — przesilenie zimowe** · slug: `pierwszy-dzien-zimy-2026` · kw: „pierwszy dzień zimy 2026" ·
long-tail: „kiedy zima astronomiczna 2026", „najkrótszy dzień roku" · intencja: informacyjna · 900 słów ·
anchory: /pory-roku/2026, /kalendarz/grudzien-2026 · grafika: zaśnieżony las, przesilenie · potencjał: pik XII.

### 29 · 2026-08-30 · swieta-i-dni-wolne
**Boże Ciało 2027 — kiedy wypada (święto ruchome)** · slug: `boze-cialo-2027` · kw: „Boże Ciało 2027" ·
long-tail: „kiedy Boże Ciało 2027", „długi weekend Boże Ciało" · intencja: informacyjna · 900 słów ·
anchory: /wielkanoc/2027, /dlugie-weekendy/2027, /dni-wolne-od-pracy/2027 · grafika: procesja, ołtarze · potencjał: pik V–VI.

### 30 · 2026-09-01 · planowanie-urlopu
**Podsumowanie 2026 w kalendarzu i co zaplanować na 2027** · slug: `podsumowanie-2026-plan-2027` · kw: „kalendarz 2026 2027" ·
long-tail: „co się zmienia w 2027", „plan urlopu 2027" · intencja: informacyjna · 1200 słów ·
anchory: /kalendarz/2027, /dlugie-weekendy/2027, /dni-wolne-od-pracy/2027, /ferie-zimowe/2027 · grafika: przejście 2026→2027 ·
potencjał: domyka topical authority, mocne linkowanie wewnętrzne.

---

## 4. Moduł „Z bloga" na stronie głównej (zbudowany)
- **Nazwa sekcji:** „Z bloga".
- **Układ:** nagłówek + link „Cały blog →"; siatka: 1 duży kafel (najnowszy wpis, zdjęcie po lewej,
  tekst po prawej) + 2 mniejsze kafle.
- **Zajawka:** tytuł, kategoria, `excerpt`, data, czas czytania.
- **Najnowszy wpis:** `recentPosts(1)` (wyróżniony `featured`).
- **3 ostatnie:** `recentPosts(3)`.
- **CTA:** „Cały blog →" prowadzi do `/blog`; każdy kafel linkuje do wpisu.
- **Umiejscowienie:** między „Najpopularniejsze kalendarze" a „Kalendarz na rok".

## 5. Proces dodania nowego wpisu
1. Utwórz `src/content/blog/<slug>.tsx` z `export const post: BlogPost` (skopiuj istniejący jako wzór).
2. Ustaw `publishedAt` zgodnie z harmonogramem (co 2 dni).
3. Zaimportuj i dodaj do tablicy `ALL` w `src/lib/blog.ts`.
4. (Opcjonalnie) wgraj grafikę fal.ai do `/public/blog/<slug>.jpg` i ustaw `cover.src`.
5. Deploy — wpis pojawi się automatycznie w dniu `publishedAt`.
