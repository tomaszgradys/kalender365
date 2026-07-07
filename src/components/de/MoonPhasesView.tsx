import Link from "next/link";
import { getMoonPhaseInstants, type PhaseType } from "@/lib/de/moonPhases";
import { formatLongDE, weekdayDE } from "@/lib/de/locale";

export default function MoonPhasesView({
  year,
  only,
  title,
  intro,
}: {
  year: number;
  only?: PhaseType;
  title: string;
  intro: string;
}) {
  const all = getMoonPhaseInstants(year);
  const phases = only ? all.filter((p) => p.type === only) : all;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8">
      <nav className="mb-4 text-sm text-slate-500" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-navy-600">Start</Link> <span className="mx-1">/</span>
        <span className="text-navy-700">{title}</span>
      </nav>
      <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{intro}</p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-4 py-2 font-medium">Phase</th>
              <th className="px-4 py-2 font-medium">Datum</th>
              <th className="px-4 py-2 font-medium">Uhrzeit</th>
              <th className="px-4 py-2 font-medium">Sternzeichen</th>
            </tr>
          </thead>
          <tbody>
            {phases.map((p, i) => (
              <tr key={i} className="border-t border-slate-100">
                <td className="px-4 py-2 font-medium text-navy-800">
                  <span className="mr-1">{p.icon}</span>{p.label}
                  {p.blueMoon && <span className="ml-2 rounded-full bg-brand-green-100 px-2 py-0.5 text-[10px] font-bold text-brand-green-700">Blue Moon</span>}
                </td>
                <td className="px-4 py-2 text-slate-600 whitespace-nowrap">{formatLongDE(p.date)} ({weekdayDE(p.date)})</td>
                <td className="px-4 py-2 text-slate-600">{p.time} Uhr</td>
                <td className="px-4 py-2 text-slate-600">{p.zodiacSymbol} {p.zodiacSign}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-400">Alle Uhrzeiten in mitteleuropäischer Zeit (Europe/Berlin), inkl. Sommerzeit. Berechnung nach Meeus.</p>

      <div className="mt-6 flex flex-wrap gap-2 text-sm">
        <Link href={`/mondphasen/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Alle Mondphasen</Link>
        <Link href={`/vollmond/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Vollmond</Link>
        <Link href={`/neumond/${year}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">Neumond</Link>
        <Link href={`/mondphasen/${year - 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">← {year - 1}</Link>
        <Link href={`/mondphasen/${year + 1}`} className="rounded-lg border border-slate-200 px-3 py-1.5 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">{year + 1} →</Link>
      </div>
    </div>
  );
}
