import { connection } from "next/server";
import { listInterviewed } from "@/lib/workers/data";

/** GET /api/workers — the IDs of every worker version interviewed so far. */
export async function GET() {
  await connection();
  return Response.json({ interviewed: await listInterviewed() });
}
