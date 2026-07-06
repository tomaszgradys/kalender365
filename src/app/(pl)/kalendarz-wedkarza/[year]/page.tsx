import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { STATIC_YEARS, isValidYear, MONTH_NAMES, yearRobotsMeta} from "@/lib/months";
import { getMoonPhasesForYear, type MoonPhaseType } from "@/lib/astroYear";
import { formatISODatePL } from "@/lib/format";
import CalYearShell from "@/components/CalYearShell";
import { ogType } from "@/lib/ogType";

export const dynamicParams = true;
export function generateStaticParams() {
  return STATIC_YEARS.map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: { params: Promise<{ year: string }> }): Promise<Metadata> {
  const { year } = await params;
  return {
    title: `Kalendarz wędkarza ${year} — kiedy łowić, a kiedy nie (wg księżyca)`,
    description: `Kalendarz wędkarza ${year}: dni bardzo dobrego, umiarkowanego i słabego brania ryb według faz księżyca. Sprawdź, kiedy warto iść na ryby.`,
    alternates: { canonical: `/kalendarz-wedkarza/${year}` },
    ...ogType("kalendarz-wedkarza"),
    ...yearRobotsMeta(year),
  };
}

function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const t = Date.UTC(y, m - 1, d) + n * 86400000;
  const dt = new Date(t);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

// Ocena brania per typ fazy
const RATING: Record<MoonPhaseType, { tier: "good" | "mid"; label: string; advice: string }> = {
  new: { tier: "good", label: "Bardzo dobre branie", advice: "Idź na ryby — szczyt aktywności." },
  full: { tier: "good", label: "Bardzo dobre branie", advice: "Idź na ryby — szczyt aktywności." },
  first: { tier: "mid", label: "Umiarkowane branie", advice: "Można łowić, brania słabsze." },
  last: { tier: "mid", label: "Umiarkowane branie", advice: "Można łowić, brania słabsze." },
};

export default async function WedkarzPage({ params }: { params: Promise<{ year: string }> }) {
  const { year: yp } = await params;
  const year = Number(yp);
  if (!isValidYear(year)) notFound();

  const phases = getMoonPhasesForYear(year);
  const byMonth: Record<number, typeof phases> = {};
  for (const p of phases) (byMonth[Number(p.date.split("-")[1]) - 1] ??= []).push(p);

  return (
    <CalYearShell
      slug="kalendarz-wedkarza"
      label="Kalendarz wędkarza"
      year={year}
      title={`Kalendarz wędkarza ${year}`}
      subtitle="Kiedy łowić, a kiedy odpuścić? Aktywność ryb jest największa wokół nowiu i pełni, a najsłabsza między fazami. Poniżej dni brania miesiąc po miesiącu."
      gradient="from-cyan-700 to-sky-500"
    >
      {/* PRZEWODNIK: kiedy łowić / kiedy nie */}
      <section className="mt-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
          <div className="text-sm font-bold text-emerald-800">🟢 Kiedy łowić</div>
          <p className="mt-1 text-sm text-emerald-700">
            ±2 dni od <strong>nowiu</strong> i <strong>pełni</strong> — najlepsze branie. Warto iść na ryby.
          </p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="text-sm font-bold text-amber-800">🟡 Umiarkowanie</div>
          <p className="mt-1 text-sm text-amber-700">
            Dni <strong>pierwszej</strong> i <strong>ostatniej kwadry</strong> — branie słabsze, ale możliwe.
          </p>
        </div>
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4">
          <div className="text-sm font-bold text-rose-800">🔴 Kiedy odpuścić</div>
          <p className="mt-1 text-sm text-rose-700">
            Dni pomiędzy fazami (daleko od nowiu i pełni) — ryby najmniej aktywne.
          </p>
        </div>
      </section>

      {/* MIESIĄCE */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {Array.from({ length: 12 }, (_, m) => (
          <div key={m} className="rounded-2xl border border-slate-200 p-4">
            <h2 className="mb-2 text-sm font-semibold text-slate-800">{MONTH_NAMES.pl[m]}</h2>
            <ul className="space-y-2 text-sm">
              {(byMonth[m] ?? []).map((p) => {
                const r = RATING[p.type];
                const isGood = r.tier === "good";
                return (
                  <li key={p.date} className="flex items-start gap-2">
                    <span className="text-base">{p.icon}</span>
                    <div>
                      <div className="text-slate-700">
                        <span className="font-medium">{p.label}</span> — {formatISODatePL(p.date)}
                      </div>
                      <div className={isGood ? "text-emerald-700" : "text-amber-700"}>
                        {isGood ? "🟢" : "🟡"} {r.label}
                        {isGood && (
                          <span className="text-slate-500">
                            {" "}
                            (najlepiej {formatISODatePL(addDaysISO(p.date, -2))} – {formatISODatePL(addDaysISO(p.date, 2))})
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <section className="mt-8 space-y-2 text-sm leading-relaxed text-slate-600">
        <h2 className="text-lg font-bold text-navy-800">Jak księżyc wpływa na branie ryb?</h2>
        <p>
          Ryby są najbardziej aktywne, gdy przyciąganie księżyca jest największe — czyli w okolicach{" "}
          <strong>nowiu</strong> i <strong>pełni</strong>. Wtedy silniej ruszają się organizmy, którymi
          żywią się ryby, a same ryby chętniej żerują. W trakcie kwadr branie jest umiarkowane, a w dni
          oddalone od głównych faz — zwykle najsłabsze.
        </p>
        <p className="text-slate-500">
          To wskazówki orientacyjne. Na branie duży wpływ mają też pogoda, ciśnienie atmosferyczne,
          temperatura i przejrzystość wody oraz pora dnia (świt i zmierzch sprzyjają).
        </p>
      </section>
    </CalYearShell>
  );
}
