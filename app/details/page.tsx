import type { Metadata } from "next";
import { Suspense } from "react";
import { ShiftHeader } from "@/components/headers/shift-header";
import { WorkerStudio } from "@/components/workers/worker-studio";
import { AskAI } from "@/components/ask/ask-ai";
import { archetypes, getGroups } from "@/lib/workers/data";

export const metadata: Metadata = { title: "Details · Paradigm" };

/** One person at a time: pick a job and the five groups, then read their interview. */
export default async function DetailsPage() {
  const groups = await getGroups();
  return (
    <>
      <Suspense fallback={<div className="hx-ph" />}>
        <ShiftHeader />
      </Suspense>
      <AskAI />
      <Suspense>
        <WorkerStudio archetypes={archetypes} groups={groups} />
      </Suspense>
    </>
  );
}
