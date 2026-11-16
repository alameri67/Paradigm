/** The numbers behind the summary dashboard. Pure functions, safe on client and server. */
import { MOODS, type InterviewSummary, type MoodKey, type ScenarioCode } from "./types";

/**
 * How big a step each action is. 0: no change. 1: small, careful steps. 2: a real plan.
 * 3: a big change to work or life. Unknown tags count as 0.
 */
export const ACTION_WEIGHT: Record<string, number> = {
  "wait-and-see": 0,
  "keep-going": 0,
  "seek-support": 1,
  "cut-spending": 1,
  "save-more": 1,
  "learn-ai": 2,
  invest: 2,
  politics: 2,
  "collective-action": 2,
  "family-plans": 2,
  "retire-early": 2,
  retrain: 3,
  "change-job": 3,
  "side-income": 3,
  automate: 3,
  move: 3,
  "sell-or-exit": 3,
};

/** The weighted sum that fills the scale: about three big moves. Anything above is capped at 100. */
export const ACTION_FULL = 9;

/** How strongly someone acts, 0–100. */
export function actionScore(tags: readonly string[]): number {
  const sum = tags.reduce((s, t) => s + (ACTION_WEIGHT[t] ?? 0), 0);
  return Math.min(100, (sum / ACTION_FULL) * 100);
}

/** Worry from mood: 1 calm … 5 panicked. */
export const worryOf = (mood: MoodKey) => MOODS.indexOf(mood) + 1;

/** A stable 32-bit seed from a string (FNV-1a). */
export function seedOf(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** Small seeded random number generator (mulberry32), 0 ≤ r < 1. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Jitter sizes. X stays well inside ±0.5 so a point never drifts to the next mood. */
export const JITTER_X = 0.22;
export const JITTER_Y = 3;

export interface DashPoint {
  id: string;
  x: number;
  y: number;
  label: string;
  person: InterviewSummary;
}

/** One point per person for a scenario: x = worry, y = how strongly they act, each with a little jitter. */
export function pointsFor(people: readonly InterviewSummary[], code: ScenarioCode): DashPoint[] {
  return people.map((p) => {
    const r = seeded(seedOf(p.id));
    const s = p.scenarios[code];
    const x = worryOf(s.mood) + (r() * 2 - 1) * JITTER_X;
    const y = Math.max(0, Math.min(100, actionScore(s.actions) + (r() * 2 - 1) * JITTER_Y));
    return { id: p.id, x, y, label: `${p.name}, ${p.job.toLowerCase()}`, person: p };
  });
}

export interface Summary {
  n: number;
  actions: { tag: string; count: number; share: number }[];
  moods: Record<MoodKey, number>;
  jobs: { code: string; job: string; count: number; share: number }[];
  quotes: { id: string; name: string; job: string; text: string }[];
}

/** What a group of people do and feel in one scenario. */
export function summarize(people: readonly InterviewSummary[], code: ScenarioCode, maxQuotes = 2): Summary {
  const n = people.length;
  const acts = new Map<string, number>();
  const moods = Object.fromEntries(MOODS.map((m) => [m, 0])) as Record<MoodKey, number>;
  const jobs = new Map<string, { job: string; count: number }>();
  for (const p of people) {
    const s = p.scenarios[code];
    for (const t of new Set(s.actions)) acts.set(t, (acts.get(t) ?? 0) + 1);
    moods[s.mood]++;
    const j = jobs.get(p.archetype) ?? { job: p.job, count: 0 };
    j.count++;
    jobs.set(p.archetype, j);
  }
  const share = (c: number) => (n ? c / n : 0);

  // Quotes: a stable shuffle per scenario, taking different jobs first when there are several.
  const order = [...people]
    .filter((p) => p.scenarios[code].quote.trim())
    .sort((a, b) => seedOf(a.id + code) - seedOf(b.id + code));
  const picked: InterviewSummary[] = [];
  for (const p of order) {
    if (picked.length >= maxQuotes) break;
    if (!picked.some((q) => q.archetype === p.archetype)) picked.push(p);
  }
  for (const p of order) {
    if (picked.length >= maxQuotes) break;
    if (!picked.includes(p)) picked.push(p);
  }

  return {
    n,
    actions: [...acts]
      .map(([tag, count]) => ({ tag, count, share: share(count) }))
      .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag)),
    moods,
    jobs: [...jobs]
      .map(([c, j]) => ({ code: c, job: j.job, count: j.count, share: share(j.count) }))
      .sort((a, b) => b.count - a.count || a.code.localeCompare(b.code)),
    quotes: picked.map((p) => ({ id: p.id, name: p.name, job: p.job, text: p.scenarios[code].quote })),
  };
}
