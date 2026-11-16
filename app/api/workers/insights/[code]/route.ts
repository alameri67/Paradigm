import { connection, type NextRequest } from "next/server";
import { getJobInsights } from "@/lib/workers/data";

/** GET /api/workers/insights/A01 — what this job's workers do as a group, per scenario. */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/workers/insights/[code]">) {
  await connection();
  const { code } = await ctx.params;
  return Response.json({ insights: await getJobInsights(code) });
}
