// Sternzeichen (Tierkreiszeichen) — kalendarische Zuordnung Datum → Zeichen mit
// sachlicher Beschreibung (Element, Planet, Zeitraum, typische Eigenschaften).
// Bewusst nüchtern gehalten: Kalenderwissen, keine Wahrsagerei/Prognosen.

export type SternzeichenElement = "Feuer" | "Erde" | "Luft" | "Wasser";

export type Sternzeichen = {
  slug: string;
  name: string;
  symbol: string;
  element: SternzeichenElement;
  planet: string;
  /** Zeitraum als [von, bis] mit [Monat(1-12), Tag]. */
  von: [number, number];
  bis: [number, number];
  zeitraum: string; // "21. März – 20. April"
  kurz: string;
  eigenschaften: string[];
  beschreibung: string[];
};

export const STERNZEICHEN: Sternzeichen[] = [
  {
    slug: "widder",
    name: "Widder",
    symbol: "♈",
    element: "Feuer",
    planet: "Mars",
    von: [3, 21],
    bis: [4, 20],
    zeitraum: "21. März – 20. April",
    kurz: "Tatkräftig, mutig und immer voran.",
    eigenschaften: ["durchsetzungsstark", "spontan", "energiegeladen", "direkt"],
    beschreibung: [
      "Der Widder ist das erste Zeichen des Tierkreises und steht für Aufbruch und Neubeginn – passend zum Frühlingsanfang. Als Feuerzeichen unter dem Einfluss des Mars gilt er als tatkräftig, mutig und impulsiv.",
      "Widder-Geborene gehen Dinge gern direkt an und übernehmen die Führung. Geduld ist nicht immer ihre Stärke, dafür Begeisterung und Durchsetzungsvermögen.",
    ],
  },
  {
    slug: "stier",
    name: "Stier",
    symbol: "♉",
    element: "Erde",
    planet: "Venus",
    von: [4, 21],
    bis: [5, 20],
    zeitraum: "21. April – 20. Mai",
    kurz: "Bodenständig, genussvoll und beständig.",
    eigenschaften: ["beständig", "geduldig", "genussfreudig", "verlässlich"],
    beschreibung: [
      "Der Stier ist ein Erdzeichen und wird von der Venus regiert. Ihm werden Bodenständigkeit, Genuss und ein ausgeprägter Sinn für Sicherheit zugeschrieben.",
      "Stier-Geborene schätzen Beständigkeit, gutes Essen und Verlässlichkeit. Sie gelten als geduldig und ausdauernd, können aber auch stur sein, wenn es um ihre Überzeugungen geht.",
    ],
  },
  {
    slug: "zwillinge",
    name: "Zwillinge",
    symbol: "♊",
    element: "Luft",
    planet: "Merkur",
    von: [5, 21],
    bis: [6, 21],
    zeitraum: "21. Mai – 21. Juni",
    kurz: "Neugierig, kommunikativ und wandelbar.",
    eigenschaften: ["kommunikativ", "wissbegierig", "flexibel", "gesellig"],
    beschreibung: [
      "Die Zwillinge sind ein Luftzeichen unter dem Einfluss des Merkur, des Planeten der Kommunikation. Neugier, Wortgewandtheit und geistige Beweglichkeit prägen dieses Zeichen.",
      "Zwillinge-Geborene lieben Abwechslung, Gespräche und neue Eindrücke. Sie sind vielseitig interessiert, gelten aber manchmal als sprunghaft.",
    ],
  },
  {
    slug: "krebs",
    name: "Krebs",
    symbol: "♋",
    element: "Wasser",
    planet: "Mond",
    von: [6, 22],
    bis: [7, 22],
    zeitraum: "22. Juni – 22. Juli",
    kurz: "Gefühlvoll, fürsorglich und familienverbunden.",
    eigenschaften: ["empfindsam", "fürsorglich", "treu", "häuslich"],
    beschreibung: [
      "Der Krebs ist ein Wasserzeichen und wird vom Mond regiert. Er steht für Gefühl, Fürsorge und Verbundenheit mit Familie und Zuhause.",
      "Krebs-Geborene gelten als einfühlsam und treu, mit einem starken Bedürfnis nach Geborgenheit. Ihr Gefühlsleben ist reich, gegenüber Fremden zeigen sie sich zunächst zurückhaltend.",
    ],
  },
  {
    slug: "loewe",
    name: "Löwe",
    symbol: "♌",
    element: "Feuer",
    planet: "Sonne",
    von: [7, 23],
    bis: [8, 23],
    zeitraum: "23. Juli – 23. August",
    kurz: "Selbstbewusst, großzügig und herzlich.",
    eigenschaften: ["selbstbewusst", "großzügig", "warmherzig", "stolz"],
    beschreibung: [
      "Der Löwe ist ein Feuerzeichen und wird von der Sonne regiert. Ihm werden Selbstbewusstsein, Großzügigkeit und ein Hang zur Bühne nachgesagt.",
      "Löwe-Geborene stehen gern im Mittelpunkt, sind loyal und warmherzig. Anerkennung ist ihnen wichtig; im besten Fall verbinden sie Stolz mit echter Großzügigkeit.",
    ],
  },
  {
    slug: "jungfrau",
    name: "Jungfrau",
    symbol: "♍",
    element: "Erde",
    planet: "Merkur",
    von: [8, 24],
    bis: [9, 23],
    zeitraum: "24. August – 23. September",
    kurz: "Gründlich, praktisch und zuverlässig.",
    eigenschaften: ["analytisch", "ordentlich", "hilfsbereit", "gewissenhaft"],
    beschreibung: [
      "Die Jungfrau ist ein Erdzeichen unter dem Einfluss des Merkur. Sie steht für Genauigkeit, Ordnung und praktischen Verstand.",
      "Jungfrau-Geborene arbeiten gründlich, sind zuverlässig und hilfsbereit. Ihr kritischer Blick fürs Detail ist eine Stärke, kann sich aber auch gegen sie selbst richten.",
    ],
  },
  {
    slug: "waage",
    name: "Waage",
    symbol: "♎",
    element: "Luft",
    planet: "Venus",
    von: [9, 24],
    bis: [10, 23],
    zeitraum: "24. September – 23. Oktober",
    kurz: "Harmoniebedürftig, gerecht und charmant.",
    eigenschaften: ["ausgleichend", "diplomatisch", "ästhetisch", "gesellig"],
    beschreibung: [
      "Die Waage ist ein Luftzeichen und wird von der Venus regiert. Harmonie, Gerechtigkeit und Sinn für Ästhetik stehen im Vordergrund.",
      "Waage-Geborene suchen den Ausgleich und meiden Konflikte. Sie gelten als charmant und diplomatisch, tun sich mit Entscheidungen aber mitunter schwer.",
    ],
  },
  {
    slug: "skorpion",
    name: "Skorpion",
    symbol: "♏",
    element: "Wasser",
    planet: "Pluto (Mars)",
    von: [10, 24],
    bis: [11, 22],
    zeitraum: "24. Oktober – 22. November",
    kurz: "Intensiv, willensstark und tiefgründig.",
    eigenschaften: ["leidenschaftlich", "willensstark", "loyal", "tiefgründig"],
    beschreibung: [
      "Der Skorpion ist ein Wasserzeichen, dem Pluto (traditionell Mars) zugeordnet wird. Er steht für Intensität, Tiefe und Wandlungskraft.",
      "Skorpion-Geborene gelten als leidenschaftlich, willensstark und loyal. Sie gehen den Dingen auf den Grund und lassen sich nicht so leicht durchschauen.",
    ],
  },
  {
    slug: "schuetze",
    name: "Schütze",
    symbol: "♐",
    element: "Feuer",
    planet: "Jupiter",
    von: [11, 23],
    bis: [12, 21],
    zeitraum: "23. November – 21. Dezember",
    kurz: "Optimistisch, freiheitsliebend und weltoffen.",
    eigenschaften: ["optimistisch", "abenteuerlustig", "ehrlich", "weltoffen"],
    beschreibung: [
      "Der Schütze ist ein Feuerzeichen und wird vom Jupiter regiert. Freiheitsdrang, Optimismus und die Suche nach Sinn kennzeichnen dieses Zeichen.",
      "Schütze-Geborene reisen gern, denken über den Tellerrand hinaus und sagen offen ihre Meinung. Enge und Routine sind nicht ihre Sache.",
    ],
  },
  {
    slug: "steinbock",
    name: "Steinbock",
    symbol: "♑",
    element: "Erde",
    planet: "Saturn",
    von: [12, 22],
    bis: [1, 19],
    zeitraum: "22. Dezember – 19. Januar",
    kurz: "Diszipliniert, zielstrebig und ausdauernd.",
    eigenschaften: ["diszipliniert", "verantwortungsbewusst", "ehrgeizig", "geduldig"],
    beschreibung: [
      "Der Steinbock ist ein Erdzeichen und wird vom Saturn regiert. Er steht für Disziplin, Ausdauer und Verantwortungsbewusstsein.",
      "Steinbock-Geborene verfolgen ihre Ziele beharrlich und übernehmen gern Verantwortung. Sie gelten als bodenständig und zuverlässig, mitunter als reserviert.",
    ],
  },
  {
    slug: "wassermann",
    name: "Wassermann",
    symbol: "♒",
    element: "Luft",
    planet: "Uranus (Saturn)",
    von: [1, 20],
    bis: [2, 18],
    zeitraum: "20. Januar – 18. Februar",
    kurz: "Unabhängig, originell und zukunftsorientiert.",
    eigenschaften: ["unabhängig", "originell", "idealistisch", "erfinderisch"],
    beschreibung: [
      "Der Wassermann ist ein Luftzeichen, dem Uranus (traditionell Saturn) zugeordnet wird. Er steht für Unabhängigkeit, Originalität und Fortschritt.",
      "Wassermann-Geborene denken oft ihrer Zeit voraus, schätzen Freiheit und humanitäre Ideale. Konventionen begegnen sie mit gesunder Skepsis.",
    ],
  },
  {
    slug: "fische",
    name: "Fische",
    symbol: "♓",
    element: "Wasser",
    planet: "Neptun (Jupiter)",
    von: [2, 19],
    bis: [3, 20],
    zeitraum: "19. Februar – 20. März",
    kurz: "Einfühlsam, fantasievoll und mitfühlend.",
    eigenschaften: ["empathisch", "fantasievoll", "hilfsbereit", "sensibel"],
    beschreibung: [
      "Die Fische sind ein Wasserzeichen, dem Neptun (traditionell Jupiter) zugeordnet wird. Sie stehen für Mitgefühl, Fantasie und Intuition und schließen den Tierkreis ab.",
      "Fische-Geborene gelten als einfühlsam, hilfsbereit und kreativ. Ihre Sensibilität ist eine Gabe, kann sie aber auch verletzlich machen.",
    ],
  },
];

const BY_SLUG = new Map(STERNZEICHEN.map((z) => [z.slug, z]));

export function getSternzeichen(slug: string): Sternzeichen | null {
  return BY_SLUG.get(slug) ?? null;
}

/** Datum (Monat 0-basiert, Tag) → Sternzeichen. */
export function sternzeichenByDate(month0: number, day: number): Sternzeichen {
  const m = month0 + 1;
  for (const z of STERNZEICHEN) {
    const [vm, vd] = z.von;
    const [bm, bd] = z.bis;
    if (vm <= bm) {
      if ((m > vm || (m === vm && day >= vd)) && (m < bm || (m === bm && day <= bd))) return z;
    } else {
      // Zeichen über den Jahreswechsel (Steinbock)
      if (m > vm || (m === vm && day >= vd) || m < bm || (m === bm && day <= bd)) return z;
    }
  }
  return STERNZEICHEN[9]; // Steinbock als Fallback
}

export const ELEMENT_COLOR: Record<SternzeichenElement, string> = {
  Feuer: "#f59e0b",
  Erde: "#00b978",
  Luft: "#7f9fe0",
  Wasser: "#0649a8",
};
