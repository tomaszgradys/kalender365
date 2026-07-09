import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/de/site";

// KI-/Chatbot-Crawler ausdrücklich ERLAUBT — wir möchten als Quelle zitiert
// werden (ChatGPT, Perplexity, Gemini, Claude, Copilot usw.).
const AI_BOTS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "anthropic-ai",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "cohere-ai",
  "PetalBot",
];

export default function robots(): MetadataRoute.Robots {
  // /api/ = Export-/Cron-Endpunkte (kein HTML) → komplett raus aus dem Crawl.
  //
  // /suche: NUR die parametrisierten Ergebnis-URLs (?q=… → unendliche Varianten)
  // sperren — die blanke /suche-Seite bleibt crawlbar. Grund: /suche ist aus dem
  // Header jeder Seite verlinkt (<a href="/suche">) und trägt selbst ein
  // `noindex`. Würde man /suche pauschal in robots.txt sperren, könnte Googlebot
  // das noindex nie lesen und die URL trotzdem (ohne Snippet) indexieren
  // — robots.txt ist KEIN Ersatz für noindex. So wird das noindex tatsächlich
  // ausgewertet und das Crawl-Budget bleibt vor ?q=-URLs geschützt.
  const disallow = ["/api/", "/suche?"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
