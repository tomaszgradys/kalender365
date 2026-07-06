import type { NextConfig } from "next";

// Content Security Policy — zezwala na to, czego serwis realnie używa
// (self, obrazy data/blob dla PDF/QR, style inline Tailwind, workery blob dla react-pdf/html2canvas).
const csp = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob:",
  "connect-src 'self' data: blob:",
  "worker-src 'self' blob:",
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
  // Kanoniczny host to apex kalendarz.pro — www przekierowujemy 308 na apex,
  // żeby nie tworzyć duplikatu treści (www vs bez www).
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.kalendarz.pro" }],
        destination: "https://kalendarz.pro/:path*",
        permanent: true,
      },
      // Sekcja EN usunięta — serwis jest wyłącznie po polsku.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/", permanent: true },
    ];
  },
};

export default nextConfig;
