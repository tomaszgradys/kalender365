import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function Body() {
  return (
    <>
      <p>
        Nowy rok szkolny 2026/2027 to znów zestaw dat, które warto mieć pod ręką — od pierwszego dzwonka,
        przez przerwy świąteczne i ferie, aż po ostatni dzień zajęć i początek wakacji. Zebraliśmy tu
        wszystkie najważniejsze terminy w jednym miejscu, żeby łatwiej było zaplanować urlop rodziców,
        wyjazdy i naukę.
      </p>

      <h2 id="rozpoczecie">Kiedy zaczyna się rok szkolny 2026/2027?</h2>
      <p>
        Zajęcia dydaktyczno-wychowawcze rozpoczynają się <strong>1 września</strong>. Zgodnie z przepisami,
        jeśli 1 września wypada w piątek lub sobotę, rozpoczęcie roku przenosi się na najbliższy
        poniedziałek. Aktualny, potwierdzony termin dla Twojego rocznika znajdziesz zawsze w{" "}
        <Link href="/kalendarz-szkolny/2026">kalendarzu roku szkolnego 2026/2027</Link>.
      </p>

      <h2 id="przerwy">Przerwy świąteczne i wolne w trakcie roku</h2>
      <p>W ciągu roku szkolnego uczniów czekają dwie dłuższe przerwy świąteczne:</p>
      <ul>
        <li>
          <strong>Zimowa przerwa świąteczna</strong> — obejmuje okres Bożego Narodzenia i Nowego Roku,
          zwykle od okolic 23 grudnia do 1 stycznia.
        </li>
        <li>
          <strong>Wiosenna przerwa świąteczna</strong> — kilka dni wokół Wielkanocy (Wielki Czwartek –
          Wtorek Wielkanocny).
        </li>
      </ul>
      <p>
        Do tego dochodzą dni ustawowo wolne od pracy, które są jednocześnie wolne od szkoły. Ich pełną
        listę sprawdzisz na stronie <Link href="/dni-wolne-od-pracy/2026">dni wolne od pracy 2026</Link>,
        a dokładną datę Wielkanocy w kolejnym roku — w zakładce{" "}
        <Link href="/wielkanoc/2027">Wielkanoc 2027</Link>.
      </p>

      <h2 id="ferie">Ferie zimowe 2027 — terminy według województw</h2>
      <p>
        Ferie zimowe trwają dwa tygodnie, ale ich termin różni się w zależności od województwa —
        Ministerstwo Edukacji dzieli kraj na cztery tury, rozłożone zwykle między połową stycznia a końcem
        lutego. Dzięki temu stoki i ośrodki nie są oblegane wszędzie w tym samym czasie. Terminy dla
        swojego regionu znajdziesz w zestawieniu{" "}
        <Link href="/ferie-zimowe/2027">ferie zimowe 2027</Link>.
      </p>

      <h2 id="zakonczenie">Zakończenie roku szkolnego i wakacje 2027</h2>
      <p>
        Rok szkolny kończy się w <strong>najbliższy piątek po 20 czerwca</strong> — wtedy uczniowie
        odbierają świadectwa, a następnego dnia startują wakacje. Letnia przerwa trwa aż do 31 sierpnia,
        więc na odpoczynek jest ponad dwa miesiące. Jeśli już teraz odliczasz dni do lata, zajrzyj do
        licznika <Link href="/ile-dni-do-wakacji">ile dni do wakacji</Link>.
      </p>

      <h2 id="planowanie">Jak zaplanować rok szkolny z wyprzedzeniem</h2>
      <p>Kilka praktycznych wskazówek dla rodziców i nauczycieli:</p>
      <ol>
        <li>
          <strong>Zsynchronizuj urlop z przerwami.</strong> Ferie i przerwy świąteczne to najlepszy moment
          na wspólny wyjazd — sprawdź je z wyprzedzeniem na{" "}
          <Link href="/kalendarz/2026">kalendarzu na 2026 rok</Link>.
        </li>
        <li>
          <strong>Zaznacz dni wolne.</strong> Dodatkowe dni wolne od zajęć (dyrektorskie) ustala szkoła —
          warto dopytać na początku roku.
        </li>
        <li>
          <strong>Rozpisz plan lekcji.</strong> Gotowy, estetyczny plan zajęć wygenerujesz i wydrukujesz
          w naszym <Link href="/plan-lekcji">generatorze planu lekcji</Link>.
        </li>
      </ol>

      <h2 id="podsumowanie">Podsumowanie</h2>
      <p>
        Rok szkolny 2026/2027 zaczyna się 1 września, kończy w drugiej połowie czerwca 2027, a po drodze
        czekają dwie przerwy świąteczne i dwutygodniowe ferie zimowe w terminie zależnym od województwa.
        Wszystkie potwierdzone daty trzymamy na bieżąco w{" "}
        <Link href="/kalendarz-szkolny/2026">kalendarzu szkolnym</Link> — zajrzyj tam, zanim zaplanujesz
        urlop i wyjazdy.
      </p>
    </>
  );
}

export const post: BlogPost = {
  slug: "kalendarz-roku-szkolnego-2026-2027",
  title: "Kalendarz roku szkolnego 2026/2027 — wszystkie terminy",
  metaTitle: "Rok szkolny 2026/2027 — terminy, ferie, dni wolne",
  metaDescription:
    "Rozpoczęcie i zakończenie roku szkolnego 2026/2027, przerwy świąteczne, ferie zimowe i wakacje. Wszystkie ważne terminy dla rodziców i uczniów w jednym miejscu.",
  excerpt:
    "Pierwszy dzwonek, przerwy świąteczne, ferie zimowe i zakończenie zajęć — komplet dat roku szkolnego 2026/2027, które warto mieć pod ręką.",
  publishedAt: "2026-07-03",
  category: "szkola-i-ferie",
  tags: ["rok szkolny", "2026/2027", "ferie zimowe", "wakacje", "kalendarz szkolny"],
  keyword: "rok szkolny 2026/2027",
  cover: {
    src: "/blog/kalendarz-roku-szkolnego-2026-2027.jpg",
    alt: "Szkolne biurko z plecakiem i kalendarzem roku szkolnego 2026/2027",
    prompt:
      "a school desk scene with a backpack, notebooks and a wall calendar marking the start of the school year, warm early-autumn light, navy and green brand palette, no text, 1216x640, editorial flat vector style.",
  },
  readingMinutes: 5,
  toc: [
    { id: "rozpoczecie", label: "Kiedy zaczyna się rok szkolny" },
    { id: "przerwy", label: "Przerwy świąteczne" },
    { id: "ferie", label: "Ferie zimowe 2027" },
    { id: "zakonczenie", label: "Zakończenie roku i wakacje" },
    { id: "planowanie", label: "Jak zaplanować rok szkolny" },
    { id: "podsumowanie", label: "Podsumowanie" },
  ],
  faq: [
    {
      q: "Kiedy zaczyna się rok szkolny 2026/2027?",
      a: "Zajęcia rozpoczynają się 1 września 2026. Jeśli dzień ten wypada w piątek lub sobotę, rozpoczęcie przenosi się na najbliższy poniedziałek.",
    },
    {
      q: "Kiedy są ferie zimowe 2027?",
      a: "Ferie trwają dwa tygodnie w terminie zależnym od województwa — między połową stycznia a końcem lutego 2027. Dokładne daty regionów znajdziesz na stronie ferie zimowe 2027.",
    },
    {
      q: "Kiedy kończy się rok szkolny 2026/2027?",
      a: "Rok szkolny kończy się w najbliższy piątek po 20 czerwca 2027, a następnego dnia rozpoczynają się wakacje trwające do 31 sierpnia.",
    },
  ],
  Body,
};
