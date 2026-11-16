"use client";

import { useRef, type PointerEvent, type ReactNode } from "react";

/**
 * Gentle 3D tilt that follows the mouse, from the interactive product card
 * (card-7). Touch and reduced-motion users get a still element.
 */
export function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const reduce = () =>
    typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  function onMove(e: PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse" || reduce()) return;
    const r = el.getBoundingClientRect();
    const rx = ((e.clientY - r.top - r.height / 2) / (r.height / 2)) * -8;
    const ry = ((e.clientX - r.left - r.width / 2) / (r.width / 2)) * 8;
    el.style.transition = "transform .1s ease-out";
    el.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale3d(1.05,1.05,1.05)`;
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.transition = "transform .4s ease-in-out";
    el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  }

  return (
    <div ref={ref} className={className} onPointerMove={onMove} onPointerLeave={onLeave}>
      {children}
    </div>
  );
}
