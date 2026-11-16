import "server-only";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import archetypesFile from "@/data/archetypes/archetypes-v1.json";
import type { Archetype, Group, Interview, Worker } from "./types";

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

export async function getWorker(id: string): Promise<{ worker: Worker; interview: Interview | null } | null> {
  if (!/^A\d{2}-[1-3]{5}$/.test(id)) return null;
  const worker = (await grid()).byId.get(id);
  if (!worker) return null;
  let interview: Interview | null = null;
  try {
    interview = JSON.parse(await readFile(path.join(rawDir, `${id}.json`), "utf8"));
  } catch {
    interview = null;
  }
  return { worker, interview };
}
