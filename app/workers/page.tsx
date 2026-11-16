import type { Metadata } from "next";
import { Suspense } from "react";
import { WorkerStudio } from "@/components/workers/worker-studio";
import { archetypes, getGroups } from "@/lib/workers/data";

export const metadata: Metadata = { title: "Workers · AI Transition Simulator" };

export default async function WorkersPage() {
  const groups = await getGroups();
  return (
    <Suspense>
      <WorkerStudio archetypes={archetypes} groups={groups} />
    </Suspense>
  );
}
