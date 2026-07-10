import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import { SITE_URL, SITE_NAME } from "@/lib/de/site";
import { serializeJsonLd } from "@/lib/de/jsonLd";
import { berlinNow } from "@/lib/de/now";
import Header from "@/components/de/Header";
import Footer from "@/components/de/Footer";
import "../globals.css";

const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/png/web/mark-calendar-color-512.png`,
      description:
        "Kostenloser Kalender-Service für Deutschland: Kalender zum Ausdrucken, gesetzliche Feiertage, Schulferien, Brückentage, Kalenderwochen, Arbeitstage und Mondphasen — für alle 16 Bundesländer.",
      areaServed: { "@type": "Country", name: "Deutschland" },
      knowsAbout: [
        "Kalender",
        "gesetzliche Feiertage",
        "Schulferien",
        "Brückentage",
        "Arbeitstage",
        "Werktage",
        "Kalenderwochen",
        "Mondphasen",
        "Zeitumstellung",
        "Jahreszeiten",
        "Bundesländer",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: SITE_URL,
      inLanguage: "de-DE",
      description:
        "Kalender online und zum Ausdrucken: Feiertage, Schulferien, Brückentage, Kalenderwochen, Arbeitstage und Mondphasen — kostenlos für Deutschland und alle Bundesländer.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/suche?q={search_term_string}` },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Kalender online – Feiertage, Schulferien, Brückentage & PDF",
    template: "%s",
  },
  description:
    "Kalender, Feiertage, Schulferien, Kalenderwochen, Arbeitstage, Mondphasen und PDF – kostenlos für Deutschland und alle Bundesländer.",
  applicationName: SITE_NAME,
  openGraph: {
    siteName: SITE_NAME,
    locale: "de_DE",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export const viewport = { themeColor: "#003890" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const year = berlinNow().year;
  return (
    <html lang="de" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-navy-900">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(orgLd) }} />
        <a
          href="#inhalt"
          className="fixed left-4 top-4 z-[100] -translate-y-24 whitespace-nowrap rounded-lg bg-navy-700 px-4 py-2 font-semibold text-white shadow-lg transition-transform focus:translate-y-0"
        >
          Zum Inhalt springen
        </a>
        <Header year={year} />
        <main id="inhalt" className="flex flex-1 flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
