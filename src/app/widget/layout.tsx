import type { Metadata } from "next";

// Eigenes Minimal-Layout für einbettbare Widgets (/widget/…): kein Header,
// keine Navigation, Systemschrift – die Seite wird per <iframe> auf fremden
// Websites (Schulen, Elternvertretungen, Vereine) eingebunden. Framing wird
// für diesen Pfad in next.config.ts erlaubt (frame-ancestors *).
export const metadata: Metadata = {
  robots: { index: false, follow: true },
};

export default function WidgetLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
          color: "#0f172a",
          background: "#fff",
          fontSize: 14,
          lineHeight: 1.45,
        }}
      >
        {children}
      </body>
    </html>
  );
}
