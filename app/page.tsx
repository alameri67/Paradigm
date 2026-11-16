import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { archetypes, getGroups, getInterviewSummaries } from "@/lib/workers/data";

export const metadata: Metadata = { title: "AI Transition Simulator" };

/** Interviews keep arriving while the study runs, so they're read at request time, not baked in at build. */
async function DashboardData() {
  await connection();
  const [people, groups] = await Promise.all([getInterviewSummaries(), getGroups()]);
  const versionsPerJob = groups.reduce((n, g) => n * g.levels.length, 1);
  return <Dashboard archetypes={archetypes} people={people} versionsPerJob={versionsPerJob} />;
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
    <Suspense fallback={<Loading />}>
      <DashboardData />
    </Suspense>
  );
}
