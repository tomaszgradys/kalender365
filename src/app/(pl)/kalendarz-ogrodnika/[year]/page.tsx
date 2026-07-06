import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, MONTH_NAMES, yearRobotsMeta} from "@/lib/months";
import { getMoonPhasesForYear, type MoonPhaseType } from "@/lib/astroYear";
import CalYearShell from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Kalendarz ogrodnika ${year} — co robić w ogrodzie miesiąc po miesiącu`,
    description: `Kalendarz ogrodnika ${year} dla polskich warunków: co siać, sadzić i zbierać w każdym miesiącu oraz najlepsze dni według faz księżyca.`,
    alternates: { canonical: `/kalendarz-ogrodnika/${year}` },
    ...ogType("kalendarz-ogrodnika"),
    ...yearRobotsMeta(year),
  };
}

// Realne prace ogrodowe w polskim klimacie (strefa 6–7), miesiąc po miesiącu.
const MONTH_TASKS: string[] = [
  // styczeń
  "Zima — w ogrodzie spokój. Planuj nasadzenia i zamawiaj nasiona, otrząsaj śnieg z gałęzi krzewów, dokarmiaj ptaki, doglądaj roślin doniczkowych i przechowywanych plonów. Pod koniec miesiąca możesz wysiać na rozsadę paprykę i seler (pod oświetleniem).",
  // luty
  "Wysiew na rozsadę pod osłonami: papryka, bakłażan, seler, por, a pod koniec miesiąca pomidory. W dni bezmrozowe cięcie jabłoni i grusz. Przegląd przechowywanych warzyw i cebul.",
  // marzec
  "Start sezonu. Rozsada: pomidory, kapusta, sałata. Do gruntu (gdy gleba obeschnie): groch, bób, marchew, pietruszka, cebula, rzodkiewka, szpinak. Cięcie krzewów jagodowych, grabienie i wapnowanie.",
  // kwiecień
  "Wysiew do gruntu: marchew, buraki, sałata, rzodkiewka, koper, groch. Sadzenie ziemniaków, cebuli dymki i czosnku jarego. Sadzenie krzewów i bylin. Hartowanie rozsady.",
  // maj
  "Po 15 maja (zimni ogrodnicy) sadź rośliny ciepłolubne: pomidory, ogórki, cukinia, dynia, fasola, papryka. Wysiew fasoli i ogórków do gruntu. Pikowanie, pierwsze pielenie i podlewanie.",
  // czerwiec
  "Podlewanie i pielenie. Sukcesywny wysiew sałaty, rzodkiewki i fasoli. Pierwsze zbiory: rzodkiewka, sałata, szczypior, truskawki. Usuwanie wilków (bocznych pędów) u pomidorów.",
  // lipiec
  "Zbiory: ogórki, cukinia, bób, groch, porzeczki, maliny, wiśnie. Podlewanie w upały rano lub wieczorem. Wysiew na jesienny zbiór: rzodkiewka, sałata, koper, cykoria.",
  // sierpień
  "Zbiory: pomidory, papryka, fasola, wczesne jabłka i śliwki. Wysiew na jesień i zimę: sałata, szpinak, roszponka. Sadzenie truskawek. Suszenie ziół.",
  // wrzesień
  "Zbiory: dynie, kapusta, buraki, marchew, jabłka, gruszki. Sadzenie czosnku ozimego (koniec września), wysiew roszponki i szpinaku. Dobry czas na sadzenie krzewów i drzew.",
  // październik
  "Zbiór przed przymrozkami: dynie, ostatnie pomidory, marchew, buraki, pory. Sadzenie cebul kwiatowych (tulipany, żonkile) oraz drzew i krzewów. Grabienie liści, okrywanie roślin wrażliwych.",
  // listopad
  "Przygotowanie do zimy: okrywanie bylin i róż, kopczykowanie, ostatnie sadzenie czosnku i cebul kwiatowych, zabezpieczenie pni przed gryzoniami. Przekopanie pustych grządek.",
  // grudzień
  "Zima. Otrząsaj śnieg z gałęzi, dokarmiaj ptaki, sprawdzaj przechowywane plony i planuj ogród na przyszły rok. Chroń rośliny wrażliwe przed mrozem.",
];

function isActiveSeason(m: number) {
  return m >= 2 && m <= 9; // marzec–październik
}
function isHarvest(m: number) {
  return m >= 5 && m <= 9; // czerwiec–październik
}
function isSpring(m: number) {
  return m >= 2 && m <= 4; // marzec–maj
}

function moonAdvice(m: number, type: MoonPhaseType): string {
  const active = isActiveSeason(m);
  switch (type) {
    case "new":
      return active
        ? "Odpoczynek gleby — pielenie, odchwaszczanie i przekopywanie."
        : "Odpoczynek — planowanie ogrodu, porządki i przegląd nasion.";
    case "first":
      return active
        ? "Księżyc przybywa — siej i sadź warzywa plonujące nad ziemią (liściowe i owocowe)."
        : "Poza sezonem siewu do gruntu — możliwy wysiew na rozsadę pod osłonami.";
    case "full":
      if (isHarvest(m)) return "Pełnia — dobry czas na zbiór ziół i owoców oraz podlewanie.";
      if (isSpring(m)) return "Pełnia — podlewanie i pielęgnacja; na zbiory jeszcze za wcześnie.";
      return "Pełnia — poza sezonem prac w gruncie; doglądaj roślin doniczkowych.";
    case "last":
      return active
        ? "Księżyc ubywa — sadź rośliny korzeniowe (marchew, buraki, czosnek), przycinaj i nawoź."
        : "Księżyc ubywa — cięcie drzew w dni bezmrozowe, przekopywanie grządek.";
  }
}

export default async function OgrodnikPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const phases = getMoonPhasesForYear(year);
  const byMonth: Record<number, typeof phases> = {};
  for (const p of phases) (byMonth[Number(p.date.split("-")[1]) - 1] ??= []).push(p);

  return (
    <CalYearShell
      slug="kalendarz-ogrodnika"
      label="Kalendarz ogrodnika"
      year={year}
      title={`Kalendarz ogrodnika ${year}`}
      subtitle="Co siać, sadzić i zbierać w polskim ogrodzie — miesiąc po miesiącu, z najlepszymi dniami według faz księżyca."
      gradient="from-green-700 to-lime-500"
    >
      <div className="mt-6 space-y-4">
        {Array.from({ length: 12 }, (_, m) => (
          <div key={m} className="rounded-2xl border border-slate-200 bg-white p-4">
            <h2 className="font-bold text-navy-800">{MONTH_NAMES.pl[m]}</h2>
            <p className="mt-1 text-sm text-slate-600">{MONTH_TASKS[m]}</p>

            {(byMonth[m] ?? []).length > 0 && (
              <ul className="mt-3 space-y-1.5 border-t border-slate-100 pt-3 text-sm">
                {(byMonth[m] ?? []).map((p) => (
                  <li key={p.date} className="flex gap-2">
                    <span>{p.icon}</span>
                    <div>
                      <span className="font-mono text-slate-700">{p.date.split("-").reverse().join(".")}</span>{" "}
                      <span className="font-medium text-slate-600">— {p.label}:</span>{" "}
                      <span className="text-slate-500">{moonAdvice(m, p.type)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <section className="mt-8 space-y-2 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-navy-800">Jak korzystać z kalendarza</h2>
        <p>
          Górny opis każdego miesiąca to realne prace w polskim ogrodzie (strefa mrozoodporności 6–7).
          Daty faz księżyca wskazują dodatkowo najlepszy moment na dany typ prac: przy{" "}
          <strong>przybywającym</strong> księżycu lepiej udają się rośliny plonujące nad ziemią, przy{" "}
          <strong>ubywającym</strong> — korzeniowe, sadzenie i cięcie.
        </p>
        <p className="text-slate-500">
          Terminy są orientacyjne — dostosuj je do pogody w Twoim regionie (na północy i w górach sezon
          zaczyna się później).
        </p>
      </section>
    </CalYearShell>
  );
}
