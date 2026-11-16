import { Suspense } from "react";
import { SimulatorProvider } from "@/components/simulator/simulator-context";
import { SimulatorShell } from "@/components/simulator/simulator-shell";
import { SimulatorSkeleton } from "@/components/simulator/skeleton";
import { getSimData } from "@/lib/sim/data";

export default async function Home() {
  const data = await getSimData();
  return (
    // The simulator reads its starting state from the URL, so it renders on the client.
    <Suspense fallback={<SimulatorSkeleton />}>
      <SimulatorProvider data={data}>
        <SimulatorShell />
      </SimulatorProvider>
    </Suspense>
  );
}
