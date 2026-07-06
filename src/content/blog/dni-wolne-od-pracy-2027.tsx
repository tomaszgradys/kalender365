import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function Body() {
  return (
    <>
      <p>
        Planowanie urlopu najlepiej zacząć od kalendarza dni wolnych. W 2027 roku, jak co roku, mamy
        13 dni ustawowo wolnych od pracy — część wypadnie w tygodniu i utworzy okazje na długie weekendy,
        część niestety w weekend. Poniżej pełna lista świąt i wskazówka, jak z niej skorzystać.
      </p>

      <h2 id="lista">Dni ustawowo wolne od pracy w 2027 roku</h2>
      <p>Zgodnie z ustawą wolne od pracy są następujące dni:</p>
      <ul>
        <li>1 stycznia — Nowy Rok</li>
        <li>6 stycznia — Trzech Króli</li>
        <li>Niedziela i poniedziałek wielkanocny</li>
        <li>1 maja — Święto Pracy</li>
        <li>3 maja — Święto Konstytucji 3 Maja</li>
        <li>Zielone Świątki (niedziela) oraz Boże Ciało</li>
        <li>15 sierpnia — Wniebowzięcie NMP / Święto Wojska Polskiego</li>
        <li>1 listopada — Wszystkich Świętych</li>
        <li>11 listopada — Święto Niepodległości</li>
        <li>25 i 26 grudnia — Boże Narodzenie</li>
      </ul>
      <p>
        Aktualną listę z dokładnymi datami i dniami tygodnia (część świąt jest ruchoma) znajdziesz zawsze
        na stronie <Link href="/dni-wolne-od-pracy/2027">dni wolne od pracy 2027</Link>, a wszystkie
        obchody w jednym widoku — w <Link href="/swieta/2027">kalendarzu świąt 2027</Link>.
      </p>

      <h2 id="ruchome">Święta ruchome w 2027 roku</h2>
      <p>
        Wielkanoc, a wraz z nią Poniedziałek Wielkanocny, Zielone Świątki i Boże Ciało, to święta ruchome
        — ich data zależy od kalendarza księżycowego i zmienia się co roku. Dokładny termin Wielkanocy
        2027 i powiązanych dni sprawdzisz w zakładce <Link href="/wielkanoc/2027">Wielkanoc 2027</Link>.
      </p>

      <h2 id="planowanie">Jak zaplanować urlop na 2027 rok</h2>
      <p>
        Najwięcej zyskujesz na świętach wypadających we wtorek, środę lub czwartek — jednym lub dwoma
        dniami urlopu domykasz cały długi weekend. Gotowe zestawienie mostków przygotowaliśmy w zakładce{" "}
        <Link href="/dlugie-weekendy/2027">długie weekendy 2027</Link>, a cały rozkład roku zobaczysz na{" "}
        <Link href="/kalendarz/2027">kalendarzu 2027</Link>.
      </p>
      <p>
        Nie chcesz liczyć tego ręcznie? Skorzystaj z naszego{" "}
        <Link href="/planer-urlopu/2027">planera urlopu 2027</Link> — wpisujesz, ile masz dni urlopu, a
        narzędzie samo podpowiada najlepsze kombinacje i pokazuje je na kalendarzu, który możesz
        edytować i wydrukować do PDF.
      </p>

      <h2 id="podsumowanie">Podsumowanie</h2>
      <p>
        Rok 2027 to standardowe 13 dni ustawowo wolnych. Kluczem do dłuższego wypoczynku jest wcześniejsze
        zaplanowanie mostków wokół świąt wypadających w środku tygodnia. Zacznij od{" "}
        <Link href="/dni-wolne-od-pracy/2027">pełnej listy dni wolnych 2027</Link> i dopasuj urlop do
        najlepszych terminów.
      </p>
    </>
  );
}

export const post: BlogPost = {
  slug: "dni-wolne-od-pracy-2027",
  title: "Dni wolne od pracy 2027 — pełna lista i długie weekendy",
  metaTitle: "Dni wolne od pracy 2027 — pełna lista świąt",
  metaDescription:
    "Wszystkie dni ustawowo wolne od pracy w 2027 roku, święta ruchome i wskazówki, jak zaplanować urlop, by zyskać najwięcej długich weekendów.",
  excerpt:
    "13 dni ustawowo wolnych, święta ruchome i gotowe mostki urlopowe — kompletny przewodnik po dniach wolnych 2027, od którego zacząć planowanie urlopu.",
  publishedAt: "2026-06-29",
  category: "swieta-i-dni-wolne",
  tags: ["dni wolne 2027", "święta 2027", "urlop", "długie weekendy"],
  keyword: "dni wolne od pracy 2027",
  cover: {
    src: "/blog/dni-wolne-od-pracy-2027.jpg",
    alt: "Kalendarz roczny 2027 z zaznaczonymi na zielono dniami wolnymi od pracy",
    prompt:
      "a yearly wall calendar for 2027 with several holiday dates highlighted in green, planning theme, navy and green brand palette, no text, 1216x640, editorial flat vector style.",
  },
  readingMinutes: 4,
  toc: [
    { id: "lista", label: "Lista dni wolnych 2027" },
    { id: "ruchome", label: "Święta ruchome" },
    { id: "planowanie", label: "Jak zaplanować urlop" },
    { id: "podsumowanie", label: "Podsumowanie" },
  ],
  faq: [
    {
      q: "Ile jest dni wolnych od pracy w 2027 roku?",
      a: "W 2027 roku przypada 13 dni ustawowo wolnych od pracy. Część z nich wypada w weekend, więc liczba dodatkowych dni wolnych w tygodniu bywa niższa.",
    },
    {
      q: "Które święta w 2027 są ruchome?",
      a: "Ruchome są Wielkanoc i Poniedziałek Wielkanocny oraz zależne od nich Zielone Świątki i Boże Ciało. Ich daty zmieniają się co roku.",
    },
  ],
  Body,
};
