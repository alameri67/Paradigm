"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SCENARIOS, type ScenarioCode } from "@/lib/workers/types";

const CODES = SCENARIOS.map((s) => s.code) as ScenarioCode[];
/** How far the bottom half slides at each dial stop, mildest to most extreme. */
const SHIFT = [0, 0.04, 0.1, 0.17, 0.26];

/**
 * The Paradigm name, split across the middle. It follows the AI scenario dial
 * (kept in the address bar as ?s=): the bigger the change, the further the halves part.
 */
export function ShiftHeader() {
  const s = useSearchParams().get("s");
  // The dial starts at the far right (AGI by 2028) when no scenario is set.
  const at = CODES.includes(s as ScenarioCode) ? CODES.indexOf(s as ScenarioCode) : CODES.length - 1;
  return (
    <header className="hx hx-shift" style={{ ["--shift" as string]: `${SHIFT[at]}em` }}>
      <Link href="/" className="hx-shift-name" aria-label="Paradigm, home">
        <span className="hx-shift-top" aria-hidden="true">Paradigm</span>
        <span className="hx-shift-bottom" aria-hidden="true">Paradigm</span>
      </Link>
      <p className="hx-shift-cap">
        The bigger the change, the further the name splits. Now: <b>{SCENARIOS[at].name}</b>
      </p>
    </header>
  );
}
