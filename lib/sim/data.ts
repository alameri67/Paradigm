import "server-only";
import raw from "@/data/sim-data.json";
import { simDataSchema } from "./schema";
import type { SimData } from "./types";

/**
 * The single place the platform reads simulator data from.
 *
 * Today it validates the bundled sample file. To move to a database or CMS,
 * replace the body with a fetch/query that returns the same shape; the
 * schema check keeps bad data from reaching the UI.
 */
export async function getSimData(): Promise<SimData> {
  return simDataSchema.parse(raw);
}
