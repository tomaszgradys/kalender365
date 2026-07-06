import Link from "next/link";
import Logo from "@/components/de/Logo";
import { berlinNow } from "@/lib/de/now";

const YEAR = berlinNow().year;

type FootLink = { href: string; label: string };

const COLS: { title: string; links: FootLink[] }[] = [
  {
    title: "Kalender",
    links: [
      { href: `/kalender/${YEAR}`, label: `Kalender ${YEAR}` },
      { href: `/feiertage/${YEAR}`, label: "Feiertage" },
      { href: `/brueckentage/${YEAR}`, label: "Brückentage" },
      { href: `/kalenderwochen/${YEAR}`, label: "Kalenderwochen" },
      { href: `/arbeitstage/${YEAR}`, label: "Arbeitstage" },
      { href: `/schulferien/${YEAR}`, label: "Schulferien" },
    ],
  },
  {
    title: "Tools",
    links: [
      { href: `/urlaubsplaner/${YEAR}`, label: "Urlaubsplaner" },
      { href: "/arbeitstage-rechner", label: "Arbeitstage-Rechner" },
      { href: "/tage-rechner", label: "Tage-Rechner" },
      { href: "/wochentag-rechner", label: "Wochentag-Rechner" },
      { href: "/generatoren", label: "Alle Tools" },
    ],
  },
  {
    title: "Information",
    links: [
      { href: "/so-berechnen-wir", label: "So berechnen wir" },
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
      { href: "/cookies", label: "Cookies" },
      { href: "/nutzungsbedingungen", label: "Nutzungsbedingungen" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Kostenlose Kalender online und zum Ausdrucken — Feiertage, Schulferien, Brückentage,
              Kalenderwochen, Arbeitstage und Mondphasen für Deutschland und alle Bundesländer.
            </p>
          </div>

          {COLS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">{col.title}</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-slate-600 transition hover:text-navy-600">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} Kalender365.pro — alle Kalender kostenlos. Angaben ohne Gewähr.</p>
          <p className="text-slate-400">Kalender, Feiertage &amp; Schulferien für Deutschland</p>
        </div>
      </div>
    </footer>
  );
}
