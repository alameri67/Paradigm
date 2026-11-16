import { getSimData } from "@/lib/sim/data";

/**
 * GET /api/sim-data — the validated simulator dataset as JSON.
 * Lets other tools (notebooks, a future admin UI, other front ends) read the
 * same data the simulator renders.
 */
export async function GET() {
  return Response.json(await getSimData());
}
