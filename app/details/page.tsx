import type { Metadata } from "next";
import { SiteHeaderData } from "@/components/headers/site-header-data";
import { Suspense } from "react";
import { WorkerStudio } from "@/components/workers/worker-studio";
import { archetypes, getGroups } from "@/lib/workers/data";

export const metadata: Metadata = { title: "Details · Paradigm" };

/** One person at a time: pick a job and the five groups, then read their interview. */
export default async function DetailsPage() {
  const groups = await getGroups();
  return (
    <>
      <Suspense fallback={<div className="hx-ph" />}>
        <SiteHeaderData />
      </Suspense>
      <Suspense>
        <WorkerStudio archetypes={archetypes} groups={groups} />
      </Suspense>
    </>
  );
}
