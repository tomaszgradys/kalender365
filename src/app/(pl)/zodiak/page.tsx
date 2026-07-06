import type { Metadata } from "next";
import Link from "next/link";
import PageWithSidebar from "@/components/PageWithSidebar";
import { ogType } from "@/lib/ogType";

export const metadata: Metadata = {
  title: "Znaki zodiaku — daty i wykaz 12 znaków",
  description:
    "Wszystkie znaki zodiaku wraz z zakresami dat. Sprawdź, jaki znak zodiaku odpowiada dacie urodzenia — Baran, Byk, Bliźnięta, Rak, Lew, Panna i pozostałe.",
  alternates: { canonical: "/zodiak" },
  ...ogType("zodiak"),
};

const SIGNS = [
  { symbol: "♈", name: "Baran", range: "21 marca – 19 kwietnia", el: "Ogień" },
  { symbol: "♉", name: "Byk", range: "20 kwietnia – 20 maja", el: "Ziemia" },
  { symbol: "♊", name: "Bliźnięta", range: "21 maja – 20 czerwca", el: "Powietrze" },
  { symbol: "♋", name: "Rak", range: "21 czerwca – 22 lipca", el: "Woda" },
  { symbol: "♌", name: "Lew", range: "23 lipca – 22 sierpnia", el: "Ogień" },
  { symbol: "♍", name: "Panna", range: "23 sierpnia – 22 września", el: "Ziemia" },
  { symbol: "♎", name: "Waga", range: "23 września – 22 października", el: "Powietrze" },
  { symbol: "♏", name: "Skorpion", range: "23 października – 21 listopada", el: "Woda" },
  { symbol: "♐", name: "Strzelec", range: "22 listopada – 21 grudnia", el: "Ogień" },
  { symbol: "♑", name: "Koziorożec", range: "22 grudnia – 19 stycznia", el: "Ziemia" },
  { symbol: "♒", name: "Wodnik", range: "20 stycznia – 18 lutego", el: "Powietrze" },
  { symbol: "♓", name: "Ryby", range: "19 lutego – 20 marca", el: "Woda" },
];

export default function ZodiakPage() {
  return (
    <PageWithSidebar>
      <nav className="mb-4 text-sm text-slate-500">
        <Link href="/" className="hover:text-navy-600">Kalendarz.pro</Link> /{" "}
        <Link href="/kalendarze" className="hover:text-navy-600">Kalendarze</Link> / Znaki zodiaku
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Znaki zodiaku</h1>
      <p className="mt-3 max-w-2xl text-slate-600">
        Dwanaście znaków zodiaku wraz z zakresami dat i żywiołami. Aby poznać znak dla konkretnej daty
        urodzenia, otwórz kartkę z kalendarza tego dnia.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {SIGNS.map((s) => (
          <div key={s.name} className="flex items-center gap-4 rounded-2xl border border-slate-200 p-4">
            <div className="text-4xl">{s.symbol}</div>
            <div>
              <div className="font-semibold text-slate-800">{s.name}</div>
              <div className="text-sm text-slate-500">{s.range}</div>
              <div className="text-xs text-slate-500">Żywioł: {s.el}</div>
            </div>
          </div>
        ))}
      </div>
    </PageWithSidebar>
  );
}
