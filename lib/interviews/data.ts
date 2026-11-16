import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

export const SCENARIO_CODES = ["S0", "S1", "S2", "S3", "S4"] as const;
export type ScenarioCode = (typeof SCENARIO_CODES)[number];

export const SCENARIO_NAMES: Record<ScenarioCode, string> = {
  S0: "No major impact",
  S1: "Capable but slow",
  S2: "Moderately fast",
  S3: "Fast",
  S4: "Fast AI and fast robots",
};

/** Moods from calmest to most distressed; position + 1 is the 1–5 worry level. */
export const MOODS = ["calm", "uneasy", "anxious", "alarmed", "panicked"] as const;
export type MoodKey = (typeof MOODS)[number];

export interface ScenarioSummary {
  say: string;
  think: string;
  do: string;
  feel: string;
  mood: MoodKey;
}

export interface InterviewCard {
  id: string;
  name: string;
  role: string;
  group: string;
  scenarios: Record<ScenarioCode, ScenarioSummary>;
}

/** Sector headings in the order the population file lists them. */
export const GROUPS = [
  "Agriculture (logging and farm support)",
  "Mining, oil and gas",
  "Utilities",
  "Construction",
  "Manufacturing",
  "Wholesale trade",
  "Retail trade",
  "Transportation and warehousing",
  "Information",
  "Finance and insurance",
  "Real estate",
  "Professional, scientific and technical services",
  "Management of companies",
  "Administrative and support services",
  "Educational services",
  "Health care and social assistance",
  "Arts, entertainment and recreation",
  "Accommodation and food services",
  "Other services",
  "Government",
  "Outside paid work",
];

/** Reads the interview summaries (not the full transcripts) from data/interviews/raw. */
export async function getInterviewCards(): Promise<InterviewCard[]> {
  // Cached: the files only change when the interviews are rerun (then rebuild).
  "use cache";
  const dir = path.join(process.cwd(), "data/interviews/raw");
  const files = (await readdir(dir)).filter((f) => f.endsWith(".json")).sort();
  return Promise.all(
    files.map(async (f) => {
      const d = JSON.parse(await readFile(path.join(dir, f), "utf8"));
      const scenarios = Object.fromEntries(
        SCENARIO_CODES.map((c) => {
          const s = d.scenarios[c];
          return [c, { say: s.say, think: s.think, do: s.do, feel: s.feel, mood: s.mood }];
        }),
      ) as Record<ScenarioCode, ScenarioSummary>;
      return { id: d.id, name: d.name, role: d.role, group: d.group, scenarios };
    }),
  );
}
