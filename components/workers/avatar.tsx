import { Icon } from "@/components/simulator/icons";
import type { Archetype } from "@/lib/workers/types";

/** Short industry names for the job list. */
export const SHORT_SECTOR: Record<string, string> = {
  "Agriculture (logging and farm support)": "Agriculture",
  "Transportation and warehousing": "Transport",
  "Professional, scientific and technical services": "Professional services",
  "Management of companies": "Management",
  "Administrative and support services": "Admin and support",
  "Health care and social assistance": "Health care",
  "Arts, entertainment and recreation": "Arts and recreation",
  "Accommodation and food services": "Food and hotels",
};

/** A job's round portrait, or a person icon until the portrait exists. */
export function Avatar({ a, size }: { a: Archetype; size: number }) {
  return (
    <span className="ws-avatar" style={{ width: size, height: size }}>
      {a.portraitUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={a.portraitUrl} alt="" />
      ) : (
        <Icon name="person" size={Math.round(size * 0.45)} stroke={1.6} />
      )}
    </span>
  );
}
