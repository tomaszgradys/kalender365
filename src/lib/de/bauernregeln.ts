// Bauernregel / Spruch des Tages für die Kalenderblatt-Kartte. Volkstümliche
// Wetter- und Bauernregeln (Folklore, kulturell – ohne meteorologischen
// Anspruch). Datumsgebundene Regeln haben Vorrang; sonst wird deterministisch
// aus dem Pool nach Tag des Jahres rotiert.

const DATED: Record<string, string> = {
  "02-02": "Lichtmess im Klee, Ostern im Schnee.",
  "05-11": "Vor Bonifaz kein Sommer, nach der Sophie kein Frost.",
  "05-15": "Pankraz, Servaz, Bonifaz machen erst dem Sommer Platz.",
  "06-08": "Wie das Wetter am Medardustag, es sechs Wochen bleiben mag.",
  "06-24": "Regnet's am Johannistag, regnet's noch vierzehn Tage danach.",
  "06-27": "Wie das Wetter am Siebenschläfer sich verhält, ist es sieben Wochen lang bestellt.",
  "07-02": "Mariä Heimsuchung Regen bringt selten Segen.",
  "07-25": "Ist Sankt Jakob schön und rein, wird das nächste Jahr voll Korn sein.",
  "08-10": "Wie's Wetter am Laurentiustag, so wird der ganze Herbst danach.",
  "08-24": "Bartholomäus treibt den Herbst herein.",
  "09-29": "Ist's an Michaelis klar, gibt's ein schönes nächstes Jahr.",
  "10-16": "Sankt Gallus treibt die Kuh von der Weide ins Stroh.",
  "11-11": "Wie das Wetter an Martini war, so soll's bleiben das ganze Jahr.",
  "11-25": "Katharina stellt den Tanz ein.",
  "11-30": "Andreasschnee tut den Saaten weh.",
  "12-04": "Wie's Wetter an Barbara war, so wird's im ganzen nächsten Jahr.",
  "12-24": "Christnacht klar und hell, hofft man auf ein gutes Jahr.",
};

const POOL: string[] = [
  "Abendrot – Schönwetterbot; Morgenrot – mit Regen droht.",
  "Kräht der Hahn auf dem Mist, ändert sich das Wetter, oder es bleibt, wie es ist.",
  "Ist der Mai kühl und nass, füllt's dem Bauern Scheun' und Fass.",
  "April, April, der weiß nicht, was er will.",
  "Märzenstaub bringt Gras und Laub.",
  "Wenn die Schwalben niedrig fliegen, wirst du bald Regen kriegen.",
  "Nebel im Herbst und Sonnenschein bringen guten, kühlen Wein.",
  "Trockener Januar – dem Bauern ganz und gar.",
  "Februar, wenn's stürmt und schneit, ist der Frühling nicht mehr weit.",
  "Grüne Weihnacht, weiße Ostern.",
  "Säst du im Staub, so wächst dir Laub.",
  "Wie's Wetter am Sonntag, so die ganze Woche.",
  "Ist der Oktober warm und fein, kommt ein scharfer Winter drein.",
  "Wenn der Hahn kräht auf dem Tor, ändert sich das Wetter oder es bleibt, wie's war.",
  "Novemberdonner sagt dem Bauern Gutes an.",
  "Viel Eicheln im September, viel Schnee im Dezember.",
  "Wie der Juni, so der Dezember.",
  "August ohne Feuer, macht das Brot teuer.",
  "Juli heiß und ohne Regen, bringt dem Landmann keinen Segen.",
  "Ist der September lind, ist der Winter ein Kind.",
];

export function getBauernregel(month0: number, day: number): string {
  const key = `${String(month0 + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  if (DATED[key]) return DATED[key];
  const doy = Math.floor((Date.UTC(2001, month0, day) - Date.UTC(2001, 0, 1)) / 86400000);
  return POOL[doy % POOL.length];
}

export type DatierteRegel = { mmdd: string; month0: number; day: number; text: string };

/** Alle datumsgebundenen Bauernregeln (Lostage), chronologisch. */
export function getDatierteBauernregeln(): DatierteRegel[] {
  return Object.keys(DATED)
    .sort()
    .map((mmdd) => {
      const [m, d] = mmdd.split("-").map(Number);
      return { mmdd, month0: m - 1, day: d, text: DATED[mmdd] };
    });
}

/** Allgemeine (nicht datumsgebundene) Bauern- und Wetterregeln. */
export function getAllgemeineBauernregeln(): string[] {
  return [...POOL];
}
