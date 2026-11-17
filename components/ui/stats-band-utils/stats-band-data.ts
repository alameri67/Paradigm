/** One headline number in a StatsBand. */
export interface Stat {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  notation?: "standard" | "compact";
  /** The note shown under the number. */
  detail?: string;
  /** One line of context that replaces the detail on hover or focus. */
  context?: string;
  visual?: StatVisual;
}

export type StatVisual =
  | { kind: "trend"; values: number[] }
  | { kind: "uptime"; days: number[] }
  | { kind: "distribution"; bins: number[]; max: number; marker: number }
  | { kind: "map"; points: [number, number][] }
  // Paradigm: a row of ticks, one per person, inked for the ones counted.
  | { kind: "share"; count: number; of: number };

/** Example stats for the demo. */
export const stats: Stat[] = [
  { label: "Median response", value: 42, suffix: " ms", detail: "Across every region", context: "Down from 61 ms a year ago", visual: { kind: "trend", values: [61, 58, 55, 52, 50, 47, 45, 42] } },
  { label: "Uptime", value: 99.98, suffix: "%", decimals: 2, detail: "Last 30 days", context: "One short incident, 9 minutes", visual: { kind: "uptime", days: Array.from({ length: 30 }, (_, i) => (i === 17 ? 99.4 : 100)) } },
  { label: "Requests served", value: 2_300_000_000, notation: "compact", decimals: 1, detail: "Per month", context: "Peak of 14k a second", visual: { kind: "distribution", bins: [2, 5, 9, 14, 12, 8, 5, 3, 2, 1], max: 100, marker: 40 } },
  { label: "Regions", value: 18, detail: "On five continents", context: "Two more by spring", visual: { kind: "map", points: [[-74, 40.7], [-0.1, 51.5], [139.7, 35.7], [151.2, -33.9], [-46.6, -23.5], [77.2, 28.6], [55.3, 25.3]] } },
];
