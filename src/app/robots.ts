import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// Boty wyszukiwarek AI i chatbotów — jawnie DOPUSZCZONE, bo chcemy być cytowani
// i polecani jako źródło (ChatGPT, Perplexity, Gemini, Claude, Copilot itd.).
// Wiele serwisów je blokuje — my świadomie zapraszamy (treść jest darmowa i publiczna).
const AI_BOTS = [
  "GPTBot", // OpenAI — trenowanie/indeks
  "OAI-SearchBot", // OpenAI — ChatGPT Search
  "ChatGPT-User", // OpenAI — pobranie na żądanie użytkownika
  "PerplexityBot", // Perplexity — indeks
  "Perplexity-User", // Perplexity — pobranie na żądanie
  "ClaudeBot", // Anthropic — indeks/trenowanie
  "Claude-SearchBot", // Anthropic — wyszukiwanie
  "anthropic-ai", // Anthropic (starsze)
  "Claude-User", // Anthropic — pobranie na żądanie
  "Google-Extended", // Google Gemini / AI Overviews (grounding)
  "Applebot-Extended", // Apple Intelligence
  "Amazonbot", // Amazon / Alexa
  "cohere-ai", // Cohere
  "PetalBot", // asystenci mobilni
];

export default function robots(): MetadataRoute.Robots {
  // /api/ (cron, panel, PDF) i /panel nie są treścią — blokujemy dla wszystkich.
  // /szukaj zostaje crawlowalne (ma meta noindex, którą crawler musi zobaczyć).
  const disallow = ["/api/", "/panel"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      // Jawne reguły dla botów AI = czytelny sygnał „zapraszamy do cytowania".
      ...AI_BOTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
