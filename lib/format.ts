/**
 * Percentages for people to read. A share is rounded to a whole percent, except near the ends:
 * a small share that isn't zero never shows as 0% (12 of 3,718 is 0.3%, and anything under 0.1% is
 * "<0.1%"), and a share that isn't everyone never shows as 100% (3,706 of 3,718 is 99.6%). Near the
 * ends the decimal is rounded towards the middle, so it never claims more or less than is true.
 * Safe to import on client and server.
 */

export interface PercentParts {
  /** The number to show, already rounded. */
  value: number;
  /** Digits after the point: 0, or 1 near the ends. */
  decimals: number;
  /** "<" or ">" when the share is beyond what one decimal can show, else "". */
  prefix: string;
}

/** A share from 0 to 1 as the parts of a percentage. */
export function percentParts(share: number): PercentParts {
  const p = Number.isFinite(share) ? share * 100 : 0;
  if (p <= 0) return { value: 0, decimals: 0, prefix: "" };
  if (p >= 100) return { value: 100, decimals: 0, prefix: "" };
  if (p < 0.1) return { value: 0.1, decimals: 1, prefix: "<" };
  if (p < 1) return { value: Math.floor(p * 10) / 10, decimals: 1, prefix: "" };
  if (p > 99.9) return { value: 99.9, decimals: 1, prefix: ">" };
  if (p > 99) return { value: Math.floor(p * 10) / 10, decimals: 1, prefix: "" };
  return { value: Math.round(p), decimals: 0, prefix: "" };
}

/** A share from 0 to 1 as text: "12%", "0.3%", "<0.1%", "99.6%". */
export function percent(share: number): string {
  const { value, decimals, prefix } = percentParts(share);
  return `${prefix}${value.toFixed(decimals)}%`;
}

/** k out of n as text, and 0% when there's no one to count. */
export function percentOf(k: number, n: number): string {
  return percent(n ? k / n : 0);
}
