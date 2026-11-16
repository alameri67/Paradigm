/** Shared types for the archetype ("worker") study. Safe to import on client and server. */

export const SCENARIOS = [
  { code: "S0", name: "No major impact", short: "No change", description: "AI stays a handy tool. Hiring, pay and prices carry on as they would anyway." },
  { code: "S1", name: "Capable but slow", short: "Slow", description: "Strong AI spreads over 10+ years. Some tasks vanish, few whole jobs do." },
  { code: "S2", name: "Moderately fast", short: "5 years", description: "AI handles most routine office work within 5 years. Office layoffs begin." },
  { code: "S3", name: "Fast", short: "2–3 years", description: "AI matches skilled professionals within 2 to 3 years. Physical jobs mostly untouched." },
  { code: "S4", name: "Fast AI and fast robots", short: "+ robots", description: "Everything in S3, plus general-purpose robots in hands-on jobs within 3 to 5 years." },
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
}

export interface GroupLevel { key: string; label: string; [detail: string]: string }
export interface Group { key: string; label: string; levels: GroupLevel[] }

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
  say: string; think: string; do: string; feel: string; mood: MoodKey; quote: string; fieldNote: string; transcript: Turn[];
}
export interface Interview {
  id: string;
  opening: Turn[];
  closing: Turn[];
  scenarios: Record<ScenarioCode, ScenarioResult>;
  headlineQuote: string; portrait: string; biggestWorry: string; whatWouldHelp: string;
}

/** Version id from a job code and the 5 level positions (1–3), e.g. A16-22222. */
export const workerId = (code: string, groups: Group[], levels: Record<string, string>) =>
  `${code}-${groups.map((g) => g.levels.findIndex((l) => l.key === levels[g.key]) + 1).join("")}`;
