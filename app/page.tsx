import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { Dashboard } from "@/components/dashboard/dashboard";
import { archetypes, getInterviewSummaries } from "@/lib/workers/data";

export const metadata: Metadata = { title: "AI Transition Simulator" };

/** Interviews keep arriving while the study runs, so they're read at request time, not baked in at build. */
async function DashboardData() {
  await connection();
  const people = await getInterviewSummaries();
  return <Dashboard archetypes={archetypes} people={people} />;
}

function Loading() {
  return (
    <>
      <div className="sk" style={{ height: 40, maxWidth: 520, borderRadius: 999 }} />
      <div className="sk" style={{ height: 96 }} />
      <div className="sk" style={{ height: 520, borderRadius: 28, background: "#0b1a2e" }} />
    </>
  );
}

export default function Home() {
  return (
    <main className="db">
      <header className="db-head">
        <h1 className="t-display">Everyone interviewed, at a glance</h1>
        <p className="prose fg2">
          See how worried people feel and what they do about it. Pick the jobs and a scenario, then drag across the chart to
          look more closely at a group.
        </p>
      </header>
      <Suspense fallback={<Loading />}>
        <DashboardData />
      </Suspense>
    </main>
  );
}
