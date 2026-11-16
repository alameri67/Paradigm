import type { Metadata } from "next";
import { Suspense } from "react";
import { DitheredBand } from "@/components/ui/dithered-band";
import { WorkerStudio } from "@/components/workers/worker-studio";
import { archetypes, getGroups } from "@/lib/workers/data";

export const metadata: Metadata = { title: "Details · Paradigm" };

/** One person at a time: pick a job and the five groups, then read their interview. */
export default async function DetailsPage() {
  const groups = await getGroups();
  return (
    <>
      <DitheredBand />
      <Suspense>
        <WorkerStudio archetypes={archetypes} groups={groups} />
      </Suspense>
    </>
  );
}
