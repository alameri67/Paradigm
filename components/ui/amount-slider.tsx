"use client";

import { useEffect, useLayoutEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";

/**
 * Snapping "amount" slider with a shimmering grid of squares in the track.
 * The squares behind the thumb get busier as the value rises, and their
 * colour moves through --stop0..--stop4. A large code rolls like a counter.
 *
 * Port of the AmountSlider component used in the prototype.
 */
export interface AmountStop {
  code: string;
  name: string;
  year: string;
  description: string;
}

export interface AmountSliderProps {
  stops: AmountStop[];
  value: number;
  onChange: (value: number) => void;
  labelledBy?: string;
  /** Show the big rolling code and description above the track. Default true. */
  showHeader?: boolean;
}

const CELL = 6;
const GAP = 1;
const THUMB = 24;

function cellHash(x: number, y: number) {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function stopPos(i: number, n: number) {
  return `calc(${i / (n - 1)} * (100% - ${THUMB}px) + ${THUMB / 2}px)`;
}

export function AmountSlider({ stops, value, onChange, labelledBy, showHeader = true }: AmountSliderProps) {
  const n = stops.length;
  const cur = Math.max(0, Math.min(n - 1, value));
  const lv = stops[cur];

  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const valueRef = useRef(cur);
  const redrawRef = useRef<() => void>(() => {});
  const [dragging, setDragging] = useState(false);

  useLayoutEffect(() => {
    valueRef.current = cur;
    redrawRef.current();
  }, [cur]);

  /* ---- the shimmer ---- */
  useEffect(() => {
    const track = trackRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduceMotion = !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let running = !reduceMotion;
    let last = performance.now();
    let phase = 0;
    let hintPhase = 0;

    function draw(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const fill = valueRef.current / (n - 1);
      const accent = getComputedStyle(track).color || "rgb(37 99 235)";
      phase += dt * (0.3 + fill * 3.2);
      hintPhase += dt;
      ctx!.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      const sq = CELL - GAP;
      const fillPx = THUMB / 2 + fill * (w - THUMB);
      const bandPx = fill * 0.6 * w;
      const hintStrength = 0.15 * (1 - fill);
      ctx!.fillStyle = accent;
      for (let cx = 0; cx < cols; cx++) {
        const cellPx = cx * CELL + CELL / 2;
        let colBase: number;
        let isTail: boolean;
        if (cellPx <= fillPx) {
          if (bandPx <= 0.5) continue;
          const band = 1 - (fillPx - cellPx) / bandPx;
          if (band <= 0) continue;
          colBase = band * band;
          isTail = true;
        } else {
          if (hintStrength <= 0.002) continue;
          const reach = w - fillPx;
          const along = reach > 0 ? (cellPx - fillPx) / reach : 0;
          const envelope = Math.sin(along * Math.PI);
          const pulse = 0.5 + 0.5 * Math.sin((cellPx / w) * 5 - hintPhase * 4.5);
          colBase = hintStrength * envelope * pulse;
          if (colBase <= 0.002) continue;
          isTail = false;
        }
        for (let cy = 0; cy < rows; cy++) {
          const ph = cellHash(cx, cy) * Math.PI * 2;
          const stat = 0.6 + 0.4 * cellHash(cx + 7.3, cy - 3.1);
          let anim: number;
          if (reduceMotion) anim = 1;
          else if (isTail) anim = 0.35 + 0.325 * (1 + Math.sin(phase * 2.4 + cx * 0.9 + cy * 0.4 + ph));
          else anim = 0.6 + 0.4 * (0.5 + 0.5 * Math.sin(phase * 1.7 + ph));
          const a = Math.max(0, Math.min(1, colBase * stat * anim));
          if (a < 0.015) continue;
          ctx!.globalAlpha = a;
          ctx!.fillRect(cx * CELL, cy * CELL, sq, sq);
        }
      }
      ctx!.globalAlpha = 1;
      if (running) raf = requestAnimationFrame(draw);
    }

    const start = () => {
      if (reduceMotion || running) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(draw);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    redrawRef.current = () => {
      // The colour transition on the track takes 300ms; repaint a few times
      // when the animation loop is not running so the still frame catches up.
      if (running) return;
      draw(performance.now());
      setTimeout(() => !running && draw(performance.now()), 320);
    };

    const ro = new ResizeObserver(() => {
      w = track.clientWidth;
      h = track.clientHeight;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (!running) draw(performance.now());
    });
    ro.observe(track);
    const io = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) start();
      else stop();
    });
    io.observe(track);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    if (running) raf = requestAnimationFrame(draw);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      redrawRef.current = () => {};
    };
  }, [n]);

  /* ---- pointer: magnetise to the nearest stop while dragging ---- */
  function stopAt(clientX: number) {
    const r = trackRef.current!.getBoundingClientRect();
    const f = (clientX - r.left - THUMB / 2) / Math.max(1, r.width - THUMB);
    return Math.round(Math.max(0, Math.min(1, f)) * (n - 1));
  }
  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    e.preventDefault();
    try {
      rootRef.current!.setPointerCapture(e.pointerId);
    } catch {
      /* ignore */
    }
    setDragging(true);
    thumbRef.current!.focus({ preventScroll: true });
    onChange(stopAt(e.clientX));
  }
  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (!dragging) return;
    const l = stopAt(e.clientX);
    if (l !== cur) onChange(l);
  }
  function onKeyDown(e: KeyboardEvent<HTMLSpanElement>) {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };
    let next: number;
    if (e.key in keys) next = cur + keys[e.key];
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    else return;
    e.preventDefault();
    onChange(Math.max(0, Math.min(n - 1, next)));
  }

  const digit = Number(lv.code.replace(/\D/g, "")) || 0;
  const prefix = lv.code.replace(/\d+$/, "");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {showHeader && (
      <div className="amount-head">
        <span className="readout" role="status" aria-label={lv.code}>
          <span aria-hidden="true">{prefix}</span>
          <span className="roll" aria-hidden="true">
            <span className="roll-col" style={{ transform: `translateY(-${digit}em)` }}>
              {Array.from({ length: 10 }, (_, d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        </span>
        <span className="amount-desc">
          <span>{lv.description}</span>
          <span className="mono">{/^\d{4}$/.test(lv.year) ? `By ${lv.year}` : ""}</span>
        </span>
      </div>
      )}

      <div
        ref={rootRef}
        className={"amount" + (dragging ? " dragging" : "")}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={() => setDragging(false)}
        onPointerCancel={() => setDragging(false)}
      >
        <span ref={trackRef} className="amount-track" style={{ color: `var(--stop${Math.min(cur, 4)})` }}>
          <canvas ref={canvasRef} aria-hidden="true" />
          {stops.map((s, i) => (
            <span key={s.code} className={"amount-tick" + (i <= cur ? " on" : "")} style={{ left: stopPos(i, n) }} />
          ))}
        </span>
        <span
          ref={thumbRef}
          className="amount-thumb"
          role="slider"
          tabIndex={0}
          aria-labelledby={labelledBy}
          aria-valuemin={0}
          aria-valuemax={n - 1}
          aria-valuenow={cur}
          aria-valuetext={showHeader ? `${lv.code}, ${lv.description}, ${lv.year}` : `${lv.name}. ${lv.description}`}
          style={{ left: stopPos(cur, n) }}
          onKeyDown={onKeyDown}
        />
      </div>

      <div className="amount-labels">
        {stops.map((s, i) => (
          <button
            key={s.code}
            type="button"
            tabIndex={-1}
            className={"amount-label" + (i === cur ? " on" : i < cur ? " past" : "")}
            style={{ left: i === 0 ? "0" : i === n - 1 ? "100%" : stopPos(i, n) }}
            onClick={() => onChange(i)}
          >
            <span className="nm">{s.name}</span>
            <span className="mono">{s.year}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
