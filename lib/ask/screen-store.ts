"use client";

/**
 * What's on screen, for the Ask AI panel. The summary and details pages publish their facts here;
 * the panel reads them when a question is sent. A tiny store, so the pages don't need a provider.
 */
import { useEffect, useSyncExternalStore } from "react";
import type { Screen } from "./schema";

let current: Screen | null = null;
const listeners = new Set<() => void>();

function set(next: Screen | null) {
  current = next;
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

/** Publish what this page shows. Clears it when the page goes away. */
export function usePublishScreen(screen: Screen | null) {
  // Compare by content, so a new object with the same facts doesn't churn.
  const key = screen ? JSON.stringify(screen) : "";
  useEffect(() => {
    set(key ? (JSON.parse(key) as Screen) : null);
  }, [key]);
  useEffect(() => () => set(null), []);
}

/** The latest facts on screen, or null while the page is still loading. */
export function useScreen(): Screen | null {
  return useSyncExternalStore(subscribe, () => current, () => null);
}
