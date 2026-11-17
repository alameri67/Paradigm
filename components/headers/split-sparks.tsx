"use client";

import { useEffect, useRef } from "react";

/**
 * Dust that drifts out of the middle of the logo's diagonal split. It runs along the cut, both ways, with a
 * little spread off it, rising slightly as it fades. `level` (0–1) follows the AI scenario: none at the mildest stop, a steady stream at the most
 * extreme. Paused under reduced motion and while the tab is hidden.
 */
export function SplitSparks({ level }: { level: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const levelRef = useRef(level);
  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  useEffect(() => {
    const canvas = ref.current;
    const box = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !box || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    type P = { x: number; y: number; vx: number; vy: number; life: number; max: number; r: number; c: string };
    const parts: P[] = [];
    let w = 0, h = 0, dpr = 1, raf = 0, last = performance.now(), carry = 0;
    // The cut, in the name box: from 68% down on the left to 32% down on the right (matches the clip-paths).
    const pad = 40;
    const resize = () => {
      const r = box.getBoundingClientRect();
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = r.width + pad * 2;
      h = r.height + pad * 2;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(box);

    const spawn = () => {
      const bw = w - pad * 2, bh = h - pad * 2;
      const dx = bw, dy = -0.36 * bh;
      const len = Math.hypot(dx, dy);
      const ux = dx / len, uy = dy / len;
      // Born near the middle of the cut, a little either side of it.
      const t = (Math.random() - 0.5) * 0.16;
      const x = pad + bw / 2 + ux * t * len;
      const y = pad + bh * 0.5 + uy * t * len;
      const dir = Math.random() < 0.5 ? -1 : 1;
      // Chosen in the logo lab: dust, speed 0.5×, size 1.2×, amount 2.7×, black.
      const speed = (60 + Math.random() * 140 * (0.5 + levelRef.current)) * 0.5 * 0.45;
      const spread = (Math.random() - 0.5) * 0.5;
      const vx = (ux * dir - uy * spread) * speed;
      const vy = (uy * dir + ux * spread) * speed;
      const max = 1.2 + Math.random() * 0.7;
      parts.push({ x, y, vx, vy, life: 0, max, r: (0.6 + Math.random()) * 1.2, c: "13,13,13" });
    };

    const frame = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const lv = levelRef.current;
      carry += dt * lv * 90 * 2.7;
      while (carry >= 1) {
        spawn();
        carry -= 1;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i];
        p.life += dt;
        if (p.life >= p.max) {
          parts.splice(i, 1);
          continue;
        }
        p.vx *= 0.97;
        p.vy *= 0.97;
        p.vy -= 12 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = 1 - p.life / p.max;
        ctx.fillStyle = `rgba(${p.c},${(a * 0.9).toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * (0.6 + 0.4 * a), 0, Math.PI * 2);
        ctx.fill();
      }
      raf = parts.length || lv > 0 ? requestAnimationFrame(frame) : 0;
    };
    const start = () => {
      if (!raf && !document.hidden) {
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };
    const onVis = () => (document.hidden ? (cancelAnimationFrame(raf), (raf = 0)) : start());
    document.addEventListener("visibilitychange", onVis);
    const poll = window.setInterval(start, 300);
    start();
    return () => {
      cancelAnimationFrame(raf);
      window.clearInterval(poll);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className="hx-sparks" aria-hidden="true" />;
}
