"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { createLiquidPill, type LiquidPillHandle, type LiquidPillItem } from "@/lib/ui/liquid-pill";

/**
 * Liquid glass segmented control: a React wrapper around the plain-TS port of
 * the Nimbus "Waterline" navbar (by guglielmogiannattasio.it). The WebGL water
 * and spring physics live in lib/ui/liquid-pill.ts; this component only mounts
 * it and keeps the selected item in sync with React state.
 *
 * mode="nav" renders a <nav> with aria-current; mode="radio" renders a
 * radiogroup with roving tab index.
 */
export interface LiquidGlassNavbarProps {
  items: LiquidPillItem[];
  active: number;
  onChange: (index: number) => void;
  mode?: "nav" | "radio";
  size?: "sm";
  compact?: "auto" | boolean;
  ariaLabel?: string;
  labelledBy?: string;
  className?: string;
}

export function LiquidGlassNavbar({
  items,
  active,
  onChange,
  mode = "nav",
  size,
  compact,
  ariaLabel,
  labelledBy,
  className,
}: LiquidGlassNavbarProps) {
  const slot = useRef<HTMLSpanElement>(null);
  const handle = useRef<LiquidPillHandle | null>(null);
  const onChangeRef = useRef(onChange);
  const activeRef = useRef(active);

  useLayoutEffect(() => {
    onChangeRef.current = onChange;
    activeRef.current = active;
  });

  // Rebuild only when the items themselves change (labels, icons).
  const itemsKey = JSON.stringify(items);
  useEffect(() => {
    const h = createLiquidPill({
      items: JSON.parse(itemsKey) as LiquidPillItem[],
      active: activeRef.current,
      mode,
      size,
      compact,
      ariaLabel,
      labelledBy,
      className,
      onChange: (i) => onChangeRef.current(i),
    });
    slot.current!.appendChild(h.el);
    handle.current = h;
    return () => {
      h.destroy();
      handle.current = null;
    };
  }, [itemsKey, mode, size, compact, ariaLabel, labelledBy, className]);

  useEffect(() => {
    handle.current?.setActive(active);
  }, [active]);

  return <span ref={slot} style={{ display: "contents" }} />;
}
