import type { Metadata } from "next";
import { geistSans, geistMono } from "@/lib/fonts";
import { SITE_URL, SITE_NAME } from "@/lib/site";
import { COMPANY } from "@/lib/company";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import CookieConsent from "@/components/CookieConsent";
import InstallBanner from "@/components/InstallBanner";
import "../globals.css";

const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "kalendarz.pro",
      legalName: COMPANY.legalName,
      url: SITE_URL,
      logo: `${SITE_URL}/brand/png/web/mark-calendar-color-512.png`,
      email: COMPANY.email,
      vatID: `PL${COMPANY.nip}`,
      taxID: COMPANY.nip,
      // Sygnały encji dla wyszukiwarek AI: jasny opis + obszar + tematy autorytetu.
      description:
        "Darmowy polski serwis kalendarzowy: kalendarze do druku, święta i dni wolne od pracy, imieniny, fazy księżyca z dokładnymi godzinami, wschody i zachody słońca, kalkulatory dat i planer urlopu.",
      areaServed: { "@type": "Country", name: "Polska" },
      knowsAbout: [
        "kalendarz",
        "święta w Polsce",
        "dni wolne od pracy",
        "dni robocze",
        "długie weekendy",
        "imieniny",
        "fazy księżyca",
        "pełnia księżyca",
        "wschód i zachód słońca",
        "numery tygodni ISO 8601",
        "ferie zimowe",
        "kalendarz szkolny",
        "zmiana czasu",
        "pory roku",
      ],
      address: {
        "@type": "PostalAddress",
        streetAddress: COMPANY.street,
        postalCode: COMPANY.postal,
        addressLocality: COMPANY.city,
        addressCountry: "PL",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: "kalendarz.pro",
      url: SITE_URL,
      inLanguage: "pl-PL",
      description:
        "Kalendarze online i do druku, święta, dni wolne, imieniny, fazy księżyca i kalkulatory dat — dla Polski, aktualne dla każdego roku.",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/szukaj?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — kalendarze do druku i pobrania`,
    // Bez sufiksu marki na podstronach — nazwa serwisu jest sygnalizowana przez
    // og:site_name i logo, a doklejanie „— Kalendarz.pro" wypychało tytuły ponad
    // zalecane ~580 px (ostrzeżenia SEO). Podstrony podają własny, zwięzły tytuł.
    template: "%s",
  },
  description:
    "Darmowe kalendarze na każdy rok: święta, dni wolne, imieniny, fazy księżyca i numery tygodni. Podgląd online i PDF do druku.",
  applicationName: "kalendarz.pro",
  openGraph: {
    siteName: SITE_NAME,
    locale: "pl_PL",
    type: "website",
    images: [{ url: "/brand/og/og-image-1200x630.jpg", width: 1200, height: 630, alt: "kalendarz.pro — kalendarze online i do druku" }],
  },
  twitter: { card: "summary_large_image", images: ["/brand/og/og-image-1200x630.jpg"] },
  // Ikony generuje automatycznie App Router z plików src/app/icon.png + favicon.ico
  // + apple-icon.png (brandowe, wysokiej rozdzielczości) — bez ręcznych linków.
  manifest: "/brand/favicon/site.webmanifest",
};

export const viewport = {
  themeColor: "#003890",
};

export default function PlRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-[var(--background)] text-navy-900">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        <SiteHeader />
        {children}
        <SiteFooter />
        <CookieConsent />
        <InstallBanner />
      </body>
    </html>
  );
}
