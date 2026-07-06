// Rejestr treści SEO dla stron kalendarzy-typów (rendered przez CalYearShell → TypeSeoBlock).
// Każdy wpis to funkcja roku, dzięki czemu treść jest unikalna i aktualna dla każdego rocznika.
// Cel: najlepsze, najbogatsze i najbardziej pomocne opisy spośród kalendarzy w polskim internecie.

export type SeoSection = { h2: string; body: string[] };
export type SeoFaq = { q: string; a: string };
export type TypeSeo = { intro: string[]; sections: SeoSection[]; faq: SeoFaq[] };

type Builder = (year: number) => TypeSeo;

const REGISTRY: Record<string, Builder> = {
  // -----------------------------------------------------------------------
  swieta: (y) => ({
    intro: [
      `Kalendarz świąt ${y} to pełny wykaz wszystkich dni świątecznych w Polsce — świąt państwowych, kościelnych oraz świąt ruchomych. Sprawdzisz tu, jakie święto wypada danego dnia, w jaki dzień tygodnia przypada oraz które dni są ustawowo wolne od pracy.`,
      `Zestawienie obejmuje zarówno stałe święta (np. Boże Narodzenie 25 grudnia czy Święto Niepodległości 11 listopada), jak i święta ruchome zależne od daty Wielkanocy (Wielki Piątek, Wielkanoc, Boże Ciało). Dzięki temu w jednym miejscu zaplanujesz cały rok ${y}.`,
    ],
    sections: [
      {
        h2: `Jakie święta wypadają w ${y} roku?`,
        body: [
          `W Polsce świętujemy 13 dni ustawowo wolnych od pracy. Najważniejsze święta ${y} to Nowy Rok, Trzech Króli, Wielkanoc, Święto Pracy (1 maja), Święto Konstytucji 3 Maja, Boże Ciało, Wniebowzięcie Najświętszej Maryi Panny (15 sierpnia), Wszystkich Świętych (1 listopada), Święto Niepodległości (11 listopada) oraz Boże Narodzenie (25 i 26 grudnia).`,
          `Oprócz świąt ustawowych kalendarz świąt zawiera także popularne dni obchodzone tradycyjnie: Tłusty Czwartek, Walentynki, Dzień Kobiet, Dzień Matki, Dzień Dziecka czy andrzejki i mikołajki.`,
        ],
      },
      {
        h2: "Święta ruchome a stałe",
        body: [
          `Święta stałe wypadają zawsze tego samego dnia (np. 1 listopada). Święta ruchome zależą od daty Wielkanocy, która w każdym roku przypada w inną niedzielę pomiędzy 22 marca a 25 kwietnia. Od Wielkanocy liczymy m.in. Wielki Piątek, Poniedziałek Wielkanocny, Zesłanie Ducha Świętego oraz Boże Ciało.`,
        ],
      },
    ],
    faq: [
      { q: `Ile jest dni wolnych od pracy w ${y} roku?`, a: `W ${y} roku w Polsce obowiązuje 13 dni ustawowo wolnych od pracy. Część z nich może wypadać w weekend — sprawdź dokładny wykaz powyżej.` },
      { q: "Które święta są ruchome?", a: "Ruchome są święta zależne od Wielkanocy: Wielki Piątek, Wielkanoc, Poniedziałek Wielkanocny, Zesłanie Ducha Świętego (Zielone Świątki) i Boże Ciało." },
      { q: "Czy 6 stycznia (Trzech Króli) jest dniem wolnym?", a: "Tak, Święto Trzech Króli (Objawienie Pańskie) jest w Polsce dniem ustawowo wolnym od pracy od 2011 roku." },
    ],
  }),

  // -----------------------------------------------------------------------
  "dlugie-weekendy": (y) => ({
    intro: [
      `Długie weekendy ${y} to najlepszy sposób na więcej wolnego przy minimalnym wykorzystaniu urlopu. Poniżej znajdziesz wszystkie długie weekendy w ${y} roku oraz tzw. „dni do wzięcia" (mostki) — pojedyncze dni urlopu, które łączą święta z weekendem w kilkudniowy blok.`,
    ],
    sections: [
      {
        h2: `Jak zaplanować urlop w ${y} roku?`,
        body: [
          `Najwięcej wolnego zyskasz, biorąc urlop w dni robocze wypadające pomiędzy świętem a weekendem. Taki „mostek" potrafi z 1 dnia urlopu zrobić 4 dni wolnego. W tabeli powyżej sortujemy propozycje według opłacalności — od najlepszego stosunku dni wolnych do dni urlopu.`,
        ],
      },
      {
        h2: "Czym jest długi weekend?",
        body: [
          `Za długi weekend uznajemy co najmniej 3 kolejne dni wolne od pracy — najczęściej weekend połączony ze świętem lub z dniem urlopu. Klasyczne długie weekendy w Polsce to majówka (1–3 maja), Boże Ciało oraz weekend z 1 i 11 listopada.`,
        ],
      },
    ],
    faq: [
      { q: `Ile długich weekendów jest w ${y} roku?`, a: `Liczbę długich weekendów w ${y} roku znajdziesz na górze strony — uwzględniamy święta ustawowo wolne od pracy połączone z weekendem.` },
      { q: "Co to jest mostek (dzień do wzięcia)?", a: "Mostek to dzień roboczy pomiędzy świętem a weekendem. Biorąc go na urlop, łączysz dni wolne w jeden dłuższy blok — przy minimalnym koszcie dni urlopowych." },
      { q: "Kiedy wypada majówka?", a: "Majówka to okres wokół 1 i 3 maja. W zależności od układu dni tygodnia, dobierając 1–2 dni urlopu, można wydłużyć ją nawet do kilku dni wolnego." },
    ],
  }),

  // -----------------------------------------------------------------------
  "fazy-ksiezyca": (y) => ({
    intro: [
      `Kalendarz faz księżyca ${y} pokazuje wszystkie główne fazy Księżyca — nów, pierwszą kwadrę, pełnię i ostatnią kwadrę — miesiąc po miesiącu, w czasie obowiązującym w Polsce. Fazy Księżyca przydają się w ogrodnictwie, wędkarstwie, fotografii nocnej oraz przy planowaniu obserwacji nieba.`,
    ],
    sections: [
      {
        h2: "Cztery główne fazy Księżyca",
        body: [
          `Cykl Księżyca (miesiąc synodyczny) trwa około 29,5 dnia. W tym czasie Księżyc przechodzi przez cztery główne fazy: nów (tarcza niewidoczna), pierwsza kwadra (widoczna prawa połowa), pełnia (cała tarcza oświetlona) oraz ostatnia kwadra (widoczna lewa połowa).`,
        ],
      },
      {
        h2: `Ile pełni Księżyca w ${y} roku?`,
        body: [
          `W ciągu roku występuje zwykle 12 lub 13 pełni. Zdarza się tzw. „niebieski Księżyc" (blue moon) — druga pełnia w tym samym miesiącu kalendarzowym. Dokładne daty wszystkich pełni ${y} znajdziesz w zestawieniu powyżej.`,
        ],
      },
    ],
    faq: [
      { q: "Co to jest nów Księżyca?", a: "Nów to faza, w której Księżyc znajduje się między Ziemią a Słońcem i jego oświetlona strona jest odwrócona od nas — tarcza jest wtedy praktycznie niewidoczna. To najlepszy czas na obserwacje słabych obiektów nieba." },
      { q: "Czy fazy Księżyca podane są dla Polski?", a: "Tak, wszystkie daty i godziny faz podajemy w czasie lokalnym obowiązującym w Polsce (z uwzględnieniem czasu letniego i zimowego)." },
      { q: "Po co znać fazy Księżyca?", a: "Fazy Księżyca wykorzystuje się w kalendarzu ogrodnika, wędkarstwie, fotografii nocnej, a także do planowania obserwacji astronomicznych i wypraw przy świetle Księżyca." },
    ],
  }),

  // -----------------------------------------------------------------------
  "pelnia-ksiezyca": (y) => ({
    intro: [
      `Pełnia Księżyca ${y} — sprawdź daty wszystkich pełni w ${y} roku wraz z ich tradycyjnymi nazwami. Pełnia to moment, w którym cała tarcza Księżyca jest oświetlona przez Słońce; jest wtedy najjaśniejsza i widoczna przez całą noc.`,
    ],
    sections: [
      {
        h2: "Tradycyjne nazwy pełni",
        body: [
          `Kolejnym pełniom przypisuje się ludowe nazwy, np. Pełnia Wilcza (styczeń), Pełnia Robaczywa (marzec), Pełnia Truskawkowa (czerwiec) czy Pełnia Żniwiarza (wrzesień). Nazwy pochodzą z tradycji ludowej i opisują zjawiska charakterystyczne dla danej pory roku.`,
        ],
      },
      {
        h2: "Superpełnia i zaćmienia",
        body: [
          `Gdy pełnia zbiega się z perygeum (najbliższym Ziemi punktem orbity), mówimy o superpełni — Księżyc wydaje się wtedy większy i jaśniejszy. Czasem podczas pełni dochodzi do zaćmienia Księżyca, gdy wchodzi on w cień Ziemi.`,
        ],
      },
    ],
    faq: [
      { q: `Ile pełni Księżyca jest w ${y} roku?`, a: `Dokładną liczbę i daty pełni w ${y} roku znajdziesz w zestawieniu powyżej — zwykle jest ich 12 lub 13.` },
      { q: "Co to jest superpełnia?", a: "Superpełnia to pełnia przypadająca blisko perygeum orbity Księżyca. Tarcza wydaje się wtedy nawet o kilkanaście procent większa i wyraźnie jaśniejsza niż podczas zwykłej pełni." },
    ],
  }),

  // -----------------------------------------------------------------------
  "now-ksiezyca": (y) => ({
    intro: [
      `Nów Księżyca ${y} — wykaz wszystkich nowi w ${y} roku. Nów to faza, w której Księżyc znajduje się pomiędzy Ziemią a Słońcem i jego oświetlona strona jest od nas odwrócona, przez co tarcza pozostaje praktycznie niewidoczna.`,
    ],
    sections: [
      {
        h2: "Dlaczego nów jest ważny dla obserwacji nieba?",
        body: [
          `Podczas nowiu niebo nie jest rozjaśniane światłem Księżyca, dlatego to najlepszy czas na obserwację słabych obiektów: mgławic, galaktyk, rojów meteorów oraz Drogi Mlecznej. Astrofotografowie planują sesje właśnie wokół nowiu.`,
        ],
      },
      {
        h2: "Nów w ogrodnictwie",
        body: [
          `W kalendarzu biodynamicznym nów uznaje się za czas spoczynku roślin — sprzyja odchwaszczaniu i pracom porządkowym, mniej zaś siewom i sadzeniu, które lepiej planować na Księżyc przybywający.`,
        ],
      },
    ],
    faq: [
      { q: "Czy podczas nowiu widać Księżyc?", a: "Nie. W czasie nowiu oświetlona strona Księżyca jest odwrócona od Ziemi, więc tarcza jest praktycznie niewidoczna. Cienki sierp pojawia się dopiero dzień lub dwa po nowiu." },
      { q: "Kiedy jest najlepszy czas na obserwacje gwiazd?", a: "Najlepszy czas to okres kilku dni wokół nowiu, gdy niebo nie jest rozjaśniane światłem Księżyca — daty nowi w tym roku znajdziesz powyżej." },
    ],
  }),

  // -----------------------------------------------------------------------
  "kalendarz-ogrodnika": (y) => ({
    intro: [
      `Kalendarz ogrodnika ${y} to praktyczny przewodnik po pracach w ogrodzie, dostosowany do warunków klimatycznych Polski. Podpowiada, co i kiedy siać, sadzić, przycinać i zbierać — miesiąc po miesiącu, z uwzględnieniem faz Księżyca.`,
    ],
    sections: [
      {
        h2: "Prace w ogrodzie miesiąc po miesiącu",
        body: [
          `Wiosną (marzec–maj) wysiewamy rozsady, sadzimy warzywa i przycinamy krzewy. Latem (czerwiec–sierpień) pielęgnujemy, podlewamy i zbieramy pierwsze plony. Jesienią (wrzesień–listopad) sadzimy cebule kwiatowe i zabezpieczamy rośliny na zimę. Zimą planujemy nowy sezon i dbamy o narzędzia.`,
        ],
      },
      {
        h2: "Ogrodnictwo według faz Księżyca",
        body: [
          `W tradycji biodynamicznej prace planuje się według faz Księżyca: na Księżyc przybywający (od nowiu do pełni) sieje się rośliny owocujące nad ziemią, a na Księżyc ubywający (od pełni do nowiu) — rośliny korzeniowe. To wskazówka pomocnicza; kluczowe pozostają pogoda i temperatura gleby.`,
        ],
      },
    ],
    faq: [
      { q: "Kiedy zacząć siać w Polsce?", a: "Pierwsze rozsady (np. pomidory, papryka) wysiewa się pod osłonami już w lutym–marcu. Do gruntu większość warzyw trafia od kwietnia, po ustąpieniu ryzyka przymrozków — pełnia bezpieczeństwa to okres po tzw. zimnych ogrodnikach (połowa maja)." },
      { q: "Czy warto kierować się fazami Księżyca?", a: "Fazy Księżyca traktuj jako wskazówkę uzupełniającą. W polskim klimacie o powodzeniu upraw decydują przede wszystkim temperatura gleby, długość dnia i pogoda." },
    ],
  }),

  // -----------------------------------------------------------------------
  "kalendarz-wedkarza": (y) => ({
    intro: [
      `Kalendarz wędkarza ${y} podpowiada, kiedy ryby biorą najlepiej, a kiedy warto odpuścić. Bierze pod uwagę fazy Księżyca, porę roku oraz okresy ochronne najważniejszych gatunków ryb w Polsce.`,
    ],
    sections: [
      {
        h2: "Kiedy ryby biorą najlepiej?",
        body: [
          `Najlepsze brania przypadają zwykle na kilka dni wokół nowiu i pełni oraz o świcie i o zmierzchu. Aktywność ryb rośnie przy stabilnym ciśnieniu i lekkim zachmurzeniu, a spada przy gwałtownych zmianach pogody i silnym, mroźnym wietrze.`,
        ],
      },
      {
        h2: "Okresy ochronne — kiedy nie łowić",
        body: [
          `Pamiętaj o okresach ochronnych i wymiarach ochronnych ryb. Wiosną wiele gatunków (np. szczupak, sandacz, sum) ma okres tarła, w którym obowiązuje zakaz połowu. Zawsze sprawdzaj aktualny regulamin PZW oraz przepisy dla danego łowiska.`,
        ],
      },
    ],
    faq: [
      { q: "Czy faza Księżyca wpływa na brania?", a: "Wielu wędkarzy obserwuje lepsze brania w okolicach nowiu i pełni. To wskazówka pomocnicza — realny wpływ mają też ciśnienie, temperatura wody i pora dnia." },
      { q: "Kiedy obowiązują okresy ochronne ryb?", a: "Okresy ochronne przypadają głównie na czas tarła (najczęściej wiosną) i różnią się dla poszczególnych gatunków. Obowiązujące terminy i wymiary ochronne określa regulamin PZW oraz przepisy lokalne." },
    ],
  }),

  // -----------------------------------------------------------------------
  "pory-roku": (y) => ({
    intro: [
      `Pory roku ${y} — dokładne daty i godziny rozpoczęcia wiosny, lata, jesieni i zimy w Polsce. Podajemy momenty równonocy wiosennej i jesiennej oraz przesilenia letniego i zimowego, wyliczone astronomicznie (algorytm Meeusa) w czasie lokalnym.`,
    ],
    sections: [
      {
        h2: "Równonoce i przesilenia",
        body: [
          `Astronomiczne pory roku wyznaczają cztery momenty: równonoc wiosenna (ok. 20 marca) rozpoczyna wiosnę, przesilenie letnie (ok. 21 czerwca) — najdłuższy dzień w roku — lato, równonoc jesienna (ok. 23 września) jesień, a przesilenie zimowe (ok. 21–22 grudnia) — najkrótszy dzień — zimę.`,
        ],
      },
      {
        h2: "Pory roku astronomiczne, kalendarzowe i meteorologiczne",
        body: [
          `Pory roku astronomiczne liczy się od równonocy i przesileń. Pory kalendarzowe w Polsce tradycyjnie pokrywają się z astronomicznymi. Pory meteorologiczne, używane w klimatologii, zaczynają się pierwszego dnia miesiąca (wiosna 1 marca, lato 1 czerwca, jesień 1 września, zima 1 grudnia).`,
        ],
      },
    ],
    faq: [
      { q: `Kiedy zaczyna się wiosna w ${y} roku?`, a: `Astronomiczna wiosna zaczyna się w momencie równonocy wiosennej — dokładną datę i godzinę dla ${y} roku znajdziesz w zestawieniu powyżej (zwykle 20 marca).` },
      { q: "Który dzień jest najdłuższy w roku?", a: "Najdłuższy dzień przypada w przesilenie letnie (ok. 21 czerwca), a najkrótszy — w przesilenie zimowe (ok. 21–22 grudnia)." },
    ],
  }),

  // -----------------------------------------------------------------------
  "zmiana-czasu": (y) => ({
    intro: [
      `Zmiana czasu ${y} — kiedy przestawiamy zegarki na czas letni i zimowy w Polsce. Podajemy dokładne daty obu zmian oraz kierunek przesunięcia wskazówek, zgodnie z zasadami obowiązującymi w całej Unii Europejskiej.`,
    ],
    sections: [
      {
        h2: "Czas letni i zimowy — kiedy i jak przestawiać zegarki",
        body: [
          `Na czas letni przechodzimy w ostatnią niedzielę marca — zegary przesuwamy z 2:00 na 3:00 (śpimy godzinę krócej). Na czas zimowy wracamy w ostatnią niedzielę października — z 3:00 na 2:00 (śpimy godzinę dłużej). Zasada „w lecie do przodu, w zimie do tyłu" ułatwia zapamiętanie kierunku.`,
        ],
      },
      {
        h2: "Czy zmiana czasu zostanie zniesiona?",
        body: [
          `Unia Europejska prowadzi prace nad zniesieniem sezonowej zmiany czasu, jednak do czasu wspólnej decyzji państw członkowskich przestawianie zegarków obowiązuje bez zmian. Dopóki przepisy się nie zmienią, zmiana czasu odbywa się dwa razy w roku.`,
        ],
      },
    ],
    faq: [
      { q: `Kiedy zmiana czasu na letni w ${y} roku?`, a: `Zmiana na czas letni następuje w ostatnią niedzielę marca ${y} roku — dokładną datę podajemy powyżej. Zegary przesuwamy wtedy o godzinę do przodu.` },
      { q: "W którą stronę przestawiamy zegary jesienią?", a: "Jesienią (ostatnia niedziela października) cofamy zegary o godzinę — z 3:00 na 2:00. Zyskujemy wtedy dodatkową godzinę snu." },
    ],
  }),

  // -----------------------------------------------------------------------
  "niedziele-handlowe": (y) => ({
    intro: [
      `Niedziele handlowe ${y} — wykaz wszystkich niedziel, w które sklepy w Polsce są otwarte. W pozostałe niedziele obowiązuje zakaz handlu, z wyjątkami przewidzianymi w ustawie (m.in. stacje paliw, apteki, sklepy prowadzone przez właściciela).`,
    ],
    sections: [
      {
        h2: `Zasady handlu w niedziele ${y}`,
        body: [
          `Od 2020 roku handel dozwolony jest tylko w wybrane niedziele: zwykle ostatnią niedzielę stycznia, kwietnia, czerwca i sierpnia, dwie niedziele przed Bożym Narodzeniem oraz niedzielę przed Wielkanocą. Pełny wykaz niedziel handlowych ${y} znajdziesz powyżej.`,
        ],
      },
      {
        h2: "Gdzie można zrobić zakupy w niedziele niehandlowe?",
        body: [
          `W niedziele objęte zakazem handlu otwarte pozostają m.in. stacje paliw, apteki, piekarnie, kwiaciarnie, sklepy na dworcach i lotniskach oraz placówki, w których za ladą stoi sam właściciel. Coraz częściej działają też sklepy autonomiczne i automaty.`,
        ],
      },
    ],
    faq: [
      { q: `Ile niedziel handlowych jest w ${y} roku?`, a: `Liczbę i dokładne daty niedziel handlowych w ${y} roku znajdziesz w zestawieniu powyżej — zwykle jest ich kilka w ciągu roku.` },
      { q: "Czy w niedzielę niehandlową otwarte są stacje paliw?", a: "Tak. Zakaz handlu nie obejmuje m.in. stacji paliw, aptek, piekarni, kwiaciarni oraz sklepów prowadzonych osobiście przez właściciela." },
    ],
  }),

  // -----------------------------------------------------------------------
  wielkanoc: (y) => ({
    intro: [
      `Wielkanoc ${y} — sprawdź, kiedy wypada Niedziela Wielkanocna oraz powiązane z nią święta ruchome. Data Wielkanocy zmienia się co roku, ponieważ wyznacza ją pierwsza niedziela po pierwszej wiosennej pełni Księżyca.`,
    ],
    sections: [
      {
        h2: `Kiedy wypada Wielkanoc ${y}?`,
        body: [
          `Wielkanoc jest świętem ruchomym i może przypaść pomiędzy 22 marca a 25 kwietnia. Od jej daty zależą inne święta: Środa Popielcowa (46 dni wcześniej), Wielki Piątek i Wielka Sobota (przed Wielkanocą), Poniedziałek Wielkanocny, Wniebowstąpienie, Zesłanie Ducha Świętego oraz Boże Ciało.`,
        ],
      },
      {
        h2: "Jak wyznacza się datę Wielkanocy?",
        body: [
          `Datę Wielkanocy oblicza się metodą komputystyczną (algorytm Gaussa/Meeusa): to pierwsza niedziela po pierwszej pełni Księżyca przypadającej w dniu równonocy wiosennej lub po niej. Dlatego co roku Wielkanoc wypada w inny dzień.`,
        ],
      },
    ],
    faq: [
      { q: `W jaki dzień wypada Wielkanoc ${y}?`, a: `Dokładną datę Niedzieli Wielkanocnej ${y} oraz powiązanych świąt znajdziesz w zestawieniu powyżej.` },
      { q: "Dlaczego Wielkanoc co roku jest w innym terminie?", a: "Bo jest świętem ruchomym wyznaczanym astronomicznie — to pierwsza niedziela po pierwszej wiosennej pełni Księżyca, stąd data waha się między 22 marca a 25 kwietnia." },
      { q: "Które dni wolne zależą od Wielkanocy?", a: "Od Wielkanocy zależą: Wielki Piątek, Poniedziałek Wielkanocny, Zesłanie Ducha Świętego (Zielone Świątki) oraz Boże Ciało." },
    ],
  }),

  // -----------------------------------------------------------------------
  "swieta-nietypowe": (y) => ({
    intro: [
      `Święta nietypowe ${y} to kalendarz wesołych, zabawnych i mało znanych świąt obchodzonych każdego dnia roku — od Dnia Kota, przez Dzień Pizzy, po Dzień Bez Stanika. Świetny pomysł na posta, życzenia albo nietuzinkowy powód do świętowania.`,
    ],
    sections: [
      {
        h2: "Nietypowe święto na każdy dzień",
        body: [
          `Praktycznie każdy dzień w roku ma swoje nietypowe święto — czasem nawet kilka. Wiele z nich pochodzi z tradycji międzynarodowej (np. Międzynarodowy Dzień Szczęścia 20 marca), inne mają charakter żartobliwy i internetowy.`,
        ],
      },
      {
        h2: "Do czego przydają się święta nietypowe?",
        body: [
          `Nietypowe święta to gotowy pomysł na treść w mediach społecznościowych, oryginalne życzenia dla bliskich albo pretekst do małego świętowania w pracy czy w szkole. Sprawdź, jakie zabawne święto wypada dziś i w najbliższych dniach.`,
        ],
      },
    ],
    faq: [
      { q: "Jakie nietypowe święto jest dzisiaj?", a: "Wykaz nietypowych świąt na poszczególne dni roku znajdziesz powyżej — dla wielu dni przypada więcej niż jedno zabawne święto." },
      { q: "Czy święta nietypowe są dniami wolnymi?", a: "Nie. Święta nietypowe mają charakter nieoficjalny i zabawny — nie są dniami ustawowo wolnymi od pracy." },
    ],
  }),

  // -----------------------------------------------------------------------
  "kalendarz-szkolny": (y) => ({
    intro: [
      `Kalendarz szkolny ${y} zbiera najważniejsze daty roku szkolnego w Polsce: rozpoczęcie i zakończenie zajęć, ferie zimowe, przerwy świąteczne oraz dni wolne od zajęć dydaktycznych. Ułatwia planowanie nauki, wyjazdów i wypoczynku uczniom, rodzicom i nauczycielom.`,
    ],
    sections: [
      {
        h2: "Najważniejsze daty roku szkolnego",
        body: [
          `Rok szkolny tradycyjnie rozpoczyna się na początku września, a kończy w drugiej połowie czerwca. W trakcie roku przypadają: zimowa przerwa świąteczna, ferie zimowe (w różnych terminach zależnie od województwa), wiosenna przerwa świąteczna oraz egzaminy (ósmoklasisty i maturalne).`,
        ],
      },
      {
        h2: "Ferie zimowe według województw",
        body: [
          `Ferie zimowe w Polsce odbywają się w czterech różnych terminach, przydzielanych województwom rotacyjnie przez Ministerstwo Edukacji. Dzięki temu ruch turystyczny rozkłada się na kilka tygodni. Dokładne terminy dla swojego regionu sprawdzisz w kalendarzu ferii.`,
        ],
      },
    ],
    faq: [
      { q: `Kiedy zaczyna się rok szkolny ${y}?`, a: `Rok szkolny rozpoczyna się w pierwszych dniach września. Jeśli 1 września wypada w piątek lub weekend, inauguracja może przypaść na najbliższy dzień roboczy.` },
      { q: "Kiedy są ferie zimowe?", a: "Ferie zimowe trwają dwa tygodnie i odbywają się w jednym z czterech terminów (styczeń–luty), zależnie od województwa. Terminy ustala co roku Ministerstwo Edukacji." },
    ],
  }),

  // -----------------------------------------------------------------------
  "ferie-zimowe": (y) => ({
    intro: [
      `Ferie zimowe ${y} — terminy dwutygodniowej przerwy w nauce dla wszystkich województw. Ferie odbywają się w czterech różnych terminach, dzięki czemu ruch turystyczny w górach i ośrodkach wypoczynkowych rozkłada się na kilka tygodni.`,
    ],
    sections: [
      {
        h2: `Terminy ferii zimowych ${y} według województw`,
        body: [
          `Ministerstwo Edukacji dzieli kraj na cztery grupy województw, z których każda ma inny, dwutygodniowy termin ferii w styczniu lub lutym. Sprawdź w zestawieniu, kiedy z ferii korzysta Twoje województwo — pozwoli to zaplanować wyjazd i uniknąć największego tłoku.`,
        ],
      },
      {
        h2: "Jak zaplanować wypoczynek w ferie?",
        body: [
          `Jeśli zależy Ci na mniejszym tłoku i niższych cenach, wybierz wyjazd w terminie ferii innego województwa niż Twoje. Warto rezerwować noclegi z wyprzedzeniem, bo w szczycie sezonu miejsca w popularnych kurortach szybko się kończą.`,
        ],
      },
    ],
    faq: [
      { q: `Ile trwają ferie zimowe ${y}?`, a: "Ferie zimowe trwają dwa tygodnie (14 dni). Dokładny termin zależy od województwa — sprawdź zestawienie powyżej." },
      { q: "Dlaczego ferie są w różnych terminach?", a: "Aby rozłożyć ruch turystyczny, Ministerstwo Edukacji przydziela województwom cztery różne terminy ferii. Dzięki temu ośrodki wypoczynkowe nie są przeciążone w jednym tygodniu." },
    ],
  }),
};

export function getTypeSeo(slug: string, year: number): TypeSeo | null {
  const build = REGISTRY[slug];
  return build ? build(year) : null;
}

export function hasTypeSeo(slug: string): boolean {
  return slug in REGISTRY;
}
