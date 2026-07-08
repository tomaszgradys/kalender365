// JSON-LD helpers. Single place that serializes structured data so every page
// is protected against `</script>` breakout (relevant for AI-generated blog
// content, harmless but consistent for deterministic pages).

/** Escape `<` so embedded strings can never close the <script> tag. */
export function serializeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export type QA = { q: string; a: string };

/** Build a schema.org FAQPage object from a list of question/answer pairs. */
export function faqPageLd(items: QA[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export type Crumb = { name: string; url: string };

/** Build a schema.org BreadcrumbList. `url` values are joined onto SITE_URL. */
export function breadcrumbLd(crumbs: Crumb[], siteUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: c.url.startsWith("http") ? c.url : `${siteUrl}${c.url}`,
    })),
  };
}
