// Szacunkowy koszt wygenerowania JEDNEGO wpisu blogowego (auto-blog: Claude + fal.ai)
// oraz koszt miesięczny przy publikacji co 2 dni (~15 wpisów/mies.).
//
// Składniki jednego wpisu:
//  - model claude-sonnet-5 (research web_search + tekst PL),
//  - narzędzie web_search (kilka wyszukiwań),
//  - obrazek hero FLUX dev (fal.ai), 1 sztuka.

export interface CostAssumptions {
  model: string;
  inputTokens: number; // łączny input (prompt + wstrzyknięte wyniki web_search)
  outputTokens: number; // wygenerowany JSON wpisu
  webSearches: number; // średnia liczba wyszukiwań
  fluxImageUsd: number; // FLUX dev, 1 obrazek landscape (~1 MP)
  price: {
    inputPerMUsd: number;
    outputPerMUsd: number;
    searchPerKUsd: number;
    promoNote: string;
  };
  postsPerMonth: number; // co 2 dni ≈ 15/mies.
  usdPln: number;
}

// Ceny 2026-07: Sonnet 5 w promocji do 2026-08-31 ($2/$10 za 1M), potem ~$3/$15.
// web_search: $10 / 1000 zapytań.
export const BLOG_COST: CostAssumptions = {
  model: "claude-sonnet-5",
  inputTokens: 30000,
  outputTokens: 6000,
  webSearches: 4,
  fluxImageUsd: 0.03,
  price: {
    inputPerMUsd: 2,
    outputPerMUsd: 10,
    searchPerKUsd: 10,
    promoNote: "ceny promocyjne Sonnet 5 do 2026-08-31 (potem ok. +50% za tokeny)",
  },
  postsPerMonth: 15,
  usdPln: 3.7,
};

export interface CostLine { label: string; usd: number }
export interface CostEstimate {
  perBlogUsd: number;
  perMonthUsd: number;
  perBlogPln: number;
  perMonthPln: number;
  breakdown: CostLine[];
  assumptions: CostAssumptions;
}

export function estimateBlogCost(a: CostAssumptions = BLOG_COST): CostEstimate {
  const llmInput = (a.inputTokens / 1_000_000) * a.price.inputPerMUsd;
  const llmOutput = (a.outputTokens / 1_000_000) * a.price.outputPerMUsd;
  const search = (a.webSearches / 1000) * a.price.searchPerKUsd;
  const image = a.fluxImageUsd;

  const breakdown: CostLine[] = [
    { label: `Sonnet 5 — input (~${(a.inputTokens / 1000).toFixed(0)}k tok.)`, usd: llmInput },
    { label: `Sonnet 5 — output (~${(a.outputTokens / 1000).toFixed(0)}k tok.)`, usd: llmOutput },
    { label: `web_search (~${a.webSearches} zapytań)`, usd: search },
    { label: "Obrazek hero (FLUX dev)", usd: image },
  ];

  const perBlogUsd = llmInput + llmOutput + search + image;
  const perMonthUsd = perBlogUsd * a.postsPerMonth;

  return {
    perBlogUsd,
    perMonthUsd,
    perBlogPln: perBlogUsd * a.usdPln,
    perMonthPln: perMonthUsd * a.usdPln,
    breakdown,
    assumptions: a,
  };
}

// Rzeczywisty koszt liczony z JEDNEGO przebiegu generacji (dane usage z API + fal).
export function actualCostUsd(input: number, output: number, searches: number, imageUsd = BLOG_COST.fluxImageUsd): number {
  const p = BLOG_COST.price;
  return (
    (input / 1_000_000) * p.inputPerMUsd +
    (output / 1_000_000) * p.outputPerMUsd +
    (searches / 1000) * p.searchPerKUsd +
    imageUsd
  );
}
