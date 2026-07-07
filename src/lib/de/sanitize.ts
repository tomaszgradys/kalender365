// Minimal allowlist HTML sanitizer for AI-generated blog bodies. Regex-based
// (no jsdom — must run in serverless routes). Applied at generation time so the
// stored HTML is already safe. Not a general-purpose sanitizer; it assumes
// non-adversarial input constrained by our prompt, and defends against the
// obvious injection vectors (script/style/event handlers/javascript: URLs).

const ALLOWED_TAGS = new Set(["h2", "h3", "p", "ul", "ol", "li", "a", "strong", "em", "b", "i", "br"]);

export function sanitizeHtml(input: string): string {
  let html = input;
  // Drop entire dangerous elements including content.
  html = html.replace(/<(script|style|iframe|object|embed|noscript)[\s\S]*?<\/\1>/gi, "");
  html = html.replace(/<!--[\s\S]*?-->/g, "");

  // Rebuild every tag through the allowlist.
  html = html.replace(/<\/?([a-zA-Z0-9]+)((?:[^>"']|"[^"]*"|'[^']*')*)>/g, (_m, rawTag: string, attrs: string) => {
    const tag = rawTag.toLowerCase();
    if (!ALLOWED_TAGS.has(tag)) return "";
    const closing = _m.startsWith("</");
    if (closing || tag === "br") return closing ? `</${tag}>` : `<${tag}>`;
    if (tag === "a") {
      const href = /href\s*=\s*("([^"]*)"|'([^']*)')/i.exec(attrs);
      const url = (href?.[2] ?? href?.[3] ?? "").trim();
      // Allow only relative internal links and https URLs; block javascript:, data:, etc.
      const safe = /^\/(?!\/)/.test(url) || /^https:\/\//i.test(url);
      return safe ? `<a href="${url.replace(/"/g, "&quot;")}">` : "<a>";
    }
    return `<${tag}>`; // strip all attributes from other allowed tags
  });

  return html;
}
