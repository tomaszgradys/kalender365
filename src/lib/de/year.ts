// Shared year helpers for programmatic routes.

export const NAV_MIN = 2015; // indexed / internally-linked window
export const NAV_MAX = 2035;

export const NAV_YEARS = Array.from({ length: NAV_MAX - NAV_MIN + 1 }, (_, i) => NAV_MIN + i);

export function parseYear(raw: string): number | null {
  if (!/^\d{4}$/.test(raw)) return null;
  const y = Number(raw);
  return y >= 1900 && y <= 2100 ? y : null;
}

export const isNavigableYear = (y: number) => y >= NAV_MIN && y <= NAV_MAX;

/** robots meta for programmatic year pages: noindex outside the window. */
export function yearRobots(y: number) {
  return isNavigableYear(y) ? {} : { robots: { index: false, follow: true } };
}
