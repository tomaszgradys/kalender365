// Zentrale Ablage der (KI-generierten) Hero-Bilder für Modul- und Anlassseiten.
// Leerer String / fehlender Eintrag = kein Bild → die Seite nutzt die
// SVG-Illustration als Fallback. Bilder werden per fal.ai (FLUX) erzeugt.

export const MODULE_HERO: Record<string, string> = {
  "besondere-tage": "https://v3b.fal.media/files/b/0aa192c7/s5ZvfKbz6hZNJdPdJpzgk.jpg",
  "namenstage": "https://v3b.fal.media/files/b/0aa192c7/lokCpkXel3eLxYN2VKsUY.jpg",
  "bauernregeln": "https://v3b.fal.media/files/b/0aa192c7/PIV_Yq4nkL7m_aUnyfQTz.jpg",
  "sternzeichen": "https://v3b.fal.media/files/b/0aa192c7/Zrh_-4UYnwJI-gvok5nsw.jpg",
  "mondkalender": "https://v3b.fal.media/files/b/0aa192c7/mxl9ICUxhptcokP1eb-PK.jpg",
};

export const EVENT_HERO: Record<string, string> = {
  "weiberfastnacht": "https://v3b.fal.media/files/b/0aa192bf/8tNv7HvtfczKkK6TUeRjn.jpg",
  "rosenmontag": "https://v3b.fal.media/files/b/0aa192bf/bIgz0n1B8ehFZHvo1sjrF.jpg",
  "fastnachtsdienstag": "https://v3b.fal.media/files/b/0aa192ca/4qPkm0Q_UGJlqVLXVEVNn.jpg",
  "aschermittwoch": "https://v3b.fal.media/files/b/0aa192c0/f_6Dznc85_aIcPQ6O4kDG.jpg",
  "valentinstag": "https://v3b.fal.media/files/b/0aa192c0/YEHN5kKhYPYFepMQCQR6W.jpg",
  "weltfrauentag": "https://v3b.fal.media/files/b/0aa192c1/rOKtq1hlJA1yHxFaW-lgC.jpg",
  "muttertag": "https://v3b.fal.media/files/b/0aa192c1/zCJVo87gmQQvjWyNFRlhQ.jpg",
  "vatertag": "https://v3b.fal.media/files/b/0aa192c1/1E54PbDKLMTG7sYjqSljn.jpg",
  "walpurgisnacht": "https://v3b.fal.media/files/b/0aa192c1/MGcARZSiDheFHq-KnTIbG.jpg",
  "halloween": "https://v3b.fal.media/files/b/0aa192c1/QxYGH7qqRSJA26q1pnbyF.jpg",
  "erntedankfest": "https://v3b.fal.media/files/b/0aa192c1/uXb-wO2KHrd5PIBy1aroo.jpg",
  "oktoberfest": "https://v3b.fal.media/files/b/0aa192c2/GYd6I5fhfDs2TvWecSNB9.jpg",
  "martinstag": "https://v3b.fal.media/files/b/0aa192c2/jd3xaMtx2x9ftNx0vulum.jpg",
  "volkstrauertag": "https://v3b.fal.media/files/b/0aa192c3/uWoz35-Nf4dAtozZFQTSU.jpg",
  "totensonntag": "https://v3b.fal.media/files/b/0aa192c4/1LvQOP7PxXBruZ7p1TWF4.jpg",
  "erster-advent": "https://v3b.fal.media/files/b/0aa192cf/E3hS88_o8C26X02Kc7Vvj.jpg",
  "zweiter-advent": "https://v3b.fal.media/files/b/0aa192c5/wyA2gPY8djPH2j1eutoQG.jpg",
  "dritter-advent": "https://v3b.fal.media/files/b/0aa192c5/a7Wgoj5-nioVfz3BfPcmd.jpg",
  "vierter-advent": "https://v3b.fal.media/files/b/0aa192c5/kEX37PAkXq0Pw7nfg_AYF.jpg",
  "nikolaus": "https://v3b.fal.media/files/b/0aa192c5/EqqSZg8VxtdE8EmlisS84.jpg",
  "heiligabend": "https://v3b.fal.media/files/b/0aa192c6/HKbB4H4NM5cDK0AL6ISna.jpg",
  "silvester": "https://v3b.fal.media/files/b/0aa192c6/soHd87fBsPCdzBWZqXJCw.jpg",
};

/** Gibt die Bild-URL zurück oder undefined (→ SVG-Fallback). */
export function heroSrc(map: Record<string, string>, key: string): string | undefined {
  const v = map[key];
  return v && v.length > 0 ? v : undefined;
}
