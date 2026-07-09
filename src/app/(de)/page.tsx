import Link from "next/link";
import type { Metadata } from "next";
import { berlinNow, isoWeekOf } from "@/lib/de/now";
import { formatFullDE, formatLongDE, weekdayDE } from "@/lib/de/locale";
import { getAllFeiertage } from "@/lib/de/feiertage";
import { MENU, resolveHref } from "@/lib/de/menu";
import { yearSummary } from "@/lib/de/calendar";
import { BUNDESLAENDER } from "@/lib/de/bundeslaender";
import { getBesondereTage } from "@/lib/de/besondereTage";
import EventArt from "@/components/de/EventArt";
import TearOff from "@/components/de/TearOff";
import PageWithSidebar from "@/components/de/PageWithSidebar";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";

// Zeigt das heutige Kalenderblatt — muss revalidieren, darf nicht auf den
// Build-Zeitpunkt eingefroren sein.
export const revalidate = 600;

export const metadata: Metadata = {
  title: "Kalender online und zum Ausdrucken – Feiertage, Schulferien & PDF",
  description:
    "Monatskalender, Jahreskalender, Feiertage, Schulferien, Arbeitstage, Kalenderwochen, Mondphasen und PDF – kostenlos für Deutschland und alle Bundesländer.",
  alternates: { canonical: "/" },
};

// Indexierbares Jahresfenster für die Startseiten-Kachelliste.
const YEARS = Array.from({ length: 9 }, (_, i) => 2024 + i);

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function HomePage() {
  const { year: cy, month0: cm, day: cd } = berlinNow();
  const isoToday = `${cy}-${pad(cm + 1)}-${pad(cd)}`;
  const { isoYear, week } = isoWeekOf(cy, cm, cd);
  const doy = Math.floor((Date.UTC(cy, cm, cd) - Date.UTC(cy, 0, 1)) / 86400000) + 1;
  const daysLeft = yearSummary(cy).totalDays - doy;
  const feiertagHeute = getAllFeiertage(cy).find((h) => h.date === isoToday && h.scope !== "sunday-legal");

  const beliebt = MENU[0].items;
  const kategorien = MENU.slice(1);

  // Nächste besondere Tage (Anlässe) ab heute, ggf. über den Jahreswechsel.
  const naechsteAnlaesse = (() => {
    const list = getBesondereTage(cy).filter((e) => e.iso >= isoToday);
    if (list.length < 4) list.push(...getBesondereTage(cy + 1).slice(0, 4 - list.length));
    return list.slice(0, 4);
  })();
  const tageBis = (iso: string) => Math.round((Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${isoToday}T00:00:00Z`)) / 86400000);

  return (
    <main className="flex-1">
      {/* HERO */}
      <section className="border-b border-slate-100 bg-gradient-to-br from-navy-700 to-navy-800">
        <div className="mx-auto max-w-6xl px-4 py-9">
          <h1 className="text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
            Kalender online und zum Ausdrucken
          </h1>
          <p className="mt-2 max-w-2xl text-navy-100">
            Monatskalender, Jahreskalender, Feiertage, Schulferien, Arbeitstage, Kalenderwochen, Mondphasen
            und PDF – kostenlos für Deutschland und alle Bundesländer.
          </p>
        </div>
      </section>

      <PageWithSidebar>
        {/* KALENDERBLATT (Abreißkalender) + HEUTE */}
        <section className="grid items-start gap-8 lg:grid-cols-[24rem_1fr]">
          <TearOff year={cy} monthIndex={cm} day={cd} />

          <div className="flex flex-col justify-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-green-600">Heute ist</p>
          <p className="mt-1 text-2xl font-black text-navy-800">{formatFullDE(isoToday)}</p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700">{doy}. Tag des Jahres</span>
            <span className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700">noch {daysLeft} Tage bis Jahresende</span>
            <Link href={`/kalenderwochen/${isoYear}`} className="rounded-full bg-navy-50 px-3 py-1 font-medium text-navy-700 hover:bg-navy-100">
              KW {week} →
            </Link>
            {feiertagHeute && (
              <span className="rounded-full bg-brand-green-50 px-3 py-1 font-semibold text-brand-green-700">🎉 {feiertagHeute.name}</span>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2 text-sm">
            <Link href={`/kalender/${cy}`} className="rounded-lg bg-navy-600 px-4 py-2 font-semibold text-white hover:bg-navy-700">
              Kalender {cy}
            </Link>
            <Link href={`/feiertage/${cy}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
              Feiertage {cy}
            </Link>
            <Link href={`/brueckentage/${cy}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
              Brückentage {cy}
            </Link>
            <Link href={`/kalenderblatt/${isoToday}`} className="rounded-lg border border-slate-200 px-4 py-2 font-medium text-slate-700 hover:border-navy-300 hover:text-navy-600">
              Kalenderblatt heute
            </Link>
          </div>
          </div>
        </section>

        {/* BELIEBT */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-navy-800">Beliebt</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {beliebt.map((c) => (
              <Link
                key={c.label}
                href={resolveHref(c.href, cy)}
                className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
              >
                <span aria-hidden="true" className="text-2xl leading-none">{c.emoji}</span>
                <span className="text-sm font-semibold text-navy-800">{resolveHref(c.label, cy)}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* NÄCHSTE ANLÄSSE */}
        <section className="mt-10">
          <div className="mb-4 flex items-end justify-between gap-3">
            <h2 className="text-xl font-bold text-navy-800">Nächste Anlässe</h2>
            <Link href={`/besondere-tage/${cy}`} className="text-sm font-medium text-navy-600 hover:underline">Alle besonderen Tage →</Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {naechsteAnlaesse.map((e) => {
              const days = tageBis(e.iso);
              const rel = days === 0 ? "heute" : days === 1 ? "morgen" : `in ${days} Tagen`;
              return (
                <Link
                  key={`${e.iso}-${e.slug}`}
                  href={`/besondere-tage/${e.iso.slice(0, 4)}/${e.slug}`}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-md"
                >
                  <EventArt motif={e.motif} uid={`home-${e.slug}`} className="h-24 w-full" rounded={false} />
                  <div className="p-4">
                    <div className="font-bold text-navy-800">{e.emoji} {e.name}</div>
                    <div className="mt-0.5 text-sm text-slate-600">{weekdayDE(e.iso)}, {formatLongDE(e.iso)}</div>
                    <div className="mt-1 inline-block rounded-full bg-brand-green-50 px-2 py-0.5 text-xs font-semibold text-brand-green-700">{rel}</div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* KATEGORIEN */}
        <section className="mt-10">
          <h2 className="mb-4 text-xl font-bold text-navy-800">Kategorien</h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {kategorien.map((s) => (
              <div key={s.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                <h3 className="mb-2 text-sm font-bold text-navy-700">{s.title}</h3>
                <ul className="space-y-1">
                  {s.items.map((it) => (
                    <li key={it.label}>
                      <Link href={resolveHref(it.href, cy)} className="flex items-center gap-2 rounded-lg px-1.5 py-1 text-sm text-slate-600 hover:bg-navy-50 hover:text-navy-700">
                        <span aria-hidden="true" className="w-5 text-center">{it.emoji}</span>
                        {resolveHref(it.label, cy)}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* BUNDESLAND */}
        <section className="mt-10">
          <h2 className="mb-1 text-xl font-bold text-navy-800">Feiertage &amp; Schulferien nach Bundesland</h2>
          <p className="mb-4 text-sm text-slate-500">Wählen Sie Ihr Bundesland — Feiertage, Brückentage und Schulferien gelten je nach Land unterschiedlich.</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {BUNDESLAENDER.map((b) => (
              <Link
                key={b.code}
                href={`/feiertage/${cy}/${b.slug}`}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-navy-700 transition hover:-translate-y-0.5 hover:border-navy-300 hover:shadow-sm"
              >
                {b.name}
              </Link>
            ))}
          </div>
        </section>

        {/* JAHRE */}
        <section className="mt-10">
          <h2 className="mb-1 text-xl font-bold text-navy-800">Kalender nach Jahr</h2>
          <p className="mb-4 text-sm text-slate-500">Jahreskalender mit Feiertagen, Kalenderwochen und Arbeitstagen.</p>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
            {YEARS.map((year) => {
              const s = yearSummary(year);
              const isCurrent = year === cy;
              return (
                <Link
                  key={year}
                  href={`/kalender/${year}`}
                  className={`rounded-2xl border p-3 text-center transition hover:-translate-y-0.5 hover:shadow-md ${
                    isCurrent ? "border-brand-green-500 bg-brand-green-50 ring-1 ring-brand-green-500" : "border-slate-200 bg-white hover:border-navy-300"
                  }`}
                >
                  <div className="text-xl font-black text-navy-800">{year}</div>
                  <div className="mt-0.5 text-[11px] text-slate-500">{s.feiertageCount} Feiertage · {s.isoWeeks} KW</div>
                </Link>
              );
            })}
          </div>
        </section>

        <SeoProse
          className="mt-12"
          blocks={[
            {
              h2: `Kalender ${cy} für Deutschland – alles auf einen Blick`,
              p: [
                `Auf Kalender365 finden Sie den kompletten Kalender ${cy} für Deutschland und alle 16 Bundesländer – online und kostenlos zum Ausdrucken. Neben dem Monats- und Jahreskalender bündeln wir alle Termine, die den Alltag strukturieren: gesetzliche Feiertage, Schulferien, Brückentage, Kalenderwochen (KW nach ISO 8601), Arbeitstage sowie astronomische Daten wie Mondphasen, Sonnenauf- und -untergang und den Beginn der Jahreszeiten.`,
                `Weil Feiertage und Schulferien in Deutschland Ländersache sind, lassen sich alle Übersichten nach Bundesland filtern. So sehen Sie sofort, welche Feiertage bei Ihnen gelten und wann die Ferien beginnen. Jede Ansicht steht als PDF zum Ausdrucken sowie als ICS-Datei für Google Kalender, Outlook oder Apple Kalender bereit.`,
              ],
            },
            {
              h2: "Feiertage, Ferien und Urlaub clever planen",
              p: [
                `Wer seinen Urlaub geschickt plant, macht aus wenigen Urlaubstagen lange freie Blöcke. Nutzen Sie dafür die Brückentage-Übersicht und den Urlaubsplaner: Beide zeigen, wie sich Feiertage und Wochenenden optimal kombinieren lassen. Für Termine und Fristen helfen zusätzlich der Tage-Rechner, der Arbeitstage-Rechner und der Wochentag-Rechner.`,
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: `Wie viele Feiertage hat ${cy} in Deutschland?`, a: `Bundesweit gibt es ${cy} neun gesetzliche Feiertage, die in allen Bundesländern gelten. Je nach Bundesland kommen regionale Feiertage hinzu – Bayern hat mit bis zu 13 die meisten.` },
            { q: "Ist der Kalender kostenlos und ohne Anmeldung nutzbar?", a: "Ja. Alle Kalender, Feiertags- und Ferienübersichten sowie die PDF- und ICS-Downloads sind kostenlos und ohne Registrierung nutzbar." },
            { q: "Kann ich die Feiertage in meinen Kalender importieren?", a: "Ja. Zu jeder Feiertags- und Ferienseite gibt es eine ICS-Datei, die Sie direkt in Google Kalender, Outlook oder Apple Kalender einbinden können." },
            { q: "Gelten die Angaben für mein Bundesland?", a: "Feiertage und Schulferien lassen sich nach Bundesland auswählen. So sehen Sie genau die Termine, die in Ihrem Land gelten." },
          ]}
        />
      </PageWithSidebar>
    </main>
  );
}
