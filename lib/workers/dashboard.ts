/** The numbers behind the summary dashboard. Pure functions, safe on client and server. */
import { MOODS, type Group, type InterviewSummary, type MoodKey, type ScenarioCode } from "./types";

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

/** How strongly someone acts, in words, from 1 (no action) to 5 (drastic action). */
export const ACTION_LEVELS = ["No action", "Small steps", "Some action", "Strong action", "Drastic action"] as const;

/**
 * How strongly someone acts, 1–5, from their biggest step:
 * 1 no change, 2 only small steps, 3 a real plan, 4 one big change, 5 two or more big changes.
 */
export function actionLevel(tags: readonly string[]): number {
  const w = tags.map((t) => ACTION_WEIGHT[t] ?? 0);
  const big = w.filter((x) => x >= 3).length;
  if (big >= 2) return 5;
  if (big === 1) return 4;
  return Math.max(0, ...w) + 1;
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

/** Jitter sizes. Both stay well inside ±0.5 so a point never drifts to the next level. */
export const JITTER_X = 0.22;
export const JITTER_Y = 0.22;

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
    const y = actionLevel(s.actions ?? []) + (r() * 2 - 1) * JITTER_Y;
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

/* ---------- Least vs most worried: what separates the two ends of a selection ---------- */

/** How a level reads in a sentence about a group of people: "23 of 24 adapt easily". */
export const LEVEL_PHRASE: Record<string, Record<string, string>> = {
  lifeStage: { early: "are early in their working life", mid: "are in mid-life, often with kids and a mortgage", late: "are close to retirement" },
  standing: { low: "are junior in their job", mid: "are mid-level in their job", high: "are senior in their job" },
  cushion: { thin: "have thin savings", moderate: "have some savings", strong: "have strong savings" },
  outlook: { progressive: "lean progressive", centre: "sit in the political centre", traditional: "lean traditional" },
  adaptability: { resistant: "resist change", steady: "take change steadily", adaptive: "adapt easily" },
};
/** The same, for "people who …" in the headline. */
export const WHO_PHRASE: Record<string, Record<string, string>> = {
  lifeStage: { early: "early in their working life", mid: "in mid-life", late: "close to retirement" },
  standing: { low: "in junior roles", mid: "in mid-level roles", high: "in senior roles" },
  cushion: { thin: "with thin savings", moderate: "with some savings", strong: "with strong savings" },
  outlook: { progressive: "who lean progressive", centre: "in the political centre", traditional: "who lean traditional" },
  adaptability: { resistant: "who resist change", steady: "who take change steadily", adaptive: "who adapt easily" },
};
/** What a group will do, as the end of "19 of 24 …". */
export const ACTION_PHRASE: Record<string, string> = {
  "keep-going": "will carry on as normal",
  "cut-spending": "will cut back on spending",
  "save-more": "will save more or pay down debt",
  retrain: "will retrain or learn a new trade",
  "learn-ai": "will learn to use AI tools at work",
  "change-job": "will look for a different job",
  "side-income": "will start a side income",
  invest: "will invest money",
  automate: "will bring in AI or robots themselves",
  "sell-or-exit": "will sell up or leave the job",
  "retire-early": "will retire early",
  "collective-action": "will join a union or group action",
  politics: "will lobby, vote or campaign",
  "seek-support": "will lean on government, family or community",
  move: "will move home or region",
  "family-plans": "will change their family plans",
  "wait-and-see": "will wait and see",
};

/** The level digit of group i in an ID like A03-12323. */
const levelIdx = (id: string, i: number) => Number(id.split("-")[1]?.[i] ?? 0) - 1;
/** A quote that makes sense on its own: no opening word that points back to something unseen. */
const standsAlone = (q: string) => !!q && !/^(and|but|so|yeah|well|it|it's|that|that's|this|these|those|they|they're|them|he|he's|she|she's|him|her|then)\b/i.test(q.trim());

export interface Segment {
  /** The moods included, calmest first. */
  moods: MoodKey[];
  n: number;
  /** Traits most of this end share, as sentences: "23 of 24 adapt easily." */
  traits: string[];
  /** Groups where this end is mixed, by name: ["Life stage", "Work standing"]. */
  mixed: string[];
  /** The most common actions, as sentences: "19 of 24 will invest money." */
  actions: { tag: string; count: number; text: string }[];
  quote: { id: string; name: string; job: string; text: string } | null;
  /** The shared traits as counts, most shared first: { group: "adaptability", level: "adaptive", count: 23 }. */
  top: { group: string; level: string; count: number }[];
  /** How many in this end sit at each level of each group. */
  levels: Record<string, Record<string, number>>;
  /** How many in this end take each action. */
  acts: Record<string, number>;
}
export interface Contrast {
  n: number;
  low: Segment;
  high: Segment;
  /** What moves worry most, as one sentence, or null when nothing stands out. */
  headline: string | null;
  /** Each group's worry gap, largest first. */
  drivers: { key: string; label: string; gap: number; from: number; to: number }[];
}

/** Takes the calmest (or most worried) mood present, and the next one too when fewer than 5 people are there. */
function endOf(people: readonly InterviewSummary[], code: ScenarioCode, dir: 1 | -1): { group: InterviewSummary[]; moods: MoodKey[] } {
  const order = dir === 1 ? [...MOODS] : [...MOODS].reverse();
  // Only reach into the next mood when the extreme holds too few people to say anything about.
  const min = 5;
  const group: InterviewSummary[] = [];
  const moods: MoodKey[] = [];
  for (const m of order) {
    const at = people.filter((p) => p.scenarios[code].mood === m);
    if (!at.length) continue;
    group.push(...at);
    moods.push(m);
    if (group.length >= min) break;
  }
  return { group, moods: dir === 1 ? moods : moods.reverse() };
}

function segment(group: InterviewSummary[], moods: MoodKey[], code: ScenarioCode, groups: readonly Group[]): Segment {
  const n = group.length;
  const traits: string[] = [];
  const mixed: string[] = [];
  const tops: Segment["top"] = [];
  const levels: Segment["levels"] = {};
  const dominant: number[] = [];
  groups.forEach((g, i) => {
    const counts = g.levels.map((_, li) => group.filter((p) => levelIdx(p.id, i) === li).length);
    const top = counts.indexOf(Math.max(...counts));
    levels[g.key] = Object.fromEntries(g.levels.map((l, li) => [l.key, counts[li]]));
    if (n && counts[top] / n >= 0.6) tops.push({ group: g.key, level: g.levels[top].key, count: counts[top] });
    dominant.push(counts[top] / n >= 0.6 ? top : -1);
    if (n && counts[top] / n >= 0.6) traits.push(`${counts[top] === n ? `All ${n}` : `${counts[top]} of ${n}`} ${LEVEL_PHRASE[g.key]?.[g.levels[top].key] ?? g.levels[top].label.toLowerCase()}.`);
    else mixed.push(g.label);
  });
  const acts = new Map<string, number>();
  for (const p of group) for (const t of new Set(p.scenarios[code].actions)) acts.set(t, (acts.get(t) ?? 0) + 1);
  const actions = [...acts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([tag, count]) => ({ tag, count, text: `${count === n ? `All ${n}` : `${count} of ${n}`} ${ACTION_PHRASE[tag] ?? tag.replace(/-/g, " ")}.` }));
  // The quote comes from the person who shares the most of this end's main traits, so it speaks for the group.
  const typical = (p: InterviewSummary) => dominant.reduce((k, d, i) => k + (d >= 0 && levelIdx(p.id, i) === d ? 1 : 0), 0);
  const pick = [...group].filter((p) => standsAlone(p.scenarios[code].quote)).sort((a, b) => typical(b) - typical(a) || a.id.localeCompare(b.id))[0];
  return {
    moods,
    n,
    traits,
    mixed,
    actions,
    quote: pick ? { id: pick.id, name: pick.name, job: pick.job, text: pick.scenarios[code].quote } : null,
    top: tops.sort((a, b) => b.count - a.count),
    levels,
    acts: Object.fromEntries(acts),
  };
}

/** What separates the least and the most worried people in a selection, counted from the selection itself. */
export function contrast(people: readonly InterviewSummary[], code: ScenarioCode, groups: readonly Group[]): Contrast | null {
  if (people.length < 6) return null;
  const low = endOf(people, code, 1);
  const high = endOf(people, code, -1);
  if (!low.group.length || !high.group.length || low.moods.some((m) => high.moods.includes(m))) return null;
  const drivers = groups
    .map((g, i) => {
      const avg = g.levels.map((_, li) => {
        const at = people.filter((p) => levelIdx(p.id, i) === li);
        return at.length ? at.reduce((s, p) => s + worryOf(p.scenarios[code].mood), 0) / at.length : NaN;
      });
      const valid = avg.map((v, li) => ({ v, li })).filter((x) => !Number.isNaN(x.v));
      const hi = valid.reduce((a, b) => (b.v > a.v ? b : a), valid[0]);
      const lo = valid.reduce((a, b) => (b.v < a.v ? b : a), valid[0]);
      return { key: g.key, label: g.label, gap: hi.v - lo.v, from: hi.v, to: lo.v, hiKey: g.levels[hi.li].key, loKey: g.levels[lo.li].key };
    })
    .sort((a, b) => b.gap - a.gap);
  const [first, second] = drivers;
  let headline: string | null = null;
  if (first && first.gap >= 0.3) {
    headline = `${first.label} matters most here: people ${WHO_PHRASE[first.key]?.[first.hiKey] ?? first.hiKey} worry ${first.from.toFixed(1)} out of 5, against ${first.to.toFixed(1)} for people ${WHO_PHRASE[first.key]?.[first.loKey] ?? first.loKey}.`;
    if (second && second.gap >= 0.3) headline += ` ${second.label} comes next.`;
    const quiet = drivers.filter((d) => d.gap < 0.3).map((d) => d.label.toLowerCase());
    if (quiet.length) headline += ` ${quiet.length === 1 ? quiet[0][0].toUpperCase() + quiet[0].slice(1) + " barely changes" : listOf(quiet) + " barely change"} how worried people are.`;
  }
  return {
    n: people.length,
    low: segment(low.group, low.moods, code, groups),
    high: segment(high.group, high.moods, code, groups),
    headline,
    drivers: drivers.map(({ key, label, gap, from, to }) => ({ key, label, gap, from, to })),
  };
}

function listOf(xs: string[]) {
  const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
  return xs.length < 2 ? cap(xs[0]) : `${cap(xs.slice(0, -1).join(", "))} and ${xs[xs.length - 1]}`;
}

/* ---------- What they think, and the named ends, from each job's written summary ---------- */

/** Per job and scenario: the grouped thoughts and the named ends, from data/insights. */
export type JobNotes = Record<string, Partial<Record<ScenarioCode, { thoughts?: { text: string; ids: string[] }[]; segments?: { least: { name: string; story: string }; most: { name: string; story: string } } }>>>;

export interface ThoughtCount {
  text: string;
  job: string;
  count: number;
  /** Selected people in this job whose thoughts were grouped, so the count has a fair "out of". */
  of: number;
}

/** The thoughts that come up most among the selected people, counted from each job's grouping. */
export function thoughtsFor(people: readonly InterviewSummary[], code: ScenarioCode, notes: JobNotes, max = 5): ThoughtCount[] {
  const chosen = new Set(people.map((p) => p.id));
  const jobs = new Map(people.map((p) => [p.archetype, p.job]));
  const out: ThoughtCount[] = [];
  for (const [job, name] of jobs) {
    const list = notes[job]?.[code]?.thoughts ?? [];
    const grouped = new Set(list.flatMap((t) => t.ids).filter((id) => chosen.has(id)));
    for (const t of list) {
      const count = t.ids.filter((id) => chosen.has(id)).length;
      if (count) out.push({ text: t.text, job: name, count, of: grouped.size });
    }
  }
  return out.sort((a, b) => b.count / b.of - a.count / a.of || b.count - a.count).slice(0, max);
}
