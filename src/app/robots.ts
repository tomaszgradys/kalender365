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
  // /api/ = Export-/Cron-Endpunkte (kein HTML). /suche = interne Suchergebnisse
  // (noindex, ?q=… → unendliche URL-Varianten) — beides raus aus dem Crawl,
  // um Crawl-Budget zu sparen.
  const disallow = ["/api/", "/suche"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
