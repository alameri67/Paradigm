import "server-only";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import archetypesFile from "@/data/archetypes/archetypes-v1.json";
import { MOODS, SCENARIOS, type Archetype, type Group, type Interview, type InterviewSummary, type JobInsights, type MoodKey, type Worker, type WorkerPortrait } from "./types";

const root = process.cwd();
const rawDir = path.join(root, "data/interviews/archetypes/raw");

/** Jobs grouped by industry, in the order the industries were first listed. */
export const archetypes = (() => {
  const list = archetypesFile.archetypes as Archetype[];
  const order = [...new Set(list.map((a) => a.sector))];
  return [...list].sort((a, b) => order.indexOf(a.sector) - order.indexOf(b.sector) || a.code.localeCompare(b.code));
})();

let gridPromise: Promise<{ groups: Group[]; byId: Map<string, Worker> }> | null = null;
/** grid.json is large (all 4,860 versions), so it's read once and kept in memory. */
function grid() {
  gridPromise ??= readFile(path.join(root, "data/archetypes/grid.json"), "utf8").then((s) => {
    const d = JSON.parse(s) as { groups: Group[]; people: Worker[] };
    return { groups: d.groups, byId: new Map(d.people.map((p) => [p.id, p])) };
  });
  return gridPromise;
}

export async function getGroups(): Promise<Group[]> {
  "use cache";
  return (await grid()).groups;
}

/** IDs of every version interviewed so far. Read fresh each time: interviews are still being added. */
export async function listInterviewed(): Promise<string[]> {
  try {
    return (await readdir(rawDir)).filter((f) => f.endsWith(".json")).map((f) => f.slice(0, -5)).sort();
  } catch {
    return [];
  }
}

const exists = (publicPath: string) =>
  access(path.join(root, "public", publicPath)).then(
    () => true,
    () => false,
  );

/** The job's portrait if it shows the worker's gender, otherwise the other-gender portrait once it exists. */
async function portraitFor(worker: Worker): Promise<WorkerPortrait | null> {
  const a = archetypes.find((x) => x.code === worker.archetype);
  if (!a?.portraitUrl || !a.cutoutUrl) return null;
  if (a.portraitGender === worker.gender) return { url: a.portraitUrl, cutout: a.cutoutUrl };
  const base = a.portraitUrl.replace(/\.jpg$/, `-${worker.gender.toLowerCase()}`);
  const alt = { url: `${base}.jpg`, cutout: `${base}-cutout.png` };
  return (await exists(alt.url)) && (await exists(alt.cutout)) ? alt : null;
}

export async function getWorker(
  id: string,
): Promise<{ worker: Worker; interview: Interview | null; portrait: WorkerPortrait | null } | null> {
  if (!/^[AGRNU]\d{2}-[1-3]{5}$/.test(id)) return null;
  const worker = (await grid()).byId.get(id);
  if (!worker) return null;
  let interview: Interview | null = null;
  try {
    interview = JSON.parse(await readFile(path.join(rawDir, `${id}.json`), "utf8"));
  } catch {
    interview = null;
  }
  return { worker, interview, portrait: await portraitFor(worker) };
}

/** Job-level patterns for one job, once the insights step has run for it. */
export async function getJobInsights(code: string): Promise<JobInsights | null> {
  if (!/^[AGRNU]\d{2}$/.test(code)) return null;
  try {
    const dir = path.join(root, "data/insights");
    const [insights, stats] = await Promise.all([
      readFile(path.join(dir, `${code}.json`), "utf8"),
      readFile(path.join(dir, `${code}-stats.json`), "utf8"),
    ]);
    return { ...JSON.parse(insights), stats: JSON.parse(stats) };
  } catch {
    return null;
  }
}

/**
 * A short summary of every protocol v3 interview, for the dashboard. Read fresh each time, like
 * listInterviewed: files keep arriving while the study runs. Files from older protocols are skipped.
 */
export async function getInterviewSummaries(): Promise<InterviewSummary[]> {
  const ids = (await listInterviewed()).filter((id) => /^[AGRNU]\d{2}-[1-3]{5}$/.test(id));
  const { byId } = await grid();
  const read = async (id: string): Promise<InterviewSummary | null> => {
    try {
      const d = JSON.parse(await readFile(path.join(rawDir, `${id}.json`), "utf8"));
      // 3.0 files stay visible until the re-pass replaces them with 3.1.
      if (!["3.0", "3.1", "3.2"].includes(d.protocolVersion) || !d.scenarios) return null;
      const scenarios = {} as InterviewSummary["scenarios"];
      for (const s of SCENARIOS) {
        const r = d.scenarios[s.code];
        if (!r || !MOODS.includes(r.mood)) return null;
        scenarios[s.code] = {
          mood: r.mood as MoodKey,
          quote: typeof r.quote === "string" ? r.quote : "",
          actions: Array.isArray(r.actions) ? r.actions.filter((a: unknown) => typeof a === "string") : [],
        };
      }
      return { id, archetype: id.slice(0, 3), job: String(d.job ?? ""), name: String(d.name ?? id), gender: byId.get(id)?.gender, scenarios };
    } catch {
      // A file that is still being written, or isn't valid JSON yet.
      return null;
    }
  };
  return (await Promise.all(ids.map(read))).filter((x): x is InterviewSummary => x !== null);
}
