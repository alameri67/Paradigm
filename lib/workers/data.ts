import "server-only";
import { access, readdir, readFile } from "node:fs/promises";
import path from "node:path";
import archetypesFile from "@/data/archetypes/archetypes-v1.json";
import type { Archetype, Group, Interview, Worker, WorkerPortrait } from "./types";

const root = process.cwd();
const rawDir = path.join(root, "data/interviews/archetypes/raw");

export const archetypes = archetypesFile.archetypes as Archetype[];

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
  if (!/^A\d{2}-[1-3]{5}$/.test(id)) return null;
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
