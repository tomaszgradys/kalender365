import Link from "next/link";
import type { BlogPost } from "@/lib/blog";

function Body() {
  return (
    <>
      <p>
        Lipiec i sierpień mijają szybciej, niż byśmy chcieli. Jeśli zastanawiasz się, ile dokładnie
        zostało wakacji i kiedy zadzwoni pierwszy szkolny dzwonek, ten wpis zbiera wszystko w jednym
        miejscu — datę końca wakacji, początek roku szkolnego i pomysł, jak dobrze wykorzystać ostatnie
        tygodnie wolnego.
      </p>

      <h2 id="kiedy-koniec">Kiedy kończą się wakacje 2026?</h2>
      <p>
        Wakacje letnie trwają do <strong>31 sierpnia</strong>, a nowy rok szkolny zaczyna się
        1 września. To stała zasada — ostatnim dniem wolnym jest 31 sierpnia, a jeśli 1 września wypada
        w weekend, rozpoczęcie zajęć przenosi się na najbliższy poniedziałek. Dokładne odliczanie na żywo
        znajdziesz w liczniku{" "}
        <Link href="/ile-dni-do-powrotu-do-szkoly">ile dni do powrotu do szkoły</Link>.
      </p>

      <h2 id="rok-szkolny">Początek roku szkolnego 2026/2027</h2>
      <p>
        Zaraz po wakacjach rusza rok szkolny 2026/2027 z całą listą terminów — przerwami świątecznymi,
        feriami zimowymi i zakończeniem zajęć w czerwcu 2027. Warto mieć je pod ręką już teraz, planując
        korepetycje, zakupy wyprawki czy wrześniowe wyjazdy. Komplet dat zebraliśmy w{" "}
        <Link href="/kalendarz-szkolny/2026">kalendarzu roku szkolnego 2026/2027</Link>, a szczegóły
        września — w <Link href="/kalendarz/wrzesien-2026">kalendarzu września 2026</Link>.
      </p>

      <h2 id="jak-wykorzystac">Jak wykorzystać ostatnie tygodnie wakacji</h2>
      <ul>
        <li>
          <strong>Zaplanuj krótki wyjazd na sierpień.</strong> Sprawdź układ dni w{" "}
          <Link href="/kalendarz/sierpien-2026">kalendarzu sierpnia 2026</Link> i dopasuj wolne.
        </li>
        <li>
          <strong>Przygotuj wyprawkę wcześniej.</strong> Ostatni tydzień sierpnia to szturm na sklepy —
          lepiej zrobić zakupy z wyprzedzeniem.
        </li>
        <li>
          <strong>Wróć do rytmu dnia.</strong> Kilka dni przed 1 września warto stopniowo przesuwać porę
          snu, żeby powrót do szkoły nie był szokiem.
        </li>
      </ul>

      <h2 id="podsumowanie">Podsumowanie</h2>
      <p>
        Wakacje 2026 kończą się 31 sierpnia, a 1 września rusza nowy rok szkolny. Na odpoczynek zostało
        więc jeszcze trochę czasu — wykorzystaj go świadomie i miej najważniejsze daty pod ręką w{" "}
        <Link href="/kalendarz-szkolny/2026">kalendarzu szkolnym</Link>.
      </p>
    </>
  );
}

export const post: BlogPost = {
  slug: "ile-dni-do-konca-wakacji-2026",
  title: "Ile dni do końca wakacji 2026? Kiedy koniec i powrót do szkoły",
  metaTitle: "Ile dni do końca wakacji 2026? Kiedy koniec",
  metaDescription:
    "Kiedy kończą się wakacje 2026, kiedy zaczyna się rok szkolny i jak dobrze wykorzystać ostatnie tygodnie wolnego. Odliczanie i wszystkie ważne daty.",
  excerpt:
    "Wakacje 2026 trwają do 31 sierpnia, a 1 września rusza szkoła. Sprawdź, ile dokładnie zostało wolnego i jak mądrze wykorzystać ostatnie tygodnie lata.",
  publishedAt: "2026-07-01",
  category: "pory-roku-i-sezon",
  tags: ["wakacje 2026", "koniec wakacji", "powrót do szkoły", "rok szkolny"],
  keyword: "koniec wakacji 2026",
  cover: {
    src: "/blog/ile-dni-do-konca-wakacji-2026.jpg",
    alt: "Letnia plaża i kartka z kalendarza z końcem sierpnia 2026",
    prompt:
      "a sunny beach scene with a small wall calendar showing late August, summer holidays ending, navy and green brand palette, no text, 1216x640, editorial flat vector style.",
  },
  readingMinutes: 4,
  toc: [
    { id: "kiedy-koniec", label: "Kiedy kończą się wakacje" },
    { id: "rok-szkolny", label: "Początek roku szkolnego" },
    { id: "jak-wykorzystac", label: "Jak wykorzystać koniec lata" },
    { id: "podsumowanie", label: "Podsumowanie" },
  ],
  faq: [
    {
      q: "Kiedy kończą się wakacje 2026?",
      a: "Wakacje letnie trwają do 31 sierpnia 2026. Nowy rok szkolny rozpoczyna się 1 września.",
    },
    {
      q: "Kiedy zaczyna się rok szkolny 2026/2027?",
      a: "Zajęcia zaczynają się 1 września 2026. Jeśli dzień ten wypada w weekend, rozpoczęcie przenosi się na najbliższy poniedziałek.",
    },
  ],
  Body,
};
