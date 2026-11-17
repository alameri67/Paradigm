import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { ShiftHeader } from "@/components/headers/shift-header";
import { Dashboard } from "@/components/dashboard/dashboard";
import { AskAI } from "@/components/ask/ask-ai";
import { archetypes, getGroups, getInterviewSummaries, getJobInsights } from "@/lib/workers/data";
import type { JobNotes } from "@/lib/workers/dashboard";

export const metadata: Metadata = { title: "Paradigm" };

/** Interviews keep arriving while the study runs, so they're read at request time, not baked in at build. */
async function DashboardData() {
  await connection();
  const [people, groups, summaries] = await Promise.all([getInterviewSummaries(), getGroups(), Promise.all(archetypes.map((a) => getJobInsights(a.code)))]);
  // Only the grouped thoughts and named ends travel to the page; the rest stays on the details page.
  const notes: JobNotes = {};
  for (const ins of summaries) {
    if (!ins) continue;
    notes[ins.code] = Object.fromEntries(Object.entries(ins.scenarios).map(([code, x]) => [code, { thoughts: x.thoughts, segments: x.segments }]));
  }
  const versionsPerJob = groups.reduce((n, g) => n * g.levels.length, 1);
  return <Dashboard archetypes={archetypes} groups={groups} notes={notes} people={people} versionsPerJob={versionsPerJob} />;
}

function Loading() {
  return (
    <div className="db-shell">
      <div />
      <main className="db">
        <div className="sk" style={{ height: 40, maxWidth: 520, borderRadius: 999 }} />
        <div className="sk" style={{ height: 96 }} />
        <div className="sk" style={{ height: 520, borderRadius: 28 }} />
      </main>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={<div className="hx-ph" />}>
        <ShiftHeader />
      </Suspense>
      <AskAI />
      <Suspense fallback={<Loading />}>
        <DashboardData />
      </Suspense>
    </>
  );
}
