import PageWithSidebar from "@/components/de/PageWithSidebar";
import Breadcrumbs from "@/components/de/Breadcrumbs";
import type { Metadata } from "next";
import { berlinNow } from "@/lib/de/now";
import SonnenzeitenClient from "@/components/de/SonnenzeitenClient";
import SeoProse from "@/components/de/SeoProse";
import Faq from "@/components/de/Faq";
import { ogMeta } from "@/lib/de/ogMeta";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sonnenaufgang & Sonnenuntergang – Zeiten für Deutschland",
  description: "Sonnenaufgang, Sonnenuntergang und Tageslänge für deutsche Städte – tagesgenau, mit Ortsauswahl. Zeiten in MEZ/MESZ.",
  alternates: { canonical: "/sonnenaufgang-sonnenuntergang" },
  openGraph: ogMeta("/sonnenaufgang-sonnenuntergang", { defaultImage: true }),
};

export default function SonnenzeitenPage() {
  const { year, month0 } = berlinNow();
  return (
    <div className="flex-1">
      <PageWithSidebar>
        <Breadcrumbs
          items={[
            { name: "Start", url: "/" },
            { name: "Sonnenaufgang & Sonnenuntergang", url: "/sonnenaufgang-sonnenuntergang" },
          ]}
        />
        <h1 className="text-2xl font-black text-navy-800 sm:text-3xl">Sonnenaufgang &amp; Sonnenuntergang</h1>
        <p className="mt-2 max-w-2xl text-slate-600">Tagesgenaue Zeiten für Sonnenaufgang, Sonnenuntergang und Tageslänge. Wählen Sie eine Stadt und blättern Sie durch die Monate.</p>
        <div className="mt-6">
          <SonnenzeitenClient year={year} month0={month0} />
        </div>

        <SeoProse
          blocks={[
            {
              h2: "Sonnenaufgang und Sonnenuntergang in Deutschland",
              p: [
                "Wann die Sonne auf- und untergeht, hängt vom Datum und vom Standort ab. Im Norden Deutschlands sind die Tage im Sommer deutlich länger und im Winter kürzer als im Süden, weil der Sonnenstand vom Breitengrad abhängt. Wählen Sie oben Ihre Stadt, um tagesgenaue Zeiten für Sonnenaufgang, Sonnenuntergang und die Tageslänge zu erhalten. Alle Zeiten sind in mitteleuropäischer Zeit angegeben (MEZ bzw. MESZ während der Sommerzeit).",
                "Rund um die Sommersonnenwende im Juni erreicht die Tageslänge ihr Maximum, rund um die Wintersonnenwende im Dezember ihr Minimum. Zur Tagundnachtgleiche im März und September sind Tag und Nacht nahezu gleich lang.",
              ],
            },
          ]}
        />
        <Faq
          items={[
            { q: "Warum geht die Sonne im Norden früher unter als im Süden?", a: "Die Sonnenzeiten hängen vom Breiten- und Längengrad ab. Im Sommer sind die Tage im Norden länger, im Winter kürzer als im Süden Deutschlands – deshalb ist die Ortsauswahl wichtig." },
            { q: "In welcher Zeitzone gelten die Zeiten?", a: "Alle Zeiten gelten für Deutschland in MEZ (Winter) bzw. MESZ (Sommerzeit) und stellen sich automatisch um." },
            { q: "Was bedeutet die längste bzw. kürzeste Tageslänge?", a: "Die längste Tageslänge liegt um die Sommersonnenwende (ca. 21. Juni), die kürzeste um die Wintersonnenwende (ca. 21. Dezember). Die genauen Termine finden Sie auf der Seite Jahreszeiten." },
          ]}
        />
      </PageWithSidebar>
    </div>
  );
}
