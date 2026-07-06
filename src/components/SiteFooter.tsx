import Link from "next/link";
import Logo from "@/components/Logo";
import CookieSettingsLink from "@/components/CookieSettingsLink";
import { COMPANY_LINE } from "@/lib/company";
import { warsawNow } from "@/lib/now";

const YEAR = warsawNow().year;

type FootLink = { href: string; label: string };

const COLS: { title: string; links: FootLink[] }[] = [
  {
    title: "Kalendarze",
    links: [
      { href: `/kalendarz/${YEAR}`, label: `Kalendarz ${YEAR}` },
      { href: "/kalendarz-do-druku/" + YEAR, label: "Kalendarz do druku (PDF)" },
      { href: `/tydzien/${YEAR}`, label: "Numery tygodni" },
      { href: `/dni-wolne-od-pracy/${YEAR}`, label: "Dni wolne od pracy" },
      { href: `/dlugie-weekendy/${YEAR}`, label: "Długie weekendy" },
      { href: `/swieta/${YEAR}`, label: "Kalendarz świąt" },
    ],
  },
  {
    title: "Narzędzia",
    links: [
      { href: `/planer-urlopu/${YEAR}`, label: "Planer urlopu" },
      { href: "/generatory", label: "Generatory" },
      { href: "/narzedzia", label: "Kalkulatory dat" },
      { href: "/plan-lekcji", label: "Plan lekcji" },
      { href: "/imieniny", label: "Imieniny" },
      { href: `/fazy-ksiezyca/${YEAR}`, label: "Fazy księżyca" },
    ],
  },
  {
    title: "Informacje",
    links: [
      { href: "/blog", label: "Blog" },
      { href: "/o-nas", label: "O nas" },
      { href: "/jak-liczymy", label: "Jak liczymy" },
      { href: "/polityka-prywatnosci", label: "Polityka prywatności" },
      { href: "/polityka-cookies", label: "Polityka cookies" },
      { href: "/regulamin", label: "Regulamin" },
    ],
  },
];

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
          {/* Marka */}
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Darmowe kalendarze online i do druku — miesięczne, roczne, święta, dni wolne, imieniny,
              fazy księżyca i planer urlopu. Wszystko w jednym miejscu.
            </p>
          </div>

          {/* Kolumny linków */}
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
                {col.title === "Informacje" && (
                  <li>
                    <CookieSettingsLink label="Ustawienia cookies" />
                  </li>
                )}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {YEAR} kalendarz.pro — wszystkie kalendarze za darmo. Serwis ma charakter informacyjny.</p>
          <p className="text-slate-400">{COMPANY_LINE}</p>
        </div>
        {/* Dyskretny, mało widoczny link do panelu admina. */}
        <p className="mt-3 text-center">
          <Link href="/panel" rel="nofollow" className="text-[10px] lowercase tracking-widest text-slate-300 hover:text-slate-400">
            panel
          </Link>
        </p>
      </div>
    </footer>
  );
}
