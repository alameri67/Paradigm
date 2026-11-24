/** Shared types for the archetype ("worker") study. Safe to import on client and server. */

/** A list of short bullets, or prose from older files. */
export type Points = string | readonly string[];

/** The five scenarios in dial order, mildest to most extreme (AGI by 2028 is last). The code is for data only; the screen always shows the name. */
export const SCENARIOS = [
  { code: "S0", name: "AI Plateau", when: "No radical change", description: "AI turns out to be mostly hype. It automates some routine tasks, but jobs, pay and prices carry on much as before." },
  { code: "S1", name: "Steady Disruption", when: "Strong, not radical", description: "AI takes over many thinking tasks in many jobs, like writing, checking, buying and answering customers. Robots reach hands-on work more slowly. Some jobs shrink and new ones appear, but most people still have work and there's some time to adjust." },
  { code: "S4", name: "AGI by 2036", when: "In 10 years", description: "Full AGI arrives within 10 years: AI that can do almost any thinking work a person can. Robots for hands-on work come about 3 years later. The same end point, with about a decade to prepare." },
  { code: "S3", name: "AGI by 2031", when: "In 5 years", description: "Full AGI arrives within 5 years: AI that can do almost any thinking work a person can. Robots for hands-on work come about 3 years later. A few years to see it coming." },
  { code: "S2", name: "AGI by 2028", when: "In 2 years", description: "The singularity hits fast. Within 2 years, AI can do almost any thinking work a person can. Robots for hands-on work come about 3 years later, around 2031." },
] as const;
export type ScenarioCode = (typeof SCENARIOS)[number]["code"];

export const MOODS = ["calm", "uneasy", "anxious", "alarmed", "panicked"] as const;
export type MoodKey = (typeof MOODS)[number];
export const MOOD_LABEL: Record<MoodKey, string> = { calm: "Calm", uneasy: "Uneasy", anxious: "Anxious", alarmed: "Alarmed", panicked: "Panicked" };
export const MOOD_TONE: Record<MoodKey, "success" | "warning" | "destructive"> = {
  calm: "success", uneasy: "warning", anxious: "warning", alarmed: "destructive", panicked: "destructive",
};
/** Glow colour for the Peak Chart card, from calm green to panicked red. */
export const MOOD_ACCENT: Record<MoodKey, string> = {
  calm: "#2ec99a", uneasy: "#c9b02e", anxious: "#e08a2e", alarmed: "#e0532e", panicked: "#e02e4a",
};

export interface Archetype {
  code: string;
  sector: string;
  job: string;
  setting: string;
  exposure: { ai: string; robots: string };
  education: string[];
  portraitUrl: string | null;
  /** Portrait with the background removed, drawn inside the worker card. */
  cutoutUrl: string | null;
  /** Gender of the person in portraitUrl. The other gender's portrait is <name>-m.jpg or <name>-f.jpg. */
  portraitGender: "F" | "M";
  /** Plural for headings, e.g. "family doctors". */
  plural: string;
  /** Jobs are the default. Fresh graduates, retirees and people not in paid work are cohorts with their own trait groups. */
  kind?: "graduates" | "students" | "retirees" | "not-working";
  /** The cohort's own trait groups; jobs use the shared five. Outlook and adaptability are always 4th and 5th. */
  groups?: Group[];
  /** Panel fact labels for a cohort, e.g. "Degree" in place of "Education". */
  factLabels?: { education?: string; exposure?: string };
}

/** The portrait that matches one worker's gender, if it exists yet. */
export interface WorkerPortrait { url: string; cutout: string }

export interface GroupLevel { key: string; label: string; [detail: string]: string | number }
export interface Group {
  key: string;
  label: string;
  levels: GroupLevel[];
  /** Position of this group in the ID digits, when a list holds only some of them (a mixed selection shares just outlook and adaptability). */
  at?: number;
}

export interface WorkerProfile {
  age: number; household: string; seniority: string; skill: string; education: string;
  savings: string; income: string; localJobs: string; views: string; adaptability: string;
  aiExposure: string; setting: string;
}
export interface Worker {
  id: string; archetype: string; sector: string; job: string; name: string; gender: string;
  levels: Record<string, string>; profile: WorkerProfile;
}

export interface Turn { speaker: "interviewer" | "persona"; text: string }
export interface ScenarioResult {
  /** Bullets (newer interviews) or prose (older ones). "**words**" marks key words to show in bold. */
  say: Points; think: Points; do: Points; feel: Points; mood: MoodKey; quote: string; fieldNote: Points; transcript: Turn[];
  actions?: string[];
}

/** Plain names for the action tags in protocol v3. */
export const ACTION_LABEL: Record<string, string> = {
  "keep-going": "Carry on as normal",
  "cut-spending": "Cut back on spending",
  "save-more": "Save more or pay down debt",
  retrain: "Retrain or learn a new trade",
  "learn-ai": "Learn to use AI tools at work",
  "change-job": "Look for a different job",
  "side-income": "Start a side income",
  invest: "Invest money",
  automate: "Bring in AI or robots themselves",
  "sell-or-exit": "Sell up or leave the job",
  "retire-early": "Retire early",
  "collective-action": "Join a union or group action",
  politics: "Lobby, vote or campaign",
  "seek-support": "Lean on government, family or community",
  move: "Move home or region",
  "family-plans": "Change family plans",
  "wait-and-see": "Wait and see",
};

/** Job-level patterns: counts from scripts/summarize-job.mjs plus the written insights. */
export interface JobStatsScenario {
  n: number;
  avgWorry: number;
  moodMix: Record<MoodKey, number>;
  actions: { tag: string; count: number; share: number }[];
}
export interface JobInsightsScenario {
  headline: string;
  whatTheyDo: { tag: string; text: string }[];
  whatTheySay: Points;
  whatTheyThink: Points;
  howTheyFeel: Points;
  differences: { group: string; text: string }[];
  quotes: { id: string; name: string; text: string }[];
  /** 3.1: the thoughts that come up most, each with the people who hold it, so any selection can be counted. */
  thoughts?: { text: string; ids: string[] }[];
  /** 3.1: a name and one-line story for the calmest and the most worried ends of this job. */
  segments?: { least: { name: string; story: string }; most: { name: string; story: string } };
}
export interface JobInsights {
  code: string;
  job: string;
  interviews: number;
  overview: Points;
  scenarios: Record<ScenarioCode, JobInsightsScenario>;
  stats: { interviews: number; scenarios: Record<ScenarioCode, JobStatsScenario> };
}
export interface Interview {
  id: string;
  opening: Turn[];
  closing: Turn[];
  scenarios: Record<ScenarioCode, ScenarioResult>;
  headlineQuote: string; portrait: Points; biggestWorry: Points; whatWouldHelp: Points;
}

/** Version id from a job code and the 5 level positions (1–3), e.g. A16-22222. */
export const workerId = (code: string, groups: Group[], levels: Record<string, string>) =>
  `${code}-${groups.map((g) => g.levels.findIndex((l) => l.key === levels[g.key]) + 1).join("")}`;

/** The parts of one interview the summary dashboard needs, per scenario. */
export interface InterviewSummary {
  id: string;
  archetype: string;
  job: string;
  name: string;
  /** "F" or "M", from the person's profile, so the right portrait shows. */
  gender?: string;
  scenarios: Record<ScenarioCode, { mood: MoodKey; quote: string; actions: string[] }>;
}
