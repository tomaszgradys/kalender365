// Nietypowe święta, przysłowia i cytaty dnia — treść wzbogacająca „kartkę z kalendarza".

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

// ---------------------------------------------------------------------------
// Nietypowe / nieoficjalne święta (wybór popularnych)
// ---------------------------------------------------------------------------

const UNUSUAL_HOLIDAYS: Record<string, string[]> = {
  "01-01": ["Nowy Rok", "Światowy Dzień Pokoju"],
  "01-06": ["Święto Trzech Króli"],
  "01-21": ["Dzień Babci"],
  "01-22": ["Dzień Dziadka"],
  "02-11": ["Międzynarodowy Dzień Kobiet i Dziewcząt w Nauce"],
  "02-14": ["Walentynki", "Dzień Zakochanych"],
  "02-21": ["Międzynarodowy Dzień Języka Ojczystego"],
  "02-27": ["Międzynarodowy Dzień Niedźwiedzia Polarnego"],
  "03-01": ["Narodowy Dzień Pamięci Żołnierzy Wyklętych"],
  "03-08": ["Dzień Kobiet"],
  "03-10": ["Dzień Mężczyzn"],
  "03-14": ["Dzień Liczby Pi", "Dzień Białej Czekolady"],
  "03-20": ["Międzynarodowy Dzień Szczęścia", "Pierwszy Dzień Wiosny"],
  "03-21": ["Światowy Dzień Zespołu Downa", "Dzień Wagarowicza"],
  "03-27": ["Międzynarodowy Dzień Teatru"],
  "04-01": ["Prima Aprilis"],
  "04-02": ["Międzynarodowy Dzień Książki dla Dzieci"],
  "04-07": ["Światowy Dzień Zdrowia"],
  "04-18": ["Międzynarodowy Dzień Ochrony Zabytków"],
  "04-22": ["Dzień Ziemi"],
  "04-23": ["Światowy Dzień Książki"],
  "05-01": ["Święto Pracy"],
  "05-02": ["Dzień Flagi Rzeczypospolitej Polskiej"],
  "05-03": ["Święto Konstytucji 3 Maja"],
  "05-08": ["Dzień Bibliotekarza"],
  "05-26": ["Dzień Matki"],
  "06-01": ["Dzień Dziecka"],
  "06-05": ["Światowy Dzień Środowiska"],
  "06-23": ["Dzień Ojca"],
  "06-21": ["Pierwszy Dzień Lata", "Święto Muzyki"],
  "07-04": ["Święto Hot Doga", "Międzynarodowy Dzień Spółdzielczości"],
  "07-11": ["Światowy Dzień Ludności"],
  "07-17": ["Światowy Dzień Emotikonów"],
  "07-30": ["Międzynarodowy Dzień Przyjaźni"],
  "08-01": ["Narodowy Dzień Pamięci Powstania Warszawskiego"],
  "08-13": ["Międzynarodowy Dzień Osób Leworęcznych"],
  "08-15": ["Wniebowzięcie NMP", "Święto Wojska Polskiego"],
  "09-01": ["Rocznica wybuchu II wojny światowej"],
  "09-13": ["Dzień Programisty"],
  "09-27": ["Światowy Dzień Turystyki"],
  "09-30": ["Dzień Chłopaka"],
  "10-01": ["Międzynarodowy Dzień Kawy", "Międzynarodowy Dzień Muzyki"],
  "10-04": ["Światowy Dzień Zwierząt"],
  "10-14": ["Dzień Edukacji Narodowej", "Dzień Nauczyciela"],
  "10-16": ["Światowy Dzień Żywności"],
  "11-01": ["Wszystkich Świętych"],
  "11-10": ["Międzynarodowy Dzień Młodzieży"],
  "11-11": ["Narodowe Święto Niepodległości"],
  "11-21": ["Światowy Dzień Życzliwości"],
  "11-25": ["Dzień Pluszowego Misia"],
  "11-29": ["Andrzejki"],
  "11-30": ["Dzień Andrzeja"],
  "12-04": ["Barbórka"],
  "12-06": ["Mikołajki"],
  "12-24": ["Wigilia Bożego Narodzenia"],
  "12-25": ["Boże Narodzenie"],
  "12-26": ["Drugi Dzień Świąt", "Św. Szczepana"],
  "12-31": ["Sylwester"],
};

export function getUnusualHolidays(month0: number, day: number): string[] {
  return UNUSUAL_HOLIDAYS[`${pad(month0 + 1)}-${pad(day)}`] ?? [];
}

// ---------------------------------------------------------------------------
// Przysłowia — ludowe przysłowia pogodowe (po jednym na każdy miesiąc + wariant dzienny)
// ---------------------------------------------------------------------------

const PROVERBS_BY_MONTH: string[][] = [
  [
    "Gdy styczeń mrozem trzyma, będzie tęga zima.",
    "Styczeń pełen wody, lipiec pełen wilgoci.",
    "Kiedy styczeń jasny, świetlisty — będzie roczek wszelki, złocisty.",
  ],
  [
    "Gdy w lutym mróz i śniegi, będą pełne stodoły i brogi.",
    "Spytaj się lutego, jaka zima będzie.",
    "W lutym gdy pięknie, to na wiosnę pęknie.",
  ],
  [
    "W marcu jak w garncu.",
    "Ile mgieł w marcu, tyle deszczów w lecie.",
    "Grzmot w marcu — dobry roku znak.",
  ],
  [
    "Kwiecień plecień, bo przeplata trochę zimy, trochę lata.",
    "Gdy kwiecień chłodny i deszczem gościnny, daje rok żyzny i płodny.",
    "Suchy marzec, kwiecień mokry, maj chłodny — nie będzie rok głodny.",
  ],
  [
    "Chłodny maj — dobry urodzaj.",
    "Gdy maj przeplata, będzie stodół i beczek do czubka.",
    "Deszcz majowy — chleb gotowy.",
  ],
  [
    "Czerwiec temu się zieleni, kto do pracy się rumieni.",
    "Gdy się czerwiec rozdżdżywi, mokry lipiec się zjawi.",
    "Grzmoty czerwca ranne głoszą urodzaje żniwne.",
  ],
  [
    "Gdy lipiec upalny, grudzień mroźny.",
    "Kiedy w lipcu upały, styczeń tęgie mrozy.",
    "Gdy się grzmot w lipcu od południa poda, drzewom się znaczy szwank i nieuroda.",
  ],
  [
    "Gdy sierpień wrzosem dyszy, cały wrzesień słońcem błyszczy.",
    "W sierpniu słońce, w gąsiorze wino.",
    "Sierpień z pogodą — zima ze śniegiem.",
  ],
  [
    "Wrzesień jaki, marzec taki.",
    "Wrzesień chodzi po rosie, zbiera grzyby we wrzosie.",
    "Kiedy wrzesień ciepły daje, przez zimę zima potrwaje.",
  ],
  [
    "W październiku, gdy liść z drzewa nie chce spadać, sroga zima ma nadejść.",
    "Gdy październik ciepło trzyma, zwykle mroźna bywa zima.",
    "Gdy październik mokro trzyma, zwykle potem ostra zima.",
  ],
  [
    "Gdy listopad z deszczem, grudzień zwykle z wichrem.",
    "Na świętego Marcina najlepsza gęsina.",
    "Kiedy listopad ciepły, mróz w styczniu zaziębły.",
  ],
  [
    "Grudzień ziemię grudzi, śniegi zsyła, w domu ludzi.",
    "Grudzień jaki — czerwiec taki.",
    "Kiedy w grudniu często dmucha, to w marcu i kwietniu plucha.",
  ],
];

/** Zwraca przysłowie dla danego dnia — deterministycznie z puli miesiąca. */
export function getProverb(month0: number, day: number): string {
  const pool = PROVERBS_BY_MONTH[month0];
  return pool[day % pool.length];
}

// ---------------------------------------------------------------------------
// Cytaty dnia
// ---------------------------------------------------------------------------

const QUOTES: { text: string; author: string }[] = [
  { text: "Przyjaciel to człowiek, który wie wszystko o tobie i wciąż cię lubi.", author: "Elbert Hubbard" },
  { text: "Nie liczy się to, ile masz, ale to, jak wykorzystujesz to, co masz.", author: "Ezop" },
  { text: "Kto chce, szuka sposobu. Kto nie chce, szuka powodu.", author: "przysłowie" },
  { text: "Podróż tysiąca mil zaczyna się od jednego kroku.", author: "Laozi" },
  { text: "Wyobraźnia jest ważniejsza od wiedzy.", author: "Albert Einstein" },
  { text: "Bądź zmianą, którą pragniesz ujrzeć w świecie.", author: "Mahatma Gandhi" },
  { text: "Najciemniej jest zawsze przed świtem.", author: "przysłowie" },
  { text: "Cierpliwość jest gorzka, ale jej owoce są słodkie.", author: "Jean-Jacques Rousseau" },
  { text: "Człowiek jest tyle wart, ile może dać innym.", author: "Jan Paweł II" },
  { text: "Czas to najlepszy lekarz.", author: "przysłowie" },
  { text: "Największą chwałą nie jest to, że nigdy nie upadamy, ale to, że powstajemy za każdym razem.", author: "Konfucjusz" },
  { text: "Kto nie idzie do przodu, ten się cofa.", author: "Johann Wolfgang von Goethe" },
  { text: "Marzenia nie mają terminu ważności.", author: "nieznany" },
  { text: "Nie ma nic stałego oprócz zmiany.", author: "Heraklit" },
  { text: "Uśmiech nic nie kosztuje, a wiele daje.", author: "przysłowie" },
  { text: "Wiedza to potęga.", author: "Francis Bacon" },
  { text: "Rób to, co możesz, tam gdzie jesteś, tym, co masz.", author: "Theodore Roosevelt" },
  { text: "Szczęście to jedyna rzecz, która się mnoży, gdy się ją dzieli.", author: "Albert Schweitzer" },
  { text: "Odwaga to nie brak strachu, lecz działanie mimo niego.", author: "Mark Twain" },
  { text: "Kto rano wstaje, temu Pan Bóg daje.", author: "przysłowie" },
];

/** Dzień roku (1..366) dla danej daty. */
export function dayOfYear(year: number, month0: number, day: number): number {
  const start = Date.UTC(year, 0, 0);
  const current = Date.UTC(year, month0, day);
  return Math.floor((current - start) / 86400000);
}

export function getQuoteOfDay(year: number, month0: number, day: number): { text: string; author: string } {
  const idx = dayOfYear(year, month0, day) % QUOTES.length;
  return QUOTES[idx];
}
