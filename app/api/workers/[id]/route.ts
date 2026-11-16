import { connection, type NextRequest } from "next/server";
import { getWorker } from "@/lib/workers/data";

/** GET /api/workers/A16-22222 — one worker version's profile, and its interview if it has one. */
export async function GET(_req: NextRequest, ctx: RouteContext<"/api/workers/[id]">) {
  await connection();
  const { id } = await ctx.params;
  const found = await getWorker(id);
  if (!found) return Response.json({ error: "Unknown worker" }, { status: 404 });
  return Response.json(found);
}
