import type { NextConfig } from "next";

// Content Security Policy — zezwala tylko na to, czego serwis realnie używa.
// react-pdf/exceljs/qrcode.toDataURL działają SERWEROWO (API routes, runtime nodejs),
// więc klient nie potrzebuje 'unsafe-eval' ani blob: (html2canvas/jspdf usunięte).
// QR renderuje się do data:-URL → pokrywa go img-src data:. 'unsafe-inline' w script-src
// zostaje, bo Next App Router wstrzykuje inline bootstrap/RSC (docelowo: CSP z nonce).
// 'unsafe-eval' TYLKO w dev — React używa eval() do debugowania w trybie dev,
// nigdy w produkcji (Vercel = NODE_ENV production → eval zablokowany).
const isDev = process.env.NODE_ENV !== "production";
const scriptSrc = ["script-src 'self' 'unsafe-inline'", isDev ? "'unsafe-eval'" : ""].filter(Boolean).join(" ");
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: https://fal.media https://*.fal.media",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  scriptSrc,
  "connect-src 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), interest-cohort=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  // Izolacja pochodzenia (Spectre) i zakaz osadzania naszych zasobów przez obce
  // domeny. Serwis niczego nie osadza cross-origin, więc same-origin jest bezpieczne.
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
];

const nextConfig: NextConfig = {
  // Okładki wpisów AI trzymamy jako URL z fal.ai (Vercel ma read-only FS). next/image
  // optymalizuje je i serwuje z naszej domeny (/_next/image → zgodne z CSP i cache
  // przeżywa wygaśnięcie URL-a fal).
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "fal.media" },
      { protocol: "https", hostname: "**.fal.media" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  // Kanoniczny host to apex kalender365.pro — www przekierowujemy 308 na apex,
  // żeby nie tworzyć duplikatu treści (www vs bez www).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kalender365.pro" }],
        destination: "https://kalender365.pro/:path*",
        permanent: true,
      },
      // „Gesetzliche Feiertage" ist ein Synonym-Keyword → 308 auf die Kanonische.
      { source: "/gesetzliche-feiertage/:year(\\d{4})", destination: "/feiertage/:year", permanent: true },
      { source: "/gesetzliche-feiertage/:year(\\d{4})/:land", destination: "/feiertage/:year/:land", permanent: true },
    ];
  },
};

export default nextConfig;
