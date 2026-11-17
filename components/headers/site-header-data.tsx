import { connection } from "next/server";
import { getInterviewSummaries } from "@/lib/workers/data";
import { MOODS, SCENARIOS } from "@/lib/workers/types";
import { SiteHeader, type MoodCounts } from "./site-header";

/** Reads the interviews at request time so the mood strip and masthead numbers stay current. */
export async function SiteHeaderData() {
  await connection();
  const people = await getInterviewSummaries();
  const counts = Object.fromEntries(
    SCENARIOS.map((s) => [s.code, MOODS.map((m) => people.filter((p) => p.scenarios[s.code].mood === m).length)]),
  ) as MoodCounts;
  const jobs = new Set(people.map((p) => p.archetype)).size;
  return <SiteHeader counts={counts} total={people.length} jobs={jobs} />;
}
