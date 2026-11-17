"use client";

import * as React from "react";

// Paradigm: a minimal stand-in for the weather card's missing useAwake.
/** Whether an element is on screen. Returns a ref callback to attach and the current visibility. */
export function useAwake(): [(el: Element | null) => void, boolean] {
  const [awake, setAwake] = React.useState(false);
  const observer = React.useRef<IntersectionObserver | null>(null);
  const watch = React.useCallback((el: Element | null) => {
    observer.current?.disconnect();
    observer.current = null;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setAwake(true);
      return;
    }
    observer.current = new IntersectionObserver(([entry]) => setAwake(entry.isIntersecting));
    observer.current.observe(el);
  }, []);
  React.useEffect(() => () => observer.current?.disconnect(), []);
  return [watch, awake];
}
