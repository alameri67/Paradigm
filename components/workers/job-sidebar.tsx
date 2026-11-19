"use client";

import Link from "next/link";
import type { Archetype } from "@/lib/workers/types";
import { Avatar, SHORT_SECTOR } from "./avatar";

/**
 * The left-hand job list, shared by the summary (/) and the details page (/details).
 * On the summary you can tick several jobs; on the details page you pick one.
 */
export function JobSidebar({
  archetypes,
  counts,
  page,
  selected,
  summaryHref,
  detailsHref,
  onPick,
  onToggle,
  onSelectAll,
  onUnselectAll,
}: {
  archetypes: Archetype[];
  counts: Record<string, number>;
  page: "summary" | "details";
  selected: string[];
  summaryHref: string;
  detailsHref: string;
  /** Details page: show this job. */
  onPick?: (code: string) => void;
  /** Summary: add or remove this job. */
  onToggle?: (code: string) => void;
  onSelectAll?: () => void;
  onUnselectAll?: () => void;
}) {
  const multi = page === "summary";
  return (
    <nav className="ws-jobs" aria-label="Jobs">
      <div className="js-tabs" role="tablist" aria-label="Pages">
        <Link href={summaryHref} role="tab" aria-selected={page === "summary"} className={"js-tab" + (page === "summary" ? " on" : "")}>
          Summary
        </Link>
        <Link href={detailsHref} role="tab" aria-selected={page === "details"} className={"js-tab" + (page === "details" ? " on" : "")}>
          Details
        </Link>
      </div>
      <div className="ws-jobs-head">
        <h2 className="label">Jobs</h2>
        {multi && (
          <span className="js-bulk">
            <button type="button" onClick={onSelectAll}>
              Select all
            </button>
            <span aria-hidden="true">·</span>
            <button type="button" onClick={onUnselectAll}>
              Unselect all
            </button>
          </span>
        )}
      </div>
      {archetypes.map((x) => {
        const on = selected.includes(x.code);
        const n = counts[x.code] ?? 0;
        const off = multi && !n;
        return (
          <button
            key={x.code}
            type="button"
            className={"ws-job" + (on ? " on" : "") + (multi ? " js-multi" : "")}
            aria-pressed={multi ? on : undefined}
            aria-current={!multi && on ? "true" : undefined}
            disabled={off}
            title={off ? "No interviews yet" : undefined}
            onClick={() => (multi ? onToggle?.(x.code) : onPick?.(x.code))}
          >
            {/* Same slot on both pages, so rows keep one shape: a tick box here (pick several), a radio dot there (pick one). */}
            <span className={"js-check" + (multi ? "" : " js-radio") + (on ? " on" : "")} aria-hidden="true" />
            <Avatar a={x} size={32} />
            <span className="ws-job-text">
              <span className="ws-job-name">{x.job}</span>
              <span className="ws-job-sector">{SHORT_SECTOR[x.sector] ?? x.sector}</span>
            </span>
            <span className="ws-job-count mono" title="Versions interviewed">
              {n || "–"}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
